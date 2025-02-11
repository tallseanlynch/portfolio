import {
    TextureLoader,
    DoubleSide,
} from 'three';
import { useLoader } from '@react-three/fiber';
import { whiteColor } from './romeColors';

const RomeTreeMaterial0: React.FC = (): JSX.Element => {
    const treeTexture0 = useLoader(TextureLoader, '/rome/tree-0-inverse-mix-1-50-compressed.png')

    return (
        <meshStandardMaterial
            color={whiteColor}
            map={treeTexture0}
            transparent={true}
            alphaTest={0.5}
            side={DoubleSide}
        />
    )
};

const RomeTreeMaterial1: React.FC = (): JSX.Element => {
    const treeTexture1 = useLoader(TextureLoader, '/rome/tree-0-inverse-mix-2-50-compressed.png')

    return (
        <meshStandardMaterial
            color={whiteColor}
            map={treeTexture1}
            transparent={true}
            alphaTest={0.5}
            side={DoubleSide}
        />
    )
};

const RomeTrees: React.FC = (): JSX.Element => {

    return (
        <>
            <mesh
                position={[-.75, .66, 0.2]}
            >
                <planeGeometry
                    args={[1, 1.35, 1, 1]}
                />
                <RomeTreeMaterial0 />
            </mesh>
            <mesh
                position={[-1.25, .8, -0.2]}
                rotation={[0, Math.PI, 0]}
            >
                <planeGeometry
                    args={[1.25, 1.75, 1, 1]}
                />
                <RomeTreeMaterial1 />
            </mesh>
            <mesh
                position={[.75, .9, 0.15]}
            >
                <planeGeometry
                    args={[1, 1.75, 1, 1]}
                />
                <RomeTreeMaterial0 />
            </mesh>
            <mesh
                position={[1.25, .8, -0.2]}
                rotation={[0, Math.PI, 0]}
            >
                <planeGeometry
                    args={[1.25, 1.75, 1, 1]}
                />
                <RomeTreeMaterial1 />
            </mesh>
        </>
    )
};

export { RomeTrees };