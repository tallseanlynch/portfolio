import { uniformData } from './useLightsTime';
import { 
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

        float velocityValue = 2.0 + uv.x * 1.5;
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

        bool crossWalkStop = false;

        for(int i = 0; i < uSize; i++) {
            for(int j = 0; j < uSize; j++) {
                vec2 checkUV = vec2(float(i), float(j)) / resolution.xy;
                vec4 checkVehiclePosition = texture(uPosition, checkUV);
                vec4 checkVehicleDirection = texture(uDestination, checkUV);
                vec3 checkVehiclePositionCalc = vec3(checkVehiclePosition.xyz);
                float checkDistance = distance(positionDataCalc, checkVehiclePositionCalc);
                if(
                    checkDistance < checkDistanceMin && 
                    checkDistance > 0.001 && 
                    distanceToDestination > .1
                ) {
                    lowestCheckDistance = checkDistance;
                    numberOfPotentialCollisions += 1;

                    vec3 frontCheckPosition = positionDataCalc + normalize(directionDataCalc) * .001;
                    vec3 backCheckPosition = positionDataCalc + normalize(directionDataCalc) * -.001;

                    float frontDistance = distance(frontCheckPosition, checkVehiclePositionCalc);
                    float backDistance = distance(backCheckPosition, checkVehiclePositionCalc);

                    vec3 frontCollisonCheckPosition0 = positionDataCalc + normalize(directionDataCalc) * 4.0;// - uv.x * 3.0;
                    vec3 frontCollisonCheckPosition1 = positionDataCalc + normalize(directionDataCalc) * 8.0;// - uv.x * 2.0;
                    vec3 frontCollisonCheckPosition2 = positionDataCalc + normalize(directionDataCalc) * 12.0;// - uv.y * 1.5;

                    isFrontCollision = frontDistance < backDistance;
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
                            velocityValue = 0.0;
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

        if((distanceToCrosswalkPointAVec3 < 2.0 && activeLightTimeLeft < 10) || (distanceToCrosswalkPointAVec3 < 2.0 && trafficConditionsBooleanNumber == 0)) {
            velocityValue = 0.0;
            crossWalkStop = true;
        }

        float mixVelocity = mix(directionData.w, velocityValue, .06);
        velocity.w = mixVelocity;
        if(crossWalkStop == true) {
            velocity.w = 0.0;        
        }
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

        }

        gl_FragColor = finalDestination;
    }
`
const randomNeg1To1 = () => (Math.random() -.5) * 2;

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
        const lanes = new Array(24).fill(0);

        for (let i = 0; i < size; i++) {
            const i4 = i * 4;
            const modPositionLane = i % crosswalkPointsBufferLanes.length;
            const modPaths = modPositionLane / 2;
            const startingPositionBufferIndex = crosswalkPointsBufferIndexes[modPositionLane];
            const startingPositionBufferIndexLocal = crosswalkPointsBufferLocal[modPositionLane];
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

            if(i % 2 === 0) {
                startingPosition.add(dirTowardsPrev.multiplyScalar(lanes[crosswalkPointsBufferLanes[modPositionLane]] * (10 + randomNeg1To1() * .5)));
            } else {
                startingPosition.add(dirTowardsNext.multiplyScalar(lanes[crosswalkPointsBufferLanes[modPositionLane]] * (10 + randomNeg1To1() * .5)));
            }

            // positions
            (positionTexture.image.data as any)[i4 + 0] = startingPosition.x; // x
            (positionTexture.image.data as any)[i4 + 1] = 0.01; // y
            (positionTexture.image.data as any)[i4 + 2] = startingPosition.z; // z
            (positionTexture.image.data as any)[i4 + 3] = 1.0; // w - graphPosition number

            lanes[crosswalkPointsBufferLanes[modPositionLane]] += 1;

            // velocities
            (directionTexture.image.data as any)[i4 + 0] = (Math.random() - 0.5); // x
            (directionTexture.image.data as any)[i4 + 1] = 0.0; // y
            (directionTexture.image.data as any)[i4 + 2] = (Math.random() - 0.5); // z
            (directionTexture.image.data as any)[i4 + 3] = 0.0; // w
    
            // destinations
            (destinationTexture.image.data as any)[i4 + 0] = startingDestinationBufferVector3x; // x
            (destinationTexture.image.data as any)[i4 + 1] = modPaths; // y - current path number
            (destinationTexture.image.data as any)[i4 + 2] = startingDestinationBufferVector3z; // z
            (destinationTexture.image.data as any)[i4 + 3] = startingPositionBufferIndexLocal; // w - path destination number
        }

        // gpugpu variables initialization
        const positionVariable = gpgpuRenderer.addVariable('uPosition', simulationPositionFragmentShader, positionTexture);
        positionVariable.material.uniforms.uSize = { value: size };        
        positionVariable.material.uniforms.uTime = { value: 0 };
        positionVariable.material.uniforms.uDeltaTime = { value: 0 };

        const directionVariable = gpgpuRenderer.addVariable('uDirection', simulationDirectionFragmentShader, directionTexture);
        directionVariable.material.uniforms.uSize = { value: size };        
        directionVariable.material.uniforms.uTime = { value: 0 };
        directionVariable.material.uniforms.uDeltaTime = { value: 0 };
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
        
        // init
        gpgpuRenderer.setVariableDependencies(positionVariable, [positionVariable, directionVariable, destinationVariable]);
        gpgpuRenderer.setVariableDependencies(directionVariable, [positionVariable, directionVariable, destinationVariable]);
        gpgpuRenderer.setVariableDependencies(destinationVariable, [positionVariable, directionVariable, destinationVariable]);

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
                }
            },
        ];
    }, [gl, size, count]);

    useEffect(() => {
        return () => {
            gpgpuRenderer.dispose();
            data.destination.texture.dispose();
            data.direction.texture.dispose();
            data.position.texture.dispose();
        };
    }, [gpgpuRenderer, data]);

    return { gpgpuRenderer, data };
}

export { useVehicleGPGPU };