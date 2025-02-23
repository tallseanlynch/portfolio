import {
    ShaderMaterial,
    DoubleSide,
    Vector3
} from 'three';
import { 
    // useEffect, 
    // useState,
    useRef
 } from 'react';
import { useFrame } from '@react-three/fiber';
import {
    ambientLightColor,
    whiteColor
} from './romeColors';

const skyDomeShader = {
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float strikeFloat;
        uniform vec3 skyColorLight;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
            vec3 skyColorWhite = vec3(1.0, 1.0, 1.0);
            vec3 skyColorBlack = vec3(0.0, 0.0, 0.0);
            vec3 skyColorMixWhite = mix(skyColorWhite, skyColorLight, vPosition.y);
            vec3 skyColorMixBlack = mix(skyColorBlack, skyColorLight, vPosition.y);
            vec3 skyColorMix = mix(skyColorBlack, skyColorMixWhite, strikeFloat);
            vec4 lightningMix = vec4(0.0, 0.0, 0.0, 0.0);
            if(vPosition.y < 0.0) {
                lightningMix = vec4(skyColorBlack, 1.0);
            } else {
                lightningMix = vec4(skyColorMix, 1.0);
            }
            if(vPosition.y > 0.0 && vPosition.y < .1) {
                lightningMix = mix(vec4(skyColorBlack, 1.0), lightningMix, vPosition.y * 10.0);
            }
            gl_FragColor = lightningMix;
        }
    `,
};

const RomeLightningBoltShader = {
    vertexShader: `
        uniform float time;
        uniform vec3 strikePosition;
        uniform vec3 baseStrikePosition;
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

            modPosition.x += (widthFactor + jaggedFactor) * (noise(position.y) - 0.5) / 4.0;
            modPosition = modPosition + strikePosition + baseStrikePosition;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(modPosition, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 pointLightColor;
        uniform float time;
        uniform float strikeFloat;
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
            vec2 uv = vUv - vec2(0.5, 0.5);
            vec3 whiteColor = vec3(1.0, 1.0, 1.0);
            vec4 finalColor = vec4(mix(whiteColor, pointLightColor, vUv.y * 1.25), 1.0);
            vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);
            finalColor = mix(transparent, finalColor, strikeFloat);
            if(vUv.y > 0.0 && vUv.y < .25) {
              finalColor = mix(transparent, finalColor, abs(vUv.y * 4.0));
            }
            gl_FragColor = finalColor;
        }
    `,
    uniforms: {
        time: {
            value: 0
        },
        pointLightColor: {
            value: whiteColor
        },
        strikeFloat: {
            value: 0.0
        },
        strikePosition: {
            value: new Vector3(0.0, 0.0, 0.0)
        },
        baseStrikePosition: {
            value: new Vector3(0.0, 0.0, 0.0)
        }
    }
}

const RomeLightningBolt = () => {
    const lightningBoltRef = useRef<ShaderMaterial>(null);
    const strikeTime = 10;
    const skyDomeRef = useRef<ShaderMaterial>(null);

    setInterval(() => {
        if(skyDomeRef !== null && skyDomeRef.current && lightningBoltRef && lightningBoltRef.current) {
            lightningBoltRef.current.uniforms.baseStrikePosition.value.set((Math.random() * 4) -2.0, 0.0, Math.random());
        }
    }, 7500)

    useFrame(({clock }) => {
        if(skyDomeRef !== null && skyDomeRef.current && lightningBoltRef && lightningBoltRef.current) {
            lightningBoltRef.current.uniforms.time.value = clock.elapsedTime;
            lightningBoltRef.current.uniforms.strikeFloat.value = skyDomeRef.current.uniforms.strikeFloat.value;
    
            if(Math.floor(clock.elapsedTime) % strikeTime === 0) {
                if(Math.random() > .75) {
                    skyDomeRef.current.uniforms.strikeFloat.value = .75 + Math.random();
                    lightningBoltRef.current.uniforms.strikePosition.value.set(Math.random(), 0.0, Math.random());
                }
            }
            if(skyDomeRef.current.uniforms.strikeFloat.value > 0.0) {
                skyDomeRef.current.uniforms.strikeFloat.value = skyDomeRef.current.uniforms.strikeFloat.value -.03;
            }
        }
    });

    return (
        <>
            <mesh scale={[100, 100, 100]}>
                <sphereGeometry />
                <shaderMaterial
                    ref={skyDomeRef}
                    vertexShader={skyDomeShader.vertexShader}
                    fragmentShader={skyDomeShader.fragmentShader}
                    uniforms={{
                        skyColorLight: {value: ambientLightColor},
                        strikeFloat: {value: 0.0}
                    }}
                    side={DoubleSide}
                />
            </mesh>
            <group position={[0, 7.5, -5]}>
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
                    <planeGeometry args={[.05, 15, 3, 50]}/>
                </mesh>
            </group>
        </>
    )
};

export { RomeLightningBolt };