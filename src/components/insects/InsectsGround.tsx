import {
    Vector3,
    DoubleSide,
    PlaneGeometry
} from 'three';
import {
    grassBaseColor,
    dryTallGrassColor,
    skyColorLight,
    yellowColor,
    whiteColor,
    roseColor,
    dirtColor
} from './insectsColors';
import { InsectsSmallFlowers } from './InsectsSmallFlowers';
import { InsectsGrass } from './InsectsGrass';

const elevationPositions = [
    new Vector3(1.0, -2.0, -30.0),
    new Vector3(3.0, 2.0, -5.0),
    new Vector3(-5.0, 3.0, -10.0),
    new Vector3(-3.0, 4.0, -20.0),
    new Vector3(1.0, -2.0, 13.0),
    new Vector3(3.0, -2.0, 5.0),
    new Vector3(-5.0, -3.0, 10.0),
    new Vector3(-3.0, 4.0, 20.0),
    new Vector3(-4.0, -2.0, 15.0),
    new Vector3(-7.0, 4.0, 2.0),
    new Vector3(9.0, 3.0, 5.0),
    new Vector3(1.0, 3.0, 10.0),
    new Vector3(-9.0, -4.0, -15.0),
    new Vector3(-7.0, -4.0, -2.0),
    new Vector3(5.0, -3.0, -5.0),
    new Vector3(7.0, 3.0, -10.0),
    new Vector3(11.0, 3.0, -15.0),
    new Vector3(13.0, 3.0, -11.0),
    new Vector3(-15.0, 2.0, -23.0),
    new Vector3(-13.0, 3.0, -13.0),
    new Vector3(11.0, -2.0, 13.0),
    new Vector3(31.0, -2.0, 24.0),
    new Vector3(-15.0, 3.0, 27.0),
    new Vector3(-31.0, 3.0, 25.0),
    new Vector3(-41.0, 2.0, 25.0),
    new Vector3(-17.0, 3.0, 21.0),
    new Vector3(19.0, -2.0, 19.0),
    new Vector3(11.0, -2.0, 2.0),
    new Vector3(-31.0, 3.0, -25.0),
    new Vector3(-21.0, 1.5, -12.0),
    new Vector3(51.0, 2.0, -15.0),
    new Vector3(17.0, 2.0, -15.0),

]

const groundShader = {
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform vec3 elevationPositions[${elevationPositions.length}];

        vec3 returnElevation(vec3 vertexPosition, vec3 elevationPositions[${elevationPositions.length}]) {
            float elevationAdjustment = 0.0;
            
            for(int i = 0; i < ${elevationPositions.length}; i++) {
                float damping = 2.5;
                float width = abs(elevationPositions[i].y) * 2.0;
                float magnitude = elevationPositions[i].y / 2.0;
                vec3 flatPosition = vec3(elevationPositions[i].x, 0.0, elevationPositions[i].z);
                float distanceFromOrigin = distance(vertexPosition, flatPosition);

                if(distanceFromOrigin < width) {
                    float normalizedDistance = distanceFromOrigin / width;
                    float height = exp(-damping * normalizedDistance * normalizedDistance);
                    vertexPosition.y += height * magnitude;
                }            
            }
            return vertexPosition;
        }

        void main() {
            vUv = uv;
            vPosition = position;

            vec3 hillPosition = vec3(1.0, 0.0, -30.0);

            vPosition = returnElevation(vPosition, elevationPositions);

            gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 skyColorLight;
        uniform vec3 dryTallGrassColor;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
            float distanceFromCenter = distance(vPosition, vec3(0.0,0.0,0.0)) / 100.0;
            vec3 uvModColor = vec3(vPosition) * .25;
            vec3 groundColor = vec3(0.0, 1.0, 0.0);
            // vec3 groundColorUvModColorMix = mix(groundColor, uvModColor, .05);
            vec3 groundColorSkyMix = mix(groundColor, vec3(1.0, 1.0, 1.0), distanceFromCenter);
            vec3 groundHeightMix = vec3(0.0, 0.0, 0.0);
            if(vPosition.y < 0.0) {
                groundHeightMix = mix(groundColorSkyMix, skyColorLight, abs(vPosition.y) / (2.0 + distanceFromCenter));            
            } else {
                groundHeightMix = mix(groundColorSkyMix, dryTallGrassColor, vPosition.y / (2.0 + distanceFromCenter));
            }
            gl_FragColor = vec4(groundHeightMix, 1.0);
            // gl_FragColor = vec4(vPosition.z, vPosition.z, vPosition.z, 1.0);
            // gl_FragColor = vec4(vPosition.y, vPosition.y, vPosition.y, 1.0);
        }
    `,
};

const rotatedPlaneGeometry = new PlaneGeometry(200, 200, 500, 500);
rotatedPlaneGeometry.rotateX(Math.PI / 2);

const InsectsGround = () => {

    return (
        <>
            <mesh position={[0.0, -.5, 0.0]}>
                <primitive object={rotatedPlaneGeometry} />
                <shaderMaterial
                    vertexShader={groundShader.vertexShader}
                    fragmentShader={groundShader.fragmentShader}
                    uniforms={{
                        skyColorLight: {value: skyColorLight},
                        dryTallGrassColor: {value: dryTallGrassColor},
                        elevationPositions: {value: elevationPositions}
                    }}
                    side={DoubleSide}
                />
            </mesh>
            <InsectsSmallFlowers 
                baseColor={skyColorLight}
                skyColor={roseColor}
                instanceNumber={150}
                instanceOrigin={new Vector3(-10,0,10)}
                circleGeometryArgs={[0.25, 8]}
                placementScale={16}
                instanceScale={1}            
            />
            <InsectsSmallFlowers 
                baseColor={whiteColor}
                skyColor={roseColor}
                instanceNumber={150}
                instanceOrigin={new Vector3(10,0,10)}
                circleGeometryArgs={[0.25, 8]}
                placementScale={8}
                instanceScale={1}            
            />
            <InsectsSmallFlowers 
                baseColor={whiteColor}
                skyColor={skyColorLight}
                instanceNumber={500}
                instanceOrigin={new Vector3(0,0,-10)}
                circleGeometryArgs={[0.25, 8]}
                placementScale={16}
                instanceScale={1}            
            />
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
                skyColor={dirtColor}
                instanceNumber={750}
                instanceOrigin={new Vector3(-20,0,-20)}
                planeGeometryArgs={[0.05, 2, 1, 4]}
                placementScale={10}
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
                baseColor={yellowColor}
                skyColor={yellowColor}
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
                planeGeometryArgs={[0.05, 1, 1, 4]}
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
        </>
    )
};

export { InsectsGround };