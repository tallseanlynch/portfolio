import { uniformData } from './useLightsTime';
import { graphArrays, positionsGraph } from './positionsGraph';
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

        vec3 positionDataCalc = vec3(positionData.xyz);
        vec3 directionDataCalc = vec3(directionData.xyz);
        positionDataCalc.y = 0.0;

        gl_FragColor = vec4(positionDataCalc, 1.0) + vec4(clamp(directionDataCalc * .075 * directionData.w, -1.0, 1.0), 0.0);
    }
`
const simulationDirectionFragmentShader = `
    uniform int uSize;
    uniform float uTime; // seconds as float
    uniform float uDeltaTime;
    uniform int uConnectionsWalkConditionsData[${graphArrays.dataConnectionsWalkConditions.length}];
    uniform float uConnectionsData[${graphArrays.dataConnections.length}];
    uniform float uPositionsData[${graphArrays.dataPositions.length}];
    uniform int uLightTimes[${uniformData.lightsUniformArray.length}];
    uniform int uLightTimesTotalLength;

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
        vec3 mixDirectionDestination = mix(directionDataCalc, directionToDestination, interpolationFactor);        
        vec4 velocity = vec4(mixDirectionDestination, directionData.w);
        
        float distanceToDestination = distance(positionDataCalc, destinationDataCalc);
        if(distanceToDestination < 1.0) {
            velocity.w = distanceToDestination;        
        }

        float checkDistanceMin = 5.0;
        float lowestCheckDistance = 1000.0;
        vec3 collisionReflection = vec3(0.0, 0.0, 0.0);
        vec3 upVector = vec3(0.0, 1.0, 0.0);
        int numberOfPotentialCollisions = 0;
        bool isFrontCollision = false;

        for(int i = 0; i < uSize; i++) {
            for(int j = 0; j < uSize; j++) {
                vec2 checkUV = vec2(float(i), float(j)) / resolution.xy;
                vec4 checkPersonPosition = texture(uPosition, checkUV);
                vec3 checkPersonPositionCalc = vec3(checkPersonPosition.xyz);
                float checkDistance = distance(positionDataCalc, checkPersonPositionCalc);
                if(
                    checkDistance < checkDistanceMin && 
                    checkDistance > 0.001 && 
                    checkDistance < lowestCheckDistance &&
                    distanceToDestination > .1
                ) {
                    lowestCheckDistance = checkDistance;
                    numberOfPotentialCollisions += 1;

                    vec3 frontCheckPosition = positionDataCalc + normalize(directionDataCalc);
                    vec3 backCheckPosition = positionDataCalc + normalize(directionDataCalc) * -1.0;

                    float frontDistance = distance(frontCheckPosition, checkPersonPositionCalc);
                    float backDistance = distance(backCheckPosition, checkPersonPositionCalc);

                    isFrontCollision = frontDistance < backDistance;

                    float lessThanCheckDistanceModifier = 1.0;
                    if(checkDistance < 3.0 && isFrontCollision) {
                        lessThanCheckDistanceModifier += (3.0 - checkDistance);
                        velocity.w = checkDistance  * .5;
                    }

                    vec3 directionToCollision = normalize(checkPersonPositionCalc - positionDataCalc);
                    float dotProductToCollision = dot(directionToCollision, mixDirectionDestination);                    
                    collisionReflection = mixDirectionDestination - directionToCollision * 2.0 * lessThanCheckDistanceModifier * dotProductToCollision;
                    
                    vec3 collisionMixDirectionDestination = mix(mixDirectionDestination, collisionReflection, (1.0 - ((checkDistanceMin - checkDistance) / checkDistanceMin)) * .075125 * lessThanCheckDistanceModifier);
                    velocity = vec4(collisionMixDirectionDestination, velocity.w);
                }
            }
        }

        if(numberOfPotentialCollisions < 1) {
            velocity.w = 1.0;
        }

        if(distanceToDestination < .1) {
            velocity.w = 0.0;
        };

        if(lowestCheckDistance < .5 && numberOfPotentialCollisions > 0) {
            velocity.w = 1.0;
        };

        if(isFrontCollision == true && numberOfPotentialCollisions > 0 && distanceToDestination < 1.5) {
            velocity.w = 0.0;
        }

        int currentLocation = int(destinationData.y); // current position graph.number
        int currentDestination = int(destinationData.w); // current position graph.number
        int northEastCornerIndexInt = 0;
        int southWestCornerIndexInt = 15;
        int currentLocationConnectionIndex = 0;//int(uConnectionsData[0]);

        for(int i = 0; i < 6; i++) {
            if(int(uConnectionsData[(currentLocation * 6) + i]) == currentDestination) {
                currentLocationConnectionIndex = i;
            }
        }

        int canMoveToDestination = uConnectionsWalkConditionsData[
            (currentLocation * 20) + (currentLocationConnectionIndex * 4) + activeLightNumber
        ];

        float canMoveToDestinationModifier = float(canMoveToDestination);

        vec3 currentLocationCenter = vec3(
            uPositionsData[(5 * currentLocation) + 0], 
            uPositionsData[(5 * currentLocation) + 1],
            uPositionsData[(5 * currentLocation) + 2] 
        );

        int loopActiveLightNumber = 1 + activeLightNumber;
        if(loopActiveLightNumber > 3) {
            loopActiveLightNumber = 0;
        }
        int nextCanMoveToDestination = uConnectionsWalkConditionsData[
            (currentLocation * 20) + (currentLocationConnectionIndex * 4) + loopActiveLightNumber
        ];

        float checkDistanceFromStart = distance(positionDataCalc, currentLocationCenter);
        float checkDistanceToDestination = distanceToDestination;
        if(activeLightTimeLeft < 25 && checkDistanceFromStart < 9.0 && nextCanMoveToDestination == 0) {
            canMoveToDestinationModifier = 0.0;
        }

        if(distanceToDestination < checkDistanceFromStart * 1.5 && canMoveToDestinationModifier == 0.0) {
            canMoveToDestinationModifier = 1.5;
        }

        velocity.w *= canMoveToDestinationModifier;

        gl_FragColor = velocity;
    }
`

const simulationDestinationFragmentShader = `
    uniform int uSize;
    uniform float uTime;
    uniform float uDeltaTime;
    uniform int graphRows;
    uniform int uGraphConnectionsLengths[${graphArrays.graphPositions.length}];
    uniform int uGraphTerminationsLengths[${graphArrays.graphPositions.length}];
    uniform float uPositionsData[${graphArrays.dataPositions.length}];
    uniform float uConnectionsData[${graphArrays.dataConnections.length}];
    uniform float uTerminationsData[${graphArrays.dataTerminations.length}];

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
        if(distanceFromDestination <= 1.0) {
            float currentDestination = destinationData.w;
            int currentDestinationInt = int(currentDestination);

            int connectionsLengthInt = uGraphConnectionsLengths[currentDestinationInt];
            float connectionLength = float(connectionsLengthInt);
            float randomConnectionLength = random(1.0) * connectionLength;
            int randomConnectionLengthInt = int(randomConnectionLength);

            float newDestinationNumber = uConnectionsData[(currentDestinationInt * 6) + randomConnectionLengthInt];
            int newDestinationNumberInt = int(newDestinationNumber);

            finalDestination = vec4(
                uPositionsData[(5 * newDestinationNumberInt) + 0] + (((random(3.49) * 2.0) - 1.0) * uPositionsData[(5 * newDestinationNumberInt) + 3]) * .25, 
                currentDestination, 
                uPositionsData[(5 * newDestinationNumberInt) + 2] + (((random(9.43) * 2.0) - 1.0) * uPositionsData[(5 * newDestinationNumberInt) + 4]) * .25, 
                newDestinationNumber
            );
        }

        gl_FragColor = finalDestination;
    }
`

const randomNeg1To1 = () => (Math.random() -.5) * 2;

const startingPositionCalc = new Vector3();
const destinationPositionCalc = new Vector3();
const getPersonPosition = (graphPosition, destination = false) => {
    const calcVector3 = destination === false ? startingPositionCalc : destinationPositionCalc;
    calcVector3.copy(graphPosition.center);
    calcVector3.x += randomNeg1To1() * (graphPosition.width / 2)
    calcVector3.z += randomNeg1To1() * (graphPosition.height / 2)
}

function usePedestrianGPGPU(count: number) {
    const size = Math.ceil(Math.sqrt(count));
    const gl = useThree((state) => state.gl);

    const [gpgpuRenderer, data] = useMemo(() => {
        const gpgpuRenderer = new GPUComputationRenderer(size, size, gl);

        const positionTexture = gpgpuRenderer.createTexture();
        const directionTexture = gpgpuRenderer.createTexture();
        const destinationTexture = gpgpuRenderer.createTexture();

        for (let i = 0; i < count; i++) {
            const i4 = i * 4;

            const graphPosition = positionsGraph[i % positionsGraph.length];
            getPersonPosition(graphPosition);
            const connectionDestinations = graphPosition.connections;
            const randomConnectionDestination = connectionDestinations[Math.floor(Math.random() * graphPosition.connections.length)];
            const randomConnectionDestinationGraphPosition = positionsGraph.filter(graphPosition => {
                return graphPosition.name === randomConnectionDestination
            })[0];
            getPersonPosition(randomConnectionDestinationGraphPosition, true);

            // positions
            (positionTexture.image.data as any)[i4 + 0] = startingPositionCalc.x; // x
            (positionTexture.image.data as any)[i4 + 1] = 0.01; // y
            (positionTexture.image.data as any)[i4 + 2] = startingPositionCalc.z; // z
            (positionTexture.image.data as any)[i4 + 3] = graphPosition.number; // w - graphPosition number

            // velocities
            (directionTexture.image.data as any)[i4 + 0] = (Math.random() - 0.5); // x
            (directionTexture.image.data as any)[i4 + 1] = 0.0; // y
            (directionTexture.image.data as any)[i4 + 2] = (Math.random() - 0.5); // z
            (directionTexture.image.data as any)[i4 + 3] = 1.0; // w
    
            // destinations
            (destinationTexture.image.data as any)[i4 + 0] = destinationPositionCalc.x; // x
            (destinationTexture.image.data as any)[i4 + 1] = graphPosition.number; // y - current graphPosition number
            (destinationTexture.image.data as any)[i4 + 2] = destinationPositionCalc.z; // z
            (destinationTexture.image.data as any)[i4 + 3] = randomConnectionDestinationGraphPosition.number; // w - destinationPosition number
        }

        // gpugpu variables initialization
        const positionVariable = gpgpuRenderer.addVariable('uPosition', simulationPositionFragmentShader, positionTexture);
        positionVariable.material.uniforms.uSize = { value: size };        
        positionVariable.material.uniforms.uTime = { value: 0 };
        positionVariable.material.uniforms.uDeltaTime = { value: 0 };
        positionVariable.material.uniforms.uGraphRows = { value: graphArrays.graphPositions.length };
        positionVariable.material.uniforms.uGraphCols = { value: 10 };

        const directionVariable = gpgpuRenderer.addVariable('uDirection', simulationDirectionFragmentShader, directionTexture);
        directionVariable.material.uniforms.uSize = { value: size };        
        directionVariable.material.uniforms.uTime = { value: 0 };
        directionVariable.material.uniforms.uDeltaTime = { value: 0 };
        directionVariable.material.uniforms.uConnectionsData = { value: graphArrays.dataConnections };
        directionVariable.material.uniforms.uConnectionsWalkConditionsData = { value: graphArrays.dataConnectionsWalkConditions };
        directionVariable.material.uniforms.uPositionsData = { value: graphArrays.dataPositions };
        directionVariable.material.uniforms.uLightTimes = { value: uniformData.lightsUniformArray };
        directionVariable.material.uniforms.uLightTimesTotalLength = { value: uniformData.lightsTotalLengthOfTimeUniformInt };
    
        const destinationVariable = gpgpuRenderer.addVariable('uDestination', simulationDestinationFragmentShader, destinationTexture);
        destinationVariable.material.uniforms.uSize = { value: size };        
        destinationVariable.material.uniforms.uTime = { value: 0 };
        destinationVariable.material.uniforms.uDeltaTime = { value: 0 };
        destinationVariable.material.uniforms.uGraphRows = { value: graphArrays.graphPositions.length };
        destinationVariable.material.uniforms.uGraphCols = { value: 10 };
        destinationVariable.material.uniforms.uPositionsData = { value: graphArrays.dataPositions };
        destinationVariable.material.uniforms.uConnectionsData = { value: graphArrays.dataConnections };
        destinationVariable.material.uniforms.uTerminationsData = { value: graphArrays.dataTerminations };
        destinationVariable.material.uniforms.uGraphConnectionsLengths = { value: graphArrays.graphConnectionsLengths };
        destinationVariable.material.uniforms.uGraphTerminationsLengths = { value: graphArrays.graphTerminationsLengths };
        
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
            }
        ];
    }, [count, gl, size]);

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

export { usePedestrianGPGPU };