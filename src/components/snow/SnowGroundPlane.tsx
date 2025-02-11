import {
  TextureLoader,
  DoubleSide,
  NearestFilter,
} from 'three';
import {
  useLoader
} from '@react-three/fiber';
import { whiteColor } from './snowColors';

const SnowGroundPlane: React.FC = (): JSX.Element => {
  const groundTexture = useLoader(TextureLoader, './sprites/ground.png')
  groundTexture.magFilter = NearestFilter;
  groundTexture.minFilter = NearestFilter;
  const planeScale = 100;
  const scaleDivision = 400;

  return (
    <mesh
      position={[0, (groundTexture.image.height/scaleDivision) / 2, 0]}
      rotation={[Math.PI / 2, 0, Math.PI / 2]}
    >
      <planeGeometry args={[planeScale, planeScale, planeScale, planeScale]}/>
      <meshBasicMaterial 
        color={whiteColor}
        side={DoubleSide}
        map={groundTexture}
      />
    </mesh>
  )
};

export { SnowGroundPlane };