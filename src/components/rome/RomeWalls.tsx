import { whiteColor } from "./romeColors";
import { 
    DoubleSide,
    TextureLoader
 } from "three";
import { useLoader } from "@react-three/fiber";

const RomeWallMaterial0: React.FC = (): JSX.Element => {
    const wall0 = useLoader(TextureLoader, '/rome/wall-0-50-compressed.png');

    return (
        <meshStandardMaterial
            color={whiteColor}
            map={wall0}
            transparent={true}
            alphaTest={0.5}
            side={DoubleSide}
        />
    )
};

const RomeWallMaterial1: React.FC = (): JSX.Element => {
    const wall1 = useLoader(TextureLoader, '/rome/wall-1-50-compressed.png');

    return (
        <meshStandardMaterial
            color={whiteColor}
            map={wall1}
            transparent={true}
            alphaTest={0.5}
            side={DoubleSide}
        />
    )
};

const RomeWalls: React.FC = (): JSX.Element => {

    return (
        <>
            <mesh
                castShadow
                position={[-.56, .12, 0.15]}
                rotation={[0, Math.PI * .25, 0]}
            >
                <planeGeometry
                    args={[.5, .25, 1, 1]}
                />
                <RomeWallMaterial0 />
            </mesh>
            <mesh
                castShadow
                position={[-1.215, .12, 0.325]}
            >
                <planeGeometry
                    args={[1, .25, 1, 1]}
                />
                <RomeWallMaterial1 />
            </mesh>
            <mesh
                castShadow
                position={[.56, .12, 0.15]}
                rotation={[0, Math.PI * -.25, 0]}
            >
                <planeGeometry
                    args={[.5, .25, 1, 1]}
                />
                <RomeWallMaterial1 />
            </mesh>
            <mesh
                castShadow
                position={[1.215, .12, 0.325]}
            >
                <planeGeometry
                    args={[1, .25, 1, 1]}
                />
                <RomeWallMaterial0 />
            </mesh>
        </>
    )
};

export { RomeWalls };