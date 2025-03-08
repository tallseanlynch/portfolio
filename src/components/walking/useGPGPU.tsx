import { useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';
import { Texture } from 'three';

const simulationPositionFragmentShader = `
    uniform int size;
    uniform float uTime;
    uniform float uDeltaTime;
    uniform sampler2D uInitialPosition;
    uniform sampler2D uInitialVelocity;
    uniform sampler2D uInitialDestination;

    void main() {
        float time = uTime;
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec4 initialPositionData = texture(uInitialPosition, uv);
        vec4 initialVelocityData = texture(uInitialVelocity, uv);
        vec4 initialDestinationData = texture(uInitialDestination, uv);
        vec4 velocityDirection = vec4(initialVelocityData.xyz, 0.0);

        float distanceToDestination = distance(initialPositionData, initialDestinationData);
        float atDestinationModifier = 1.0;
        if(distanceToDestination < 1.0) {
            atDestinationModifier = distanceToDestination;        
        }
        if(distanceToDestination < .1) {
            atDestinationModifier = 0.0;
        };

        float checkDistanceMin = 1.0;
        float distanceFromAnotherPerson = 0.0;
        for(int i = 0; i < size; i++) {
            for(int j = 0; j < size; j++) {
                vec2 checkUV = vec2(float(i), float(j)) / resolution.xy;
                vec4 checkPersonPosition = texture(uInitialPosition, checkUV);
                float checkDistance = distance(initialPositionData, checkPersonPosition);
                if(checkDistance < checkDistanceMin && checkDistance > 0.01) {
                    atDestinationModifier = 0.0;
                }
            }
        }

        gl_FragColor = initialPositionData + (initialVelocityData * .05 * atDestinationModifier);
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
        vec4 initialPositionData = texture(uInitialPosition, uv);
        vec4 initialVelocityData = texture(uInitialVelocity, uv);
        vec4 initialDestinationData = texture(uInitialDestination, uv);
        vec4 directionToDestination = normalize(initialDestinationData - initialPositionData);
        vec4 mixVelocityDestination = mix(initialVelocityData, directionToDestination, uTime * .1);

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
        const destinationScale = 50;
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

const simulationPositionTrackingFragmentShader = `
    uniform float uTime;
    uniform sampler2D uInitialPositionTracking;
    uniform sampler2D uInitialPosition;
    uniform int uInitialPositionWidth;

    void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec4 trackingPositionData = texture(uInitialPositionTracking, uv);

        // float atDestinationModifier = 0.0;
        // float checkDistanceMin = 3.0;
        // for(int i = 0; i < uInitialPositionWidth; i++) {
        //     for(int j = 0; j < uInitialPositionWidth; j++) {
        //         vec2 checkUV = vec2(float(i), float(j)) / resolution.xy;
        //         vec4 checkPersonPosition = texture(uInitialPosition, checkUV);
        //         float checkDistance = distance(trackingPositionData, checkPersonPosition);
        //         if(checkDistance < checkDistanceMin) {
        //             atDestinationModifier = 1.0;
        //         }
        //     }
        // }

        // gl_FragColor = mix(trackingPositionData, vec4(0.0, 0.0, 0.0, 1.0), atDestinationModifier);
        gl_FragColor = trackingPositionData;
        // gl_FragColor = vec4(0.0, 0.0, 0.0, sin(uTime));
    }
`

function useGPGPUTracking(
    planeSize: number, 
    planeUnitResolution: number,
    width: number,
    positionTexture: Texture
) {
    const size = planeSize * planeUnitResolution;
    const planeCount = size * size;
    const gl = useThree((state) => state.gl);
    console.log(width, positionTexture);

    const [gpgpuRenderer, data] = useMemo(() => {
        const gpgpuRenderer = new GPUComputationRenderer(size, size, gl);

        const positionTrackingTexture = gpgpuRenderer.createTexture();

        // position tracking
        for (let i = 0; i < planeCount; i++) {
            const i4 = i * 4;
            (positionTrackingTexture.image.data as any)[i4 + 0] = 1.0;// Math.random(); // x
            (positionTrackingTexture.image.data as any)[i4 + 1] = 1.0;// Math.random(); // y
            (positionTrackingTexture.image.data as any)[i4 + 2] = Math.random(); // z
            (positionTrackingTexture.image.data as any)[i4 + 3] = 1.0; // w
        }
        const positionTrackingVariable = gpgpuRenderer.addVariable('uPositionTracking', simulationPositionTrackingFragmentShader, positionTrackingTexture);
        positionTrackingVariable.material.uniforms.uTime = { value: 0 };
        positionTrackingVariable.material.uniforms.uInitialPositionTracking = { value: positionTrackingTexture };
        positionTrackingVariable.material.uniforms.uInitialPosition = { value: positionTexture };
        positionTrackingVariable.material.uniforms.uInitialPositionWidth = { value: width };

        // init
        gpgpuRenderer.setVariableDependencies(positionTrackingVariable, [positionTrackingVariable]);

        gpgpuRenderer.init();

        return [
            gpgpuRenderer,
            {
                positionTracking: {
                    texture: positionTrackingTexture,
                    variables: {
                        positionTrackingVariable,
                    },
                }
            },
        ];
    }, [gl, size, planeCount, positionTexture, width]);

    useEffect(() => {
        return () => {
            gpgpuRenderer.dispose();
        };
    }, [gpgpuRenderer]);

    return { gpgpuRenderer, data };
}

export { useGPGPU, useGPGPUTracking};