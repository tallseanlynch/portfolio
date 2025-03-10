import { useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';

const simulationPositionFragmentShader = `
    uniform int size;
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
        gl_FragColor = vec4(positionDataCalc, 1.0) + vec4(clamp(directionDataCalc * .1 * directionData.w, -1.0, 1.0), 0.0);
    }
`
const simulationDirectionFragmentShader = `
    uniform int size;
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
        float interpolationFactor = clamp(uTime * .01, 0.0, 1.0);
        vec3 mixDirectionDestination = mix(directionDataCalc, directionToDestination, interpolationFactor);        
        vec4 velocity = vec4(mixDirectionDestination, directionData.w);
        
        float distanceToDestination = distance(positionDataCalc, destinationDataCalc);
        if(distanceToDestination < 1.0) {
            velocity.w = distanceToDestination;        
        }
        if(distanceToDestination < .1) {
            velocity.w = 0.0;
        };

        float checkDistanceMin = 1.0;
        for(int i = 0; i < size; i++) {
            for(int j = 0; j < size; j++) {
//                velocity.w = 0.0;
                vec2 checkUV = vec2(float(i), float(j)) / resolution.xy;
                vec4 checkPersonPosition = texture(uPosition, checkUV);
                vec3 checkPersonPositionCalc = vec3(checkPersonPosition.xyz);
                float checkDistance = distance(positionDataCalc, checkPersonPositionCalc);
                if(checkDistance < checkDistanceMin && checkDistance > 0.001) {
                    velocity.w = 0.0;
                }
            }
        }

        gl_FragColor = velocity;
    }
`

const simulationDestinationFragmentShader = `
    uniform int size;
    uniform float uTime;
    uniform float uDeltaTime;

    void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec4 destinationData = texture(uDestination, uv);
        gl_FragColor = destinationData;
    }
`

function useGPGPU(count: number, spread: number, destinationSpread: number) {
    const size = Math.ceil(Math.sqrt(count));
    const gl = useThree((state) => state.gl);

    const [gpgpuRenderer, data] = useMemo(() => {
        const gpgpuRenderer = new GPUComputationRenderer(size, size, gl);

        const positionTexture = gpgpuRenderer.createTexture();
        const directionTexture = gpgpuRenderer.createTexture();
        const destinationTexture = gpgpuRenderer.createTexture();

        // positions
        for (let i = 0; i < count; i++) {
            const i4 = i * 4;
            (positionTexture.image.data as any)[i4 + 0] = (Math.random() * 2.0 - 1.0) * spread; // x
            (positionTexture.image.data as any)[i4 + 1] = 0.01; // y
            (positionTexture.image.data as any)[i4 + 2] = (Math.random() * 2.0 - 1.0) * spread; // z
            (positionTexture.image.data as any)[i4 + 3] = 1.0; // w
        }
        const positionVariable = gpgpuRenderer.addVariable('uPosition', simulationPositionFragmentShader, positionTexture);
        positionVariable.material.uniforms.size = { value: size };        
        positionVariable.material.uniforms.uTime = { value: 0 };
        positionVariable.material.uniforms.uDeltaTime = { value: 0 };

        // velocities
        for (let i = 0; i < count; i++) {
            const i4 = i * 4;
            (directionTexture.image.data as any)[i4 + 0] = (Math.random() - 0.5); // x
            (directionTexture.image.data as any)[i4 + 1] = 0.0; // y
            (directionTexture.image.data as any)[i4 + 2] = (Math.random() - 0.5); // z
            (directionTexture.image.data as any)[i4 + 3] = 1.0; // w
        }
        const directionVariable = gpgpuRenderer.addVariable('uDirection', simulationDirectionFragmentShader, directionTexture);
        directionVariable.material.uniforms.size = { value: size };        
        directionVariable.material.uniforms.uTime = { value: 0 };
        directionVariable.material.uniforms.uDeltaTime = { value: 0 };

        // destinations
        const destinationScale = destinationSpread;
        for (let i = 0; i < count; i++) {
            const i4 = i * 4;
            (destinationTexture.image.data as any)[i4 + 0] = (Math.random() * 2.0 - 1.0) * destinationScale; // x
            (destinationTexture.image.data as any)[i4 + 1] = 0.0; // y
            (destinationTexture.image.data as any)[i4 + 2] = (Math.random() * 2.0 - 1.0) * destinationScale; // z
            (destinationTexture.image.data as any)[i4 + 3] = 1.0; // w
            // (destinationTexture.image.data as any)[i4 + 0] = 0.0;//(Math.random() * 2.0 - 1.0) * destinationScale; // x
            // (destinationTexture.image.data as any)[i4 + 1] = 0.0; // y
            // (destinationTexture.image.data as any)[i4 + 2] = 0.0;//(Math.random() * 2.0 - 1.0) * destinationScale; // z
            // (destinationTexture.image.data as any)[i4 + 3] = 1.0; // w
        }
        const destinationVariable = gpgpuRenderer.addVariable('uDestination', simulationDestinationFragmentShader, destinationTexture);
        positionVariable.material.uniforms.size = { value: size };        
        destinationVariable.material.uniforms.uTime = { value: 0 };
        destinationVariable.material.uniforms.uDeltaTime = { value: 0 };

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
    }, [count, gl, size, spread, destinationSpread]);

    useEffect(() => {
        return () => {
            gpgpuRenderer.dispose();
        };
    }, [gpgpuRenderer]);

    return { gpgpuRenderer, data };
}

export { useGPGPU };