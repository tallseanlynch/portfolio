import { TextureLoader } from 'three';
import { useLoader } from '@react-three/fiber';
import { whiteColor } from './romeColors';

const RomeGround: React.FC = (): JSX.Element => {
    const groundTexture = useLoader(TextureLoader, '/rome/ground-inverse-compressed.jpg')

    return (
        <mesh
            position={[0, 0, 0]}
            rotation={[-Math.PI * .5, 0, 0]}
            receiveShadow
        >
            <planeGeometry
                args={[5, 5, 1, 1]}
            />
            <meshStandardMaterial
                color={whiteColor}
                map={groundTexture}
                transparent={true}
                alphaTest={0.5}
            />
        </mesh>
    )
};

export { RomeGround };