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

    void main() {
        float time = uTime;
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec4 data = texture(uVelocity, uv);
        vec4 initialPositionData = texture(uInitialPosition, uv);
        vec4 initialVelocityData = texture(uInitialVelocity, uv);
        gl_FragColor = initialVelocityData;
    }
`

function useGPGPU(count: number, spread: number) {
    const size = Math.ceil(Math.sqrt(count));
    const gl = useThree((state) => state.gl);

    const [gpgpuRenderer, data] = useMemo(() => {
        const gpgpuRenderer = new GPUComputationRenderer(size, size, gl);

        const positionTexture = gpgpuRenderer.createTexture();
        const velocityTexture = gpgpuRenderer.createTexture();

        // positions
        console.log(count);
        for (let i = 0; i < count; i++) {
            const i4 = i * 4;
            (positionTexture.image.data as any)[i4 + 0] = (Math.random() * 2.0 - 1.0) * spread; // x
            (positionTexture.image.data as any)[i4 + 1] = 0.0; // y
            (positionTexture.image.data as any)[i4 + 2] = (Math.random() * 2.0 - 1.0) * spread; // z
            (positionTexture.image.data as any)[i4 + 3] = 1.0; // w
        }
        const positionVariable = gpgpuRenderer.addVariable('uPosition', simulationPositionFragmentShader, positionTexture);
        positionVariable.material.uniforms.uTime = { value: 0 };
        positionVariable.material.uniforms.uDeltaTime = { value: 0 };
        positionVariable.material.uniforms.uInitialPosition = { value: positionTexture };
        positionVariable.material.uniforms.uInitialVelocity = { value: velocityTexture };

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
        velocityVariable.material.uniforms.uInitialVelocity = { value: velocityTexture };
        velocityVariable.material.uniforms.uInitialPosition = { value: positionTexture };

        // init
        gpgpuRenderer.setVariableDependencies(positionVariable, [positionVariable, velocityVariable]);
        gpgpuRenderer.setVariableDependencies(velocityVariable, [positionVariable, velocityVariable]);
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