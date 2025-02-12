import { MeshReflectorMaterial } from '@react-three/drei';
import { TextureLoader } from 'three'; 
import { useLoader } from "@react-three/fiber";

const RomeGround: React.FC = (): JSX.Element => {
    const groundTexture = useLoader(TextureLoader, '/rome/ground-inverse-compressed.jpg')

    return (
        <mesh
            position={[0, 0, 0]}
            rotation={[-Math.PI * .5, 0, 0]}
        >
            <planeGeometry 
                args={[5, 5, 1, 1]}
            />
            <MeshReflectorMaterial
                blur={[0, 0]}
                mixBlur={0}
                mixStrength={10}
                mixContrast={1}
                resolution={256}
                mirror={1}
                depthScale={0}
                minDepthThreshold={0.9}
                maxDepthThreshold={1}
                depthToBlurRatioBias={0.25}
                distortion={1}
                distortionMap={groundTexture}
            />
        </mesh>
    )
};

export { RomeGround };