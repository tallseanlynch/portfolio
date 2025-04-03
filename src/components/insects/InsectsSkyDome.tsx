import React from 'react';
import { skyColorLight } from './insectsColors';
import { DoubleSide } from 'three';

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
        uniform vec3 skyColorLight;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
            vec3 skyColorMixWhite = mix(vec3(1.0, 1.0, 1.0), skyColorLight, vPosition.y * 2.0);
            gl_FragColor = vec4(skyColorMixWhite, 1.0);
        }
    `,
};

const InsectsSkyDome: React.FC = (): JSX.Element => {
    return (
        <mesh scale={[500, 500, 500]}>
            <sphereGeometry />
            <shaderMaterial
                vertexShader={skyDomeShader.vertexShader}
                fragmentShader={skyDomeShader.fragmentShader}
                uniforms={{
                    skyColorLight: {value: skyColorLight}
                }}
                side={DoubleSide}
            />
        </mesh>
    )
};

export { InsectsSkyDome };