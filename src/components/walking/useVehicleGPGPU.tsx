import { uniformData } from './useLightsTime';
import { 
    pathData, 
    pathBuffer, 
    pathBufferLengths,
    pathBufferIndexes,
    pathBufferTotalLength,
    crosswalkPointsBufferIndexes,
    crosswalkPointsBufferLanes,
    crosswalkPointsBufferLocal,
    trafficConditionsBuffer
} from './pathData';
import { useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';
import { Vector3 } from 'three';

console.log({ 
    pathData, 
    pathBuffer, 
    pathBufferLengths,
    pathBufferIndexes,
    pathBufferTotalLength,
    crosswalkPointsBufferIndexes,
    crosswalkPointsBufferLanes,
    crosswalkPointsBufferLocal,
    trafficConditionsBuffer
});

const simulationPositionFragmentShader = `
    uniform int uSize;
    uniform float uTime;
    uniform float uDeltaTime;

    void main() {
        float time = uTime;
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec4 positionData = texture(uPosition, uv);
        vec4 directionData = texture(uDirection, uv);
        vec4 destinationData = texture(uDestination, uv);

        vec3 positionDataCalc = vec3(positionData.xyz);
        vec3 directionDataCalc = vec3(directionData.xyz);
        vec3 destinationDataCalc = vec3(
            destinationData.x,
            0.1,
            destinationData.z
        );

        positionDataCalc.y = 0.0;
        vec4 finalPosition = vec4(positionDataCalc, 1.0) + vec4(clamp(directionDataCalc * .075 * directionData.w, -1.0, 1.0), 0.0);

        float destinationPathIndex = destinationData.w;
        float distanceToDestination = distance(positionDataCalc, destinationDataCalc);
        if(destinationData.w < 1.0 && distanceToDestination > 100.0) {
            finalPosition = vec4(
                destinationDataCalc.x,
                0.1,
                destinationDataCalc.z,
                positionData.w
            );
        }

        gl_FragColor = finalPosition;
    }
`
const simulationDirectionFragmentShader = `
    uniform int uSize;
    uniform float uTime; // seconds as float
    uniform float uDeltaTime;
    uniform int uLightTimes[${uniformData.lightsUniformArray.length}];
    uniform int uLightTimesTotalLength;
    uniform int uTrafficConditionsBuffer[${trafficConditionsBuffer.length}];
    uniform int uCrosswalkPointsBufferIndexes[${crosswalkPointsBufferIndexes.length}];
    uniform float uPathBuffer[${pathBuffer.length}];

    void main() {
        float time = uTime;

        int activeLightNumber = 0;
        int activeLightTimeLeft = 0;

        float totalCycleTime = float(uLightTimesTotalLength);
        float cycleTime = mod(time, totalCycleTime);
        float cycleTimeCheckValue = 0.0;

        for(int lightIndex = 0; lightIndex < ${uniformData.lightsUniformArray.length}; lightIndex++) {
            float lightTimeCheck = float(uLightTimes[lightIndex]);
            if(cycleTime > cycleTimeCheckValue) {
                activeLightNumber = lightIndex;
                cycleTimeCheckValue += lightTimeCheck;
                activeLightTimeLeft = int(cycleTimeCheckValue - cycleTime);
            }
        }

        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec4 positionData = texture(uPosition, uv);
        vec4 directionData = texture(uDirection, uv);
        vec4 destinationData = texture(uDestination, uv);

        vec3 positionDataCalc = vec3(positionData.xyz);
        vec3 directionDataCalc = vec3(directionData.xyz);
        vec3 destinationDataCalc = vec3(destinationData.x, 0.0, destinationData.z);

        vec3 directionToDestination = normalize(destinationDataCalc - positionDataCalc);
        float interpolationFactor = .25;//clamp(uTime * .01, 0.0, 1.0);

        float distanceToDestination = distance(positionDataCalc, destinationDataCalc);
        vec3 mixDirectionDestination = directionDataCalc;        
        if(distanceToDestination > 1.0) {
            mixDirectionDestination = mix(directionDataCalc, directionToDestination, interpolationFactor);        
        }

        vec4 velocity = vec4(mixDirectionDestination, 2.0 + uv.x * 1.5);        

        float checkDistanceMin = 10.0;
        float lowestCheckDistance = 1000.0;
        vec3 upVector = vec3(0.0, 1.0, 0.0);
        vec3 rightVector = normalize(cross(upVector, directionDataCalc));
        vec3 leftVector = rightVector * -1.0;
        int numberOfPotentialCollisions = 0;
        bool isFrontCollision = false;
        bool isRightCollision = false;
        bool frontIsShortest = false;

        for(int i = 0; i < uSize; i++) {
            for(int j = 0; j < uSize; j++) {
                vec2 checkUV = vec2(float(i), float(j)) / resolution.xy;
                vec4 checkVehiclePosition = texture(uPosition, checkUV);
                vec4 checkVehicleDirection = texture(uDestination, checkUV);
                vec3 checkVehiclePositionCalc = vec3(checkVehiclePosition.xyz);
                float checkDistance = distance(positionDataCalc, checkVehiclePositionCalc);
                // if(checkDistance < checkDistanceMin && checkDistance > 0.001) {
                if(
                    checkDistance < checkDistanceMin && 
                    checkDistance > 0.001 && 
                    // checkDistance < lowestCheckDistance &&
                    distanceToDestination > .1
                ) {
                    lowestCheckDistance = checkDistance;
                    numberOfPotentialCollisions += 1;

                    vec3 frontCheckPosition = positionDataCalc + normalize(directionDataCalc) * .001;
                    vec3 backCheckPosition = positionDataCalc + normalize(directionDataCalc) * -.001;
                    // vec3 rightCheckPosition = positionDataCalc + rightVector * .001;
                    // vec3 leftCheckPosition = positionDataCalc + leftVector * .001;

                    float frontDistance = distance(frontCheckPosition, checkVehiclePositionCalc);
                    float backDistance = distance(backCheckPosition, checkVehiclePositionCalc);
                    // float rightDistance = distance(rightCheckPosition, checkVehiclePositionCalc);
                    // float leftDistance = distance(leftCheckPosition, checkVehiclePositionCalc);

                    vec3 frontCollisonCheckPosition0 = positionDataCalc + normalize(directionDataCalc) * 3.0;// - uv.x * 3.0;
                    vec3 frontCollisonCheckPosition1 = positionDataCalc + normalize(directionDataCalc) * 6.0;// - uv.x * 2.0;
                    vec3 frontCollisonCheckPosition2 = positionDataCalc + normalize(directionDataCalc) * 9.0;// - uv.y * 1.5;

                    isFrontCollision = frontDistance < backDistance;
                    // isRightCollision = rightDistance < leftDistance;
                    float frontCollisionCheckDistance = 4.0;
                    if(isFrontCollision) {
                        float frontCollisionDistance0 = distance(frontCollisonCheckPosition0, checkVehiclePositionCalc);
                        float frontCollisionDistance1 = distance(frontCollisonCheckPosition1, checkVehiclePositionCalc);
                        float frontCollisionDistance2 = distance(frontCollisonCheckPosition2, checkVehiclePositionCalc);
                        if(
                            frontCollisionDistance0 < frontCollisionCheckDistance || 
                            frontCollisionDistance1 < frontCollisionCheckDistance || 
                            frontCollisionDistance2 < frontCollisionCheckDistance
                        ) {
                            velocity.w = 0.0;
                        }
                    }

                }
            }
        }

        float pathNumber = destinationData.y;
        int pathNumberInt = int(pathNumber);
        int trafficConditionsBooleanNumber = uTrafficConditionsBuffer[(pathNumberInt * 4) + activeLightNumber];
        int crosswalkPointABufferIndex = uCrosswalkPointsBufferIndexes[pathNumberInt * 2];
        vec3 crosswalkPointAVec3 = vec3(
            uPathBuffer[crosswalkPointABufferIndex * 3],
            uPathBuffer[(crosswalkPointABufferIndex * 3) + 1],
            uPathBuffer[(crosswalkPointABufferIndex * 3) + 2]
        );
        float distanceToCrosswalkPointAVec3 = distance(crosswalkPointAVec3, positionDataCalc);

        if((distanceToCrosswalkPointAVec3 < 2.0 && activeLightTimeLeft < 5) || (distanceToCrosswalkPointAVec3 < 2.0 && trafficConditionsBooleanNumber == 0)) {
            velocity.w = 0.0;
        }

        // if(trafficConditionsBooleanNumber == 0) {
        //     velocity.w = 0.0;
        // }



        // if(numberOfPotentialCollisions < 1) {
        //     velocity.w = 1.0;
        // }

        // if(distanceToDestination < .1) {
        //     velocity.w = 0.0;
        // };

        // // still testing
        // // implemented to prevent double stragglers
        // if(lowestCheckDistance < .5 && numberOfPotentialCollisions > 0) {
        //     velocity.w = 1.0;
        // };

        // if(isFrontCollision == true && numberOfPotentialCollisions > 0 && distanceToDestination < 1.5) {
        //     velocity.w = 0.0;
        // }

        // int currentLocation = int(destinationData.y); // current position graph.number
        // int currentDestination = int(destinationData.w); // current position graph.number
        // int currentLocationConnectionIndex = 0;//int(uConnectionsData[0]);

        // for(int i = 0; i < 6; i++) {
        //     if(int(uConnectionsData[(currentLocation * 6) + i]) == currentDestination) {
        //         currentLocationConnectionIndex = i;
        //     }
        // }

        // int canMoveToDestination = uConnectionsWalkConditionsData[
        //     (currentLocation * 20) + (currentLocationConnectionIndex * 4) + activeLightNumber
        // ];

        // float canMoveToDestinationModifier = float(canMoveToDestination);

        // vec3 currentLocationCenter = vec3(
        //     uPositionsData[(5 * currentLocation) + 0], 
        //     uPositionsData[(5 * currentLocation) + 1],
        //     uPositionsData[(5 * currentLocation) + 2] 
        // );

        // int loopActiveLightNumber = 1 + activeLightNumber;
        // if(loopActiveLightNumber > 3) {
        //     loopActiveLightNumber = 0;
        // }
        // int nextCanMoveToDestination = uConnectionsWalkConditionsData[
        //     (currentLocation * 20) + (currentLocationConnectionIndex * 4) + loopActiveLightNumber
        // ];

        // float checkDistanceFromStart = distance(positionDataCalc, currentLocationCenter);
        // float checkDistanceToDestination = distanceToDestination;
        // if(activeLightTimeLeft < 25 && checkDistanceFromStart < 9.0 && nextCanMoveToDestination == 0) {
        //     canMoveToDestinationModifier = 0.0;
        // }

        // if(distanceToDestination < checkDistanceFromStart * 1.5 && canMoveToDestinationModifier == 0.0) {
        // // if(distanceToDestination < checkDistanceFromStart && canMoveToDestinationModifier == 0.0) {
        //     canMoveToDestinationModifier = 1.5;
        // }

        // // if(totalCycleTime == 165.0) {
        // // if(activeLightNumber == 1) {
        // // if(uLightTimes[3] == 60) {
        // // if(cycleTime < 45.0) {
        // //     canMoveToDestinationModifier = 0.0;
        // // }

        // velocity.w *= canMoveToDestinationModifier;

        gl_FragColor = velocity;
    }
`

const simulationDestinationFragmentShader = `
    uniform int uSize;
    uniform float uTime;
    uniform float uDeltaTime;
    uniform int graphRows;
    uniform float uPathBuffer[${pathBuffer.length}];
    uniform int uPathBufferLengths[${pathBufferLengths.length}];
    uniform float uPathBufferIndexes[${pathBufferIndexes.length}];
    uniform int PathBufferTotalLength;

    float random(float n) {
        return fract(sin(n + uTime) * 43758.5453123);
    }

    void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec4 destinationData = texture(uDestination, uv);
        vec4 positionData = texture(uPosition, uv);

        vec3 destinationDataCalc = vec3(destinationData.x, 0.0, destinationData.z);
        vec3 positionDataCalc = vec3(positionData.xyz);

        vec4 finalDestination = destinationData;

        float distanceFromDestination = distance(destinationDataCalc, positionDataCalc);

        float currentPathNumber = destinationData.y; // current path number
        int currentPathNumberInt = int(currentPathNumber);

        float currentPathIndex = destinationData.w; // current path index
        int currentPathIndexInt = int(currentPathIndex);

        if(distanceFromDestination <= 1.0) {
            float modNextPathIndex = mod(currentPathIndex + 1.0, float(uPathBufferLengths[currentPathNumberInt]) / 3.0);
            int nextPathIndexInt = int(modNextPathIndex);//currentPathIndexInt + 1;

            int pathBufferPathIndex = int(uPathBufferIndexes[currentPathNumberInt]);
            vec3 pathIndexVector3 = vec3(
                uPathBuffer[pathBufferPathIndex + (nextPathIndexInt * 3)],
                uPathBuffer[pathBufferPathIndex + (nextPathIndexInt * 3) + 1],
                uPathBuffer[pathBufferPathIndex + (nextPathIndexInt * 3) + 2]
            );

            finalDestination = vec4(
                pathIndexVector3.x,
                currentPathNumber,
                pathIndexVector3.z,
                float(nextPathIndexInt)
            );

            // // if(uPathBufferLengths[currentPathNumberInt] == 39) {
            // if(nextPathIndexInt == 13) {
            // // if(nextPathIndexInt == 2) {
            // // if(mod(40.0, float(uPathBufferLengths[currentPathNumberInt])) == 1.0) {
            //     finalDestination = vec4(
            //         0.0,
            //         0.0,
            //         0.0,
            //         0.0
            //     );            
            // }

            // int connectionsLengthInt = uGraphConnectionsLengths[currentDestinationInt];
            // float connectionLength = float(connectionsLengthInt);
            // float randomConnectionLength = random(1.0) * connectionLength;
            // int randomConnectionLengthInt = int(randomConnectionLength);

            // float newDestinationNumber = uConnectionsData[(currentDestinationInt * 6) + randomConnectionLengthInt];
            // int newDestinationNumberInt = int(newDestinationNumber + 1);

            // finalDestination = vec4(
            //     uPositionsData[(5 * newDestinationNumberInt) + 0] + (((random(3.49) * 2.0) - 1.0) * uPositionsData[(5 * newDestinationNumberInt) + 3]) * .25, 
            //     // uPositionsData[(5 * newDestinationNumberInt) + 1],
            //     currentDestination, 
            //     uPositionsData[(5 * newDestinationNumberInt) + 2] + (((random(9.43) * 2.0) - 1.0) * uPositionsData[(5 * newDestinationNumberInt) + 4]) * .25, 
            //     newDestinationNumber
            // );
        }

        gl_FragColor = finalDestination;
    }
`

const simulationStateFragmentShader = `
    uniform int uSize;
    uniform float uTime;
    uniform float uDeltaTime;

    void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec4 stateData = texture(uState, uv);
        gl_FragColor = stateData;
    }
`

const randomNeg1To1 = () => (Math.random() -.5) * 2;

// const startingPositionCalc = new Vector3();
// const destinationPositionCalc = new Vector3();
// const getPersonPosition = (graphPosition, destination = false) => {
//     const calcVector3 = destination === false ? startingPositionCalc : destinationPositionCalc;
//     calcVector3.copy(graphPosition.center);
//     calcVector3.x += randomNeg1To1() * (graphPosition.width / 2)
//     calcVector3.z += randomNeg1To1() * (graphPosition.height / 2)
// }

const startingPosition = new Vector3();
const startingDestination = new Vector3();
const startingPrevPosition = new Vector3();

const dirTowardsPrev = new Vector3();
const dirTowardsNext = new Vector3();

function useVehicleGPGPU(count: number) {
    const size = count * count;
    const gl = useThree((state) => state.gl);

    const [gpgpuRenderer, data] = useMemo(() => {
        const gpgpuRenderer = new GPUComputationRenderer(count, count, gl);

        const positionTexture = gpgpuRenderer.createTexture();
        const directionTexture = gpgpuRenderer.createTexture();
        const destinationTexture = gpgpuRenderer.createTexture();
        const stateTexture = gpgpuRenderer.createTexture();
        const lanes = new Array(24).fill(0);
        // console.log(lanes)

        for (let i = 0; i < size; i++) {
            const i4 = i * 4;
            const modPositionLane = i % crosswalkPointsBufferLanes.length;
            const modPaths = modPositionLane / 2;
            const startingPositionBufferIndex = crosswalkPointsBufferIndexes[modPositionLane];
            const startingPositionBufferIndexLocal = crosswalkPointsBufferLocal[modPositionLane];
//            console.log({startingPositionBufferIndexLocal});
            const startingPositionBufferVector3x = pathBuffer[startingPositionBufferIndex * 3];
            const startingPositionBufferVector3z = pathBuffer[(startingPositionBufferIndex * 3) + 2];
            const startingDestinationBufferVector3x = pathBuffer[(startingPositionBufferIndex + 1) * 3];
            const startingDestinationBufferVector3z = pathBuffer[((startingPositionBufferIndex + 1) * 3) + 2];
            const startingPositionPreviousVector3x = pathBuffer[(startingPositionBufferIndex * 3) - 3];
            const startingPositionPreviousVector3z = pathBuffer[(startingPositionBufferIndex * 3) - 1];

            startingPosition.set(startingPositionBufferVector3x, 0.0, startingPositionBufferVector3z);
            startingDestination.set(startingDestinationBufferVector3x, 0.0, startingDestinationBufferVector3z);
            startingPrevPosition.set(startingPositionPreviousVector3x, 0.0, startingPositionPreviousVector3z);

            dirTowardsPrev.copy(startingPrevPosition).sub(startingPosition).normalize();
            dirTowardsNext.copy(startingDestination).sub(startingPosition).normalize();

            // console.log(dirTowardsPrev, dirTowardsNext);
            if(i % 2 === 0) {
                startingPosition.add(dirTowardsPrev.multiplyScalar(lanes[crosswalkPointsBufferLanes[modPositionLane]] * (10 + randomNeg1To1() * .5)));
            } else {
                startingPosition.add(dirTowardsNext.multiplyScalar(lanes[crosswalkPointsBufferLanes[modPositionLane]] * (10 + randomNeg1To1() * .5)));
            }

            // positions
            (positionTexture.image.data as any)[i4 + 0] = startingPosition.x;//startingPositionBufferVector3x;//pathBuffer[3];//randomNeg1To1() * 10; // x
            (positionTexture.image.data as any)[i4 + 1] = 0.01; // y
            (positionTexture.image.data as any)[i4 + 2] = startingPosition.z;//startingPositionBufferVector3z + lanes[crosswalkPointsBufferLanes[modPositionLane]] * 15;//pathBuffer[5] + (lanes[modPositionLane] * 15) + randomNeg1To1() * 2; // z
            (positionTexture.image.data as any)[i4 + 3] = 1.0; // w - graphPosition number
            // (positionTexture.image.data as any)[i4 + 0] = startingPositionBufferVector3x;//pathBuffer[3];//randomNeg1To1() * 10; // x
            // (positionTexture.image.data as any)[i4 + 1] = 0.01; // y
            // (positionTexture.image.data as any)[i4 + 2] = startingPositionBufferVector3z + lanes[crosswalkPointsBufferLanes[modPositionLane]] * 15;//pathBuffer[5] + (lanes[modPositionLane] * 15) + randomNeg1To1() * 2; // z
            // (positionTexture.image.data as any)[i4 + 3] = 1.0; // w - graphPosition number

            // if(i === 0) {
            //     console.log(startingPosition);
            //     console.log(startingPositionBufferVector3x, 0, startingPositionBufferVector3z);
            // }

            lanes[crosswalkPointsBufferLanes[modPositionLane]] += 1;

            // velocities
            (directionTexture.image.data as any)[i4 + 0] = (Math.random() - 0.5); // x
            (directionTexture.image.data as any)[i4 + 1] = 0.0; // y
            (directionTexture.image.data as any)[i4 + 2] = (Math.random() - 0.5); // z
            // (directionTexture.image.data as any)[i4 + 3] = .1; // w
            (directionTexture.image.data as any)[i4 + 3] = 3.0; // w
    
            // destinations
            (destinationTexture.image.data as any)[i4 + 0] = startingDestinationBufferVector3x;//pathBuffer[3];//randomNeg1To1() * 10; // x
            (destinationTexture.image.data as any)[i4 + 1] = modPaths; // y - current path number
            (destinationTexture.image.data as any)[i4 + 2] = startingDestinationBufferVector3z;//pathBuffer[5];//randomNeg1To1() * 10; // z
            (destinationTexture.image.data as any)[i4 + 3] = startingPositionBufferIndexLocal; // w - path destination number

            // states
            (stateTexture.image.data as any)[i4 + 0] = 0.0; // x
            (stateTexture.image.data as any)[i4 + 1] = 0.0; // y
            (stateTexture.image.data as any)[i4 + 2] = 0.0; // z
            (stateTexture.image.data as any)[i4 + 3] = 0.0; // w - destinationPosition number
        }

        // gpugpu variables initialization
        const positionVariable = gpgpuRenderer.addVariable('uPosition', simulationPositionFragmentShader, positionTexture);
        positionVariable.material.uniforms.uSize = { value: size };        
        positionVariable.material.uniforms.uTime = { value: 0 };
        positionVariable.material.uniforms.uDeltaTime = { value: 0 };
        // positionVariable.material.uniforms.uGraphRows = { value: graphArrays.graphPositions.length };
        // positionVariable.material.uniforms.uGraphCols = { value: 10 };

        const directionVariable = gpgpuRenderer.addVariable('uDirection', simulationDirectionFragmentShader, directionTexture);
        directionVariable.material.uniforms.uSize = { value: size };        
        directionVariable.material.uniforms.uTime = { value: 0 };
        directionVariable.material.uniforms.uDeltaTime = { value: 0 };
        // directionVariable.material.uniforms.uConnectionsData = { value: graphArrays.dataConnections };
        // directionVariable.material.uniforms.uConnectionsWalkConditionsData = { value: graphArrays.dataConnectionsWalkConditions };
        // directionVariable.material.uniforms.uPositionsData = { value: graphArrays.dataPositions };
        directionVariable.material.uniforms.uLightTimes = { value: uniformData.lightsUniformArray };
        directionVariable.material.uniforms.uLightTimesTotalLength = { value: uniformData.lightsTotalLengthOfTimeUniformInt };
        directionVariable.material.uniforms.uTrafficConditionsBuffer = { value: trafficConditionsBuffer };
        directionVariable.material.uniforms.uCrosswalkPointsBufferIndexes = { value: crosswalkPointsBufferIndexes };
        directionVariable.material.uniforms.uPathBuffer = { value: pathBuffer };

        const destinationVariable = gpgpuRenderer.addVariable('uDestination', simulationDestinationFragmentShader, destinationTexture);
        destinationVariable.material.uniforms.uSize = { value: size };        
        destinationVariable.material.uniforms.uTime = { value: 0 };
        destinationVariable.material.uniforms.uDeltaTime = { value: 0 };
        destinationVariable.material.uniforms.uPathBuffer = { value: pathBuffer };
        destinationVariable.material.uniforms.uPathBufferLengths = { value: pathBufferLengths };
        destinationVariable.material.uniforms.uPathBufferIndexes = { value: pathBufferIndexes };
        destinationVariable.material.uniforms.uPathBufferTotalLength = { value: pathBufferTotalLength };

        // destinationVariable.material.uniforms.uGraphRows = { value: graphArrays.graphPositions.length };
        // destinationVariable.material.uniforms.uGraphCols = { value: 10 };
        // destinationVariable.material.uniforms.uPositionsData = { value: graphArrays.dataPositions };
        // destinationVariable.material.uniforms.uConnectionsData = { value: graphArrays.dataConnections };
        // destinationVariable.material.uniforms.uTerminationsData = { value: graphArrays.dataTerminations };
        // destinationVariable.material.uniforms.uGraphConnectionsLengths = { value: graphArrays.graphConnectionsLengths };
        // destinationVariable.material.uniforms.uGraphTerminationsLengths = { value: graphArrays.graphTerminationsLengths };
        
        const stateVariable = gpgpuRenderer.addVariable('uState', simulationStateFragmentShader, stateTexture);
        stateVariable.material.uniforms.uSize = { value: size };        
        stateVariable.material.uniforms.uTime = { value: 0 };
        stateVariable.material.uniforms.uDeltaTime = { value: 0 };
        // stateVariable.material.uniforms.uGraphRows = { value: graphArrays.graphPositions.length };
        // stateVariable.material.uniforms.uGraphCols = { value: 10 };

        // init
        gpgpuRenderer.setVariableDependencies(positionVariable, [positionVariable, directionVariable, destinationVariable, stateVariable]);
        gpgpuRenderer.setVariableDependencies(directionVariable, [positionVariable, directionVariable, destinationVariable, stateVariable]);
        gpgpuRenderer.setVariableDependencies(destinationVariable, [positionVariable, directionVariable, destinationVariable, stateVariable]);
        gpgpuRenderer.setVariableDependencies(stateVariable, [positionVariable, directionVariable, destinationVariable, stateVariable]);

        gpgpuRenderer.init();

        return [
            gpgpuRenderer,
            {
                position: {
                    texture: positionTexture,
                    variables: {
                        positionVariable,
                    },
                },
                direction: {
                    texture: directionTexture,
                    variables: {
                        directionVariable,
                    },
                },
                destination: {
                    texture: destinationTexture,
                    variables: {
                        destinationVariable,
                    },
                },
                state: {
                    texture: stateTexture,
                    variables: {
                        stateVariable,
                    },
                },
            },
        ];
    }, [gl, size]);

    useEffect(() => {
        return () => {
            gpgpuRenderer.dispose();
            data.destination.texture.dispose();
            data.direction.texture.dispose();
            data.position.texture.dispose();
            data.state.texture.dispose();
        };
    }, [gpgpuRenderer, data]);

    return { gpgpuRenderer, data };
}

export { useVehicleGPGPU };