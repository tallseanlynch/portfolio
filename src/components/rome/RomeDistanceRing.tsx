import {
    TextureLoader,
    DoubleSide
} from 'three';
import { useLoader } from '@react-three/fiber';
import { whiteColor } from './romeColors';

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
        <mesh position={[0, 3, 0]} scale={[20, 1, 20]}>
            <cylinderGeometry args={[1, 1, 30, 16, 1, true]} />
            <RomeDistanceMaterial />
        </mesh>
    )
}

export { RomeDistanceRing }