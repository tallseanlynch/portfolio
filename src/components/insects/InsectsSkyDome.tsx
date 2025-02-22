import { DoubleSide } from 'three';
import { skyColorLight } from './insectsColors';

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

const InsectsSkyDome = () => {
    return (
        <mesh scale={[100, 100, 100]}>
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