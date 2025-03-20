import { graphArrays } from './positionsGraph';
import { positionsGraph } from './positionsGraph';
// import { useLightsTime } from './useLightsTime';
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
        vec3 destinationDataCalc = vec3(destinationData.xyz);
        positionDataCalc.y = 0.0;

        // gl_FragColor = positionData + vec4(clamp(directionDataCalc * .1 * atDestinationModifier, -1.0, 1.0), 1.0);
        gl_FragColor = vec4(positionDataCalc, 1.0) + vec4(clamp(directionDataCalc * .075 * directionData.w, -1.0, 1.0), 0.0);
    }
`
const simulationDirectionFragmentShader = `
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
        vec3 destinationDataCalc = vec3(destinationData.xyz);

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
                // if(checkDistance < checkDistanceMin && checkDistance > 0.001) {
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
                    
                    vec3 collisionMixDirectionDestination = mix(mixDirectionDestination, collisionReflection, (1.0 - ((checkDistanceMin - checkDistance) / checkDistanceMin)) * .125 * lessThanCheckDistanceModifier);
                    velocity = vec4(collisionMixDirectionDestination, velocity.w);
                }
            }
        }

        if(numberOfPotentialCollisions < 1) {
            velocity.w = .5;
        }

        if(distanceToDestination < .1) {
            velocity.w = 0.0;
        };

        if(isFrontCollision == true && numberOfPotentialCollisions > 0 && distanceToDestination < 1.5) {
            velocity.w = 0.0;
        }

        gl_FragColor = velocity;
    }
`

const simulationDestinationFragmentShader = `
    uniform int uSize;
    uniform float uTime;
    uniform float uDeltaTime;

    void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec4 destinationData = texture(uDestination, uv);
        gl_FragColor = destinationData;
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

function useGPGPU(count: number, destinationSpread: number) {
    // const lightsTime = useLightsTime();
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
            (destinationTexture.image.data as any)[i4 + 1] = 0.0; // y
            (destinationTexture.image.data as any)[i4 + 2] = destinationPositionCalc.z; // z
            (destinationTexture.image.data as any)[i4 + 3] = randomConnectionDestinationGraphPosition.number; // w - destinationPosition number
        }

        // gpugpu variables initialization
        const positionVariable = gpgpuRenderer.addVariable('uPosition', simulationPositionFragmentShader, positionTexture);
        positionVariable.material.uniforms.uSize = { value: size };        
        positionVariable.material.uniforms.uTime = { value: 0 };
        positionVariable.material.uniforms.uDeltaTime = { value: 0 };
        positionVariable.material.uniforms.uGraphPositions = { value: graphArrays.graphPositions };
        positionVariable.material.uniforms.uGraphConnections = { value: graphArrays.graphConnections };
        positionVariable.material.uniforms.uGraphTerminations = { value: graphArrays.graphTerminations };

        const directionVariable = gpgpuRenderer.addVariable('uDirection', simulationDirectionFragmentShader, directionTexture);
        directionVariable.material.uniforms.uSize = { value: size };        
        directionVariable.material.uniforms.uTime = { value: 0 };
        directionVariable.material.uniforms.uDeltaTime = { value: 0 };

        const destinationVariable = gpgpuRenderer.addVariable('uDestination', simulationDestinationFragmentShader, destinationTexture);
        destinationVariable.material.uniforms.uSize = { value: size };        
        destinationVariable.material.uniforms.uTime = { value: 0 };
        destinationVariable.material.uniforms.uDeltaTime = { value: 0 };
        destinationVariable.material.uniforms.uGraphPositions = { value: graphArrays.graphPositions };
        destinationVariable.material.uniforms.uGraphConnections = { value: graphArrays.graphConnections };
        destinationVariable.material.uniforms.uGraphTerminations = { value: graphArrays.graphTerminations };

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
                },
            },
        ];
    }, [count, gl, size, destinationSpread]);

    useEffect(() => {
        return () => {
            gpgpuRenderer.dispose();
        };
    }, [gpgpuRenderer]);

    return { gpgpuRenderer, data };
}

export { useGPGPU };