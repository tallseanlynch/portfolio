import { 
    Color,
    DoubleSide, 
    Euler,
    PlaneGeometry,
    Vector3
} from 'three';

const crossWalkWidth = 10;
const crossWalkDepth = 47;

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
    uniforms: {
        dashOffset: {
            value: 0
        }
    },
    vertexShader: `
        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float dashOffset;
        varying vec2 vUv;

        void main() {
            vec4 crossWalkColor = vec4(1.0, 1.0, 1.0, 1.0);
            vec4 transparentColor = vec4(0.0, 0.0, 0.0, 0.0);
            vec4 finalColor = crossWalkColor;

            if(mod(vUv.y * 100.0 + dashOffset, 2.0) > .75 - dashOffset * .2) {
                finalColor = transparentColor;
            }

            gl_FragColor = finalColor;
        }
    `
}    

const DashedLine = ({
    pos = new Vector3(0, .025, 92.5), 
    scale = new Vector3(.5, 1, 110), 
    rotation = new Euler(0, 0, 0),
    dashOffset = 0
}) => {
    return (
        <mesh position={pos} scale={scale} rotation={rotation}>
            <primitive object={rotatedUnitPlaneGeometry.clone()} />
            <shaderMaterial 
                fragmentShader={dashedLineShader.fragmentShader}
                vertexShader={dashedLineShader.vertexShader}
                side={DoubleSide}
                transparent={true}
                uniforms={{
                    dashOffset: {
                        value: dashOffset
                    }
                }}
            />
        </mesh>
    )
}

const SolidWhiteLine = ({
    pos = new Vector3(0, .025, 92.5), 
    scale = new Vector3(.5, 1, 110), 
    rotation = new Euler(0, 0, 0)
}) => {
    return (
        <mesh position={pos} scale={scale} rotation={rotation}>
            <primitive object={rotatedUnitPlaneGeometry.clone()} />
            <meshBasicMaterial color={0xffffff} />
        </mesh>
    )
}

const StreetLines = ({position = new Vector3(), rotation = new Euler()}) => {
    return (
        <group position={position} rotation={rotation}>
            <mesh position={[0, .025, 92.5]} scale={[1, 1, 110]}>
                <primitive object={rotatedUnitPlaneGeometry.clone()} />
                <meshBasicMaterial color={0xffff00} />
            </mesh>

            <DashedLine pos={new Vector3(-5, .025, 92.5)} dashOffset={Math.random()}/>
            <DashedLine pos={new Vector3(-10, .025, 92.5)} dashOffset={Math.random()}/>
            <DashedLine pos={new Vector3(-15, .025, 92.5)} dashOffset={Math.random()}/>
            <SolidWhiteLine pos={new Vector3(-20, .025, 92.5)} />

            <DashedLine pos={new Vector3(5, .025, 92.5)} dashOffset={Math.random()}/>
            <DashedLine pos={new Vector3(10, .025, 92.5)} dashOffset={Math.random()}/>
            <DashedLine pos={new Vector3(15, .025, 92.5)} dashOffset={Math.random()}/>
            <SolidWhiteLine pos={new Vector3(20, .025, 92.5)}/>
        </group>
    )
}

const LargeGroundPlane = () => {
    return (
        <mesh position={[0, 0, 0]}>
            <primitive object={rotatedGroundPlaneGeometry} />
            <meshBasicMaterial color={roadColor} />
        </mesh>
    )
}

const CrossWalks = () => {
    return (
        <>
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
        </>
    )
}

const rotatedSideWalkGeometry = new PlaneGeometry(125, 125, 1, 1);
rotatedSideWalkGeometry.rotateX(-Math.PI / 2);
const sideWalkColor = new Color(0xcccccc);
const roadColor = new Color(0x999999);

const SideWalks = () => {
    return (
        <group>
            <mesh position={[87.5, .2, 87.5]}>
                <primitive object={rotatedSideWalkGeometry.clone()} />
                <meshBasicMaterial color={sideWalkColor} />
            </mesh>
            <mesh position={[87.5, .2, -87.5]}>
                <primitive object={rotatedSideWalkGeometry.clone()} />
                <meshBasicMaterial color={sideWalkColor} />
            </mesh>
            <mesh position={[-87.5, .2, -87.5]}>
                <primitive object={rotatedSideWalkGeometry.clone()} />
                <meshBasicMaterial color={sideWalkColor} />
            </mesh>
            <mesh position={[-87.5, .2, 87.5]}>
                <primitive object={rotatedSideWalkGeometry.clone()} />
                <meshBasicMaterial color={sideWalkColor} />
            </mesh>
        </group>
    )
}

const WalkingGround = () => {

    return (
        <group>
            <SideWalks />
            <StreetLines />
            <StreetLines position={new Vector3(0, 0, 0)} rotation={new Euler(0, Math.PI, 0)}/>
            <StreetLines position={new Vector3(0, 0, 0)} rotation={new Euler(0, -Math.PI / 2, 0)}/>            
            <LargeGroundPlane />
            <CrossWalks />
        </group>
    )
};

export { WalkingGround };