import {
    TextureLoader,
    DoubleSide,
} from 'three';
import { useLoader } from '@react-three/fiber';
import { whiteColor } from './romeColors';

const RomeArch: React.FC = (): JSX.Element => {
    const archTexture = useLoader(TextureLoader, '/rome/arch-50-compressed-gray-compressed.png')

    return (
        <mesh
            castShadow
            position={[0, .66, 0]}
        >
            <planeGeometry
                args={[1, 1.35, 1, 1]}
            />
            <meshStandardMaterial
                color={whiteColor}
                map={archTexture}
                transparent={true}
                alphaTest={0.5}
                side={DoubleSide}
            />
        </mesh>
    )
};

export { RomeArch };