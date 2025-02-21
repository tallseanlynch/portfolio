import { useRef } from 'react';
import {
    ShaderMaterial
} from 'three';
import { 
    useFrame 
} from '@react-three/fiber';
import {
    pointLightColor
} from './romeColors';

const RomeLightningBoltShader = {
    vertexShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vPosition;

        float noise(float x) {
            return fract(sin(x) * 143758.5453);
        }

        void main() {
            vUv = uv;
            vPosition = position;
            vec3 modPosition = position;

            float widthFactor = mix(0.35, 0.25, position.y);  // Adjust these values for desired width
            float jaggedFactor = noise(position.y) * 0.5;  // Noise for jaggedness

            // modPosition.x += (widthFactor + jaggedFactor) * (noise(position.y) - 0.5 + sin(time)) / 4.0;
            modPosition.x += (widthFactor + jaggedFactor) * (noise(position.y) - 0.5) / 4.0;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(modPosition, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 pointLightColor;
        uniform float time;
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
            vec2 uv = vUv - vec2(0.5, 0.5);
            vec3 whiteColor = vec3(1.0, 1.0, 1.0);
            vec4 finalColor = vec4(mix(whiteColor, pointLightColor, vUv.y * 1.25), 1.0);
            gl_FragColor = finalColor;
        }
    `,
    uniforms: {
        time: {
            value: 0
        },
        pointLightColor: {
            value: pointLightColor
        }
    }
}

const RomeLightningBolt = () => {
    const lightningBoltRef = useRef<ShaderMaterial>(null);

    useFrame(({clock }) => {
        if(lightningBoltRef && lightningBoltRef.current) {
            lightningBoltRef.current.uniforms.time.value = clock.elapsedTime;
        }
        // if(clock.elapsedTime % 5 === 0) {
        //     scene.background = whiteColor;
        // }
        // if(clock.elapsedTime % 3 === 0) {
        //     scene.background = blackColor;
        // }
    });

    return (
                <group position={[0, 5, -7.5]}>
                    <mesh >
                        {/* <meshBasicMaterial color={whiteColor} /> */}
                        <shaderMaterial
                            ref={lightningBoltRef}
                            vertexShader={RomeLightningBoltShader.vertexShader}
                            fragmentShader={RomeLightningBoltShader.fragmentShader}
                            transparent={true}
                            depthWrite={false}
                            uniforms={RomeLightningBoltShader.uniforms}
                        />
                        <planeGeometry args={[.05, 10, 3, 50]}/>
                    </mesh>
                </group>

    )
};

export { RomeLightningBolt };