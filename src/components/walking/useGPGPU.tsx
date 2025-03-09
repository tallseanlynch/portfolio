import { useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';

const simulationPositionFragmentShader = `
    uniform int size;
    uniform float uTime;
    uniform float uDeltaTime;

    void main() {
        float time = uTime;
        vec2 uv = floor(gl_FragCoord.xy) / resolution.xy;
        vec4 positionData = texture(uPosition, uv);
        vec4 velocityData = texture(uVelocity, uv);
        vec4 destinationData = texture(uDestination, uv);

        float atDestinationModifier = 1.0;
        float distanceToDestination = distance(positionData, destinationData);
        if(distanceToDestination < 1.0) {
            atDestinationModifier = distanceToDestination;        
        }
        if(distanceToDestination < .1) {
            atDestinationModifier = 0.0;
        };

        float checkDistanceMin = 2.0;
        for(int i = 0; i < size; i++) {
            for(int j = 0; j < size; j++) {
                vec2 checkUV = vec2(float(i), float(j)) / resolution.xy;
                vec4 checkPersonPosition = texture(uPosition, checkUV);
                float checkDistance = distance(positionData, checkPersonPosition);
                if(checkDistance < checkDistanceMin && checkDistance > 0.001) {
                    atDestinationModifier = 0.0;
                }
            }
        }

        gl_FragColor = positionData + clamp(velocityData * .05 * atDestinationModifier, -.5, .5);
    }
`
const simulationVelocityFragmentShader = `
    uniform float uTime;
    uniform float uDeltaTime;

    void main() {
        float time = uTime;
        vec2 uv = floor(gl_FragCoord.xy) / resolution.xy;
        vec4 positionData = texture(uPosition, uv);
        vec4 velocityData = texture(uVelocity, uv);
        vec4 destinationData = texture(uDestination, uv);
        vec4 directionToDestination = normalize(destinationData - positionData);
        float interpolationFactor = clamp(uTime * .001, 0.0, 1.0);
        vec4 mixVelocityDestination = normalize(mix(velocityData, directionToDestination, interpolationFactor));        
        mixVelocityDestination.w = 1.0;

        gl_FragColor = directionToDestination;
//        gl_FragColor = mixVelocityDestination;
    }
`

const simulationDestinationFragmentShader = `
    uniform float uTime;
    uniform float uDeltaTime;

    void main() {
        vec2 uv = floor(gl_FragCoord.xy) / resolution.xy;
        vec4 destinationData = texture(uDestination, uv);
        gl_FragColor = destinationData;
    }
`

function useGPGPU(count: number, spread: number) {
    const size = Math.ceil(Math.sqrt(count));
    const gl = useThree((state) => state.gl);

    const [gpgpuRenderer, data] = useMemo(() => {
        const gpgpuRenderer = new GPUComputationRenderer(size, size, gl);

        const positionTexture = gpgpuRenderer.createTexture();
        const velocityTexture = gpgpuRenderer.createTexture();
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
            (velocityTexture.image.data as any)[i4 + 0] = (Math.random() - 0.5); // x
            (velocityTexture.image.data as any)[i4 + 1] = 0.0; // y
            (velocityTexture.image.data as any)[i4 + 2] = (Math.random() - 0.5); // z
            (velocityTexture.image.data as any)[i4 + 3] = 1.0; // w
        }
        const velocityVariable = gpgpuRenderer.addVariable('uVelocity', simulationVelocityFragmentShader, velocityTexture);
        velocityVariable.material.uniforms.uTime = { value: 0 };
        velocityVariable.material.uniforms.uDeltaTime = { value: 0 };

        // destinations
        const destinationScale = 20;
        for (let i = 0; i < count; i++) {
            const i4 = i * 4;
            (destinationTexture.image.data as any)[i4 + 0] = (Math.random() * 2.0 - 1.0) * destinationScale; // x
            (destinationTexture.image.data as any)[i4 + 1] = 0.0; // y
            (destinationTexture.image.data as any)[i4 + 2] = (Math.random() * 2.0 - 1.0) * destinationScale; // z
            (destinationTexture.image.data as any)[i4 + 3] = 1.0; // w
            // (destinationTexture.image.data as any)[i4 + 0] = 0.0; // x
            // (destinationTexture.image.data as any)[i4 + 1] = 0.0; // y
            // (destinationTexture.image.data as any)[i4 + 2] = 0.0; // z
            // (destinationTexture.image.data as any)[i4 + 3] = 0.0; // w
        }
        const destinationVariable = gpgpuRenderer.addVariable('uDestination', simulationDestinationFragmentShader, destinationTexture);
        destinationVariable.material.uniforms.uTime = { value: 0 };
        destinationVariable.material.uniforms.uDeltaTime = { value: 0 };

        // init
        gpgpuRenderer.setVariableDependencies(positionVariable, [positionVariable, velocityVariable, destinationVariable]);
        gpgpuRenderer.setVariableDependencies(velocityVariable, [positionVariable, velocityVariable, destinationVariable]);
        gpgpuRenderer.setVariableDependencies(destinationVariable, [positionVariable, velocityVariable, destinationVariable]);

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
                velocity: {
                    texture: velocityTexture,
                    variables: {
                        velocityVariable,
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
    }, [count, gl, size, spread]);

    useEffect(() => {
        return () => {
            gpgpuRenderer.dispose();
        };
    }, [gpgpuRenderer]);

    return { gpgpuRenderer, data };
}

export { useGPGPU };