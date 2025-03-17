import { 
    DoubleSide, 
    Euler,
    PlaneGeometry,
    Vector3
} from 'three';

const crossWalkWidth = 10;
const crossWalkDepth = 50;

const rotatedPlaneGeometry = new PlaneGeometry(crossWalkWidth, crossWalkDepth, 1, 1);
rotatedPlaneGeometry.rotateX(-Math.PI / 2);

const groundPlaneSize = 300;
const rotatedGroundPlaneGeometry = new PlaneGeometry(groundPlaneSize, groundPlaneSize, 1, 1);
rotatedGroundPlaneGeometry.rotateX(-Math.PI / 2);

const rotatedUnitPlaneGeometry = new PlaneGeometry(1, 1, 1, 1);
rotatedUnitPlaneGeometry.rotateX(-Math.PI / 2);

const crossWalkShader = {
    vertexShader: `
        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        varying vec2 vUv;

        void main() {
            vec4 crossWalkColor = vec4(1.0, 1.0, 1.0, 1.0);
            vec4 transparentColor = vec4(0.0, 0.0, 0.0, 0.0);
            vec4 finalColor = crossWalkColor;

            if(mod(vUv.y * 100.0, 2.0) > 1.5) {
                finalColor = transparentColor;
            }

            gl_FragColor = finalColor;
        }
    `
}    

const dashedLineShader = {
    vertexShader: `
        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        varying vec2 vUv;

        void main() {
            vec4 crossWalkColor = vec4(1.0, 1.0, 1.0, 1.0);
            vec4 transparentColor = vec4(0.0, 0.0, 0.0, 0.0);
            vec4 finalColor = crossWalkColor;

            if(mod(vUv.y * 100.0, 2.0) > .75) {
                finalColor = transparentColor;
            }

            gl_FragColor = finalColor;
        }
    `
}    

const DashedLine = ({
    pos = new Vector3(0, .025, 92.5), 
    scale = new Vector3(.5, 1, 110), 
    rotation = new Euler(0, 0, 0)
}) => {
    return (
        <mesh position={pos} scale={scale} rotation={rotation}>
            <primitive object={rotatedUnitPlaneGeometry.clone()} />
            <shaderMaterial 
                fragmentShader={dashedLineShader.fragmentShader}
                vertexShader={dashedLineShader.vertexShader}
                side={DoubleSide}
                transparent={true}
            />
        </mesh>
    )
}

const WalkingGround = () => {

    return (
        <group>

            <group>
                <mesh position={[0, .025, 92.5]} scale={[1, 1, 110]}>
                    <primitive object={rotatedUnitPlaneGeometry} />
                    <meshBasicMaterial color={0xffff00} />
                </mesh>

                <DashedLine pos={new Vector3(-5, .025, 92.5)} />
                <DashedLine pos={new Vector3(-10, .025, 92.5)} />
                <DashedLine pos={new Vector3(-15, .025, 92.5)} />
                <DashedLine pos={new Vector3(-20, .025, 92.5)} />

                <DashedLine pos={new Vector3(5, .025, 92.5)} />
                <DashedLine pos={new Vector3(10, .025, 92.5)} />
                <DashedLine pos={new Vector3(15, .025, 92.5)} />
                <DashedLine pos={new Vector3(20, .025, 92.5)} />
            </group>

            <mesh position={[0, 0, 0]}>
                <primitive object={rotatedGroundPlaneGeometry} />
                <meshBasicMaterial color={0xaaaaaa} />
            </mesh>

            <mesh position={[-30, .02, 0]}>
                <primitive object={rotatedPlaneGeometry} />
                <shaderMaterial 
                    fragmentShader={crossWalkShader.fragmentShader}
                    vertexShader={crossWalkShader.vertexShader}
                    side={DoubleSide}
                    transparent={true}
                />
            </mesh>
            <mesh position={[30, .02, 0]}>
                <primitive object={rotatedPlaneGeometry.clone()} />
                <shaderMaterial 
                    fragmentShader={crossWalkShader.fragmentShader}
                    vertexShader={crossWalkShader.vertexShader}
                    side={DoubleSide}
                    transparent={true}
                />
            </mesh>
            <mesh position={[0, .02, -30]} rotation={[0, Math.PI * .5, 0]}>
                <primitive object={rotatedPlaneGeometry.clone()} />
                <shaderMaterial 
                    fragmentShader={crossWalkShader.fragmentShader}
                    vertexShader={crossWalkShader.vertexShader}
                    side={DoubleSide}
                    transparent={true}
                />
            </mesh>
            <mesh position={[0, .02, 30]} rotation={[0, Math.PI * .5, 0]}>
                <primitive object={rotatedPlaneGeometry.clone()} />
                <shaderMaterial 
                    fragmentShader={crossWalkShader.fragmentShader}
                    vertexShader={crossWalkShader.vertexShader}
                    side={DoubleSide}
                    transparent={true}
                />
            </mesh>
            <mesh position={[0, .02, 0]} rotation={[0, Math.PI * .25, 0]}>
                <primitive object={rotatedPlaneGeometry.clone()} />
                <shaderMaterial 
                    fragmentShader={crossWalkShader.fragmentShader}
                    vertexShader={crossWalkShader.vertexShader}
                    side={DoubleSide}
                    transparent={true}
                />
            </mesh>

            
        </group>
    )
};

export { WalkingGround };