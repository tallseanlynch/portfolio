import { useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';

const simulationPositionFragmentShader = `
    uniform float uTime;
    uniform float uDeltaTime;
    uniform sampler2D uInitialPosition;
    uniform sampler2D uInitialVelocity;

    void main() {
        float time = uTime;
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec4 data = texture(uPosition, uv);
        vec4 initialPositionData = texture(uInitialPosition, uv);
        vec4 initialVelocityData = texture(uInitialVelocity, uv);

        gl_FragColor = initialPositionData + initialVelocityData * .1;
    }
`
const simulationVelocityFragmentShader = `
    uniform float uTime;
    uniform float uDeltaTime;
    uniform sampler2D uInitialPosition;
    uniform sampler2D uInitialVelocity;
    uniform sampler2D uInitialDestination;

    void main() {
        float time = uTime;
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec4 data = texture(uVelocity, uv);
        vec4 initialPositionData = texture(uInitialPosition, uv);
        vec4 initialVelocityData = texture(uInitialVelocity, uv);
        vec4 initialDestinationData = texture(uInitialDestination, uv);
        vec4 directionToDestination = normalize(initialDestinationData - initialPositionData);
        vec4 mixVelocityDestination = mix(directionToDestination, initialVelocityData, .01);
        float distanceToDestination = distance(initialDestinationData, initialPositionData);
        if(distanceToDestination < 1.0) {
            mixVelocityDestination = mix(vec4(0.0, 0.0, 0.0, 0.0), mixVelocityDestination, distanceToDestination);
        };
        gl_FragColor = mixVelocityDestination;
    }
`

const simulationDestinationFragmentShader = `
    uniform float uTime;
    uniform float uDeltaTime;
    uniform sampler2D uInitialPosition;
    uniform sampler2D uInitialVelocity;
    uniform sampler2D uInitialDestination;

    void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec4 data = texture(uDestination, uv);
        vec4 initialPositionData = texture(uInitialPosition, uv);
        vec4 initialVelocityData = texture(uInitialVelocity, uv);
        vec4 initialDestinationData = texture(uInitialDestination, uv);
        gl_FragColor = initialDestinationData;
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
        console.log(count);
        for (let i = 0; i < count; i++) {
            const i4 = i * 4;
            (positionTexture.image.data as any)[i4 + 0] = (Math.random() * 2.0 - 1.0) * spread; // x
            (positionTexture.image.data as any)[i4 + 1] = 0.01; // y
            (positionTexture.image.data as any)[i4 + 2] = (Math.random() * 2.0 - 1.0) * spread; // z
            (positionTexture.image.data as any)[i4 + 3] = 1.0; // w
        }
        const positionVariable = gpgpuRenderer.addVariable('uPosition', simulationPositionFragmentShader, positionTexture);
        positionVariable.material.uniforms.uTime = { value: 0 };
        positionVariable.material.uniforms.uDeltaTime = { value: 0 };
        positionVariable.material.uniforms.uInitialPosition = { value: positionTexture };
        positionVariable.material.uniforms.uInitialVelocity = { value: velocityTexture };
        positionVariable.material.uniforms.uInitialDestination = { value: destinationTexture };

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
        velocityVariable.material.uniforms.uInitialPosition = { value: positionTexture };
        velocityVariable.material.uniforms.uInitialVelocity = { value: velocityTexture };
        velocityVariable.material.uniforms.uInitialDestination = { value: destinationTexture };

        // destinations
        const destinationScale = 100;
        for (let i = 0; i < count; i++) {
            const i4 = i * 4;
            (destinationTexture.image.data as any)[i4 + 0] = (Math.random() * 2.0 - 1.0) * destinationScale; // x
            (destinationTexture.image.data as any)[i4 + 1] = 0.0; // y
            (destinationTexture.image.data as any)[i4 + 2] = (Math.random() * 2.0 - 1.0) * destinationScale; // z
            (destinationTexture.image.data as any)[i4 + 3] = 1.0; // w
        }
        const destinationVariable = gpgpuRenderer.addVariable('uDestination', simulationDestinationFragmentShader, destinationTexture);
        destinationVariable.material.uniforms.uTime = { value: 0 };
        destinationVariable.material.uniforms.uDeltaTime = { value: 0 };
        destinationVariable.material.uniforms.uInitialPosition = { value: positionTexture };
        destinationVariable.material.uniforms.uInitialVelocity = { value: velocityTexture };
        destinationVariable.material.uniforms.uInitialDestination = { value: destinationTexture };


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

export default useGPGPU;