import {
    Vector3,
    DoubleSide
} from 'three';
import {
    grassBaseColor,
    dryTallGrassColor,
    skyColorLight
} from './insectsColors';
import { InsectsSmallFlowers } from './InsectsSmallFlowers';
import { InsectsGrass } from './InsectsGrass';

const groundShader = {
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
            float distanceFromCenter = distance(vPosition, vec3(0.0,0.0,0.0)) / 100.0;
            vec3 uvModColor = vec3(vPosition) * .25;
            vec3 groundColor = vec3(0.0, 1.0, 0.0);
            vec3 groundColorUvModColorMix = mix(groundColor, uvModColor, .05);
            vec3 groundColorSkyMix = mix(groundColor, vec3(1.0, 1.0, 1.0), distanceFromCenter);
            gl_FragColor = vec4(groundColorSkyMix, 1.0);
        }
    `,
};

const InsectsGround = () => {
    return (
        <>
            <InsectsSmallFlowers 
                baseColor={grassBaseColor}
                skyColor={skyColorLight}
                instanceNumber={500}
                instanceOrigin={new Vector3(0,0,-20)}
                circleGeometryArgs={[0.5, 8]}
                placementScale={16}
                instanceScale={2}            
            />
            <InsectsSmallFlowers 
                baseColor={grassBaseColor}
                skyColor={skyColorLight}
                instanceNumber={1500}
                instanceOrigin={new Vector3(0,0,0)}
                circleGeometryArgs={[0.5, 8]}
                placementScale={30}
                instanceScale={1}            
            />
            <InsectsSmallFlowers 
                baseColor={dryTallGrassColor}
                skyColor={skyColorLight}
                instanceNumber={500}
                instanceOrigin={new Vector3(0,0,0)}
                circleGeometryArgs={[0.5, 8]}
                placementScale={20}
                instanceScale={1}            
            />
            <InsectsGrass 
                baseColor={dryTallGrassColor}
                skyColor={skyColorLight}
                instanceNumber={500}
                instanceOrigin={new Vector3(-5,0,-5)}
                planeGeometryArgs={[0.05, 2, 1, 4]}
                placementScale={10}
                instanceScale={1}
            />
            <InsectsGrass 
                baseColor={dryTallGrassColor}
                skyColor={dryTallGrassColor}
                instanceNumber={500}
                instanceOrigin={new Vector3(5,0,3)}
                planeGeometryArgs={[0.05, 2, 1, 4]}
                placementScale={10}
                instanceScale={2}
            />
            <InsectsGrass 
                baseColor={grassBaseColor}
                skyColor={skyColorLight}
                instanceNumber={5000}
                instanceOrigin={new Vector3(0,0,0)}
                planeGeometryArgs={[0.15, 1, 1, 4]}
                placementScale={40}
                instanceScale={1.5}
            />
            <InsectsGrass 
                baseColor={dryTallGrassColor}
                skyColor={skyColorLight}
                instanceNumber={2500}
                instanceOrigin={new Vector3(0,0,0)}
                planeGeometryArgs={[0.15, 1, 1, 4]}
                placementScale={50}
                instanceScale={1.5}
            />
            <InsectsGrass 
                baseColor={grassBaseColor}
                skyColor={skyColorLight}
                instanceNumber={2500}
                instanceOrigin={new Vector3(0,0,0)}
                planeGeometryArgs={[0.15, 1, 1, 4]}
                placementScale={60}
                instanceScale={.5}
            />
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -.5, 0]}>
                <planeGeometry args={[1000, 1000, 1, 1]} />
                <shaderMaterial
                    vertexShader={groundShader.vertexShader}
                    fragmentShader={groundShader.fragmentShader}
                    uniforms={{
                        skyColorLight: {value: skyColorLight}
                    }}
                    side={DoubleSide}
                />
            </mesh>
        </>
    )
};

export { InsectsGround };