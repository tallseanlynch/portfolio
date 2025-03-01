import { whiteColor } from './romeColors';
import { useLoader } from '@react-three/fiber';
import {
    DoubleSide,
    TextureLoader
} from 'three';

const RomeDistanceMaterial: React.FC = (): JSX.Element => {
    const bushTexture0 = useLoader(TextureLoader, '/rome/bush-0-50-compressed.png')

    return (
        <meshStandardMaterial
            color={whiteColor}
            map={bushTexture0}
            transparent={true}
            side={DoubleSide}
            opacity={.125}
        />
    )
};

const RomeDistanceRing = () => {
    return (
        <mesh position={[0, 3, 0]} scale={[30, 1, 30]}>
            <cylinderGeometry args={[1, 1, 30, 16, 1, true]} />
            <RomeDistanceMaterial />
        </mesh>
    )
}

export { RomeDistanceRing }