import { DoubleSide, PlaneGeometry } from 'three';

const crossWalkWidth = 10;
const crossWalkDepth = 50;

const rotatedPlaneGeometry = new PlaneGeometry(crossWalkWidth, crossWalkDepth, 1, 1);
rotatedPlaneGeometry.rotateX(-Math.PI / 2);

const WalkingGround = () => {
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

    return (
        <group>
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