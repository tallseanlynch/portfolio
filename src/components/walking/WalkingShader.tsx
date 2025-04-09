import { isMobileDevice } from '../../assets/js/util';
import { InsectsClouds } from '../insects/InsectsClouds';
import { InsectsSkyDome } from '../insects/InsectsSkyDome';
import { whiteColor, skyColorLight } from '../insects/insectsColors';
import { WalkingBoundries } from './WalkingBoundries';
import { WalkingBuildings } from './WalkingBuildings';
import { WalkingCars } from './WalkingCars';
import { WalkingGround } from './WalkingGround';
import { WalkingLights } from './WalkingLights';
import { WalkingPark } from './WalkingPark';
import { WalkingPeople } from './WalkingPeople';
import { OrbitControls } from '@react-three/drei';
import { 
  Canvas
} from '@react-three/fiber';
import { 
  NoToneMapping,
  Vector3
} from 'three';

const isMobile = isMobileDevice();

const WalkingShaderCanvas = () => {
  return (
    <Canvas
      gl={{ 
        antialias: true, 
        toneMapping: NoToneMapping,
        precision: 'highp'
      }}
      linear
      camera={{
        position: [-60, 10, 0]
      }}
    >
      <OrbitControls 
        maxDistance={120}
        maxPolarAngle={Math.PI * .49}
      />
      <WalkingPeople 
        width={isMobile ? 40 : 75} 
      />
      <WalkingBuildings />
      <WalkingCars />
      <WalkingGround />
      <WalkingLights />
      <WalkingBoundries />
      <WalkingPark />
      <InsectsClouds 
        whiteColor={whiteColor}
        skyColor={skyColorLight}
        instanceNumber={800}
        instanceOrigin={new Vector3(0,100,0)}
        placementScale={500}
        instanceScale={8}                  
      />
      <InsectsSkyDome />
    </Canvas>
  );
}

export { WalkingShaderCanvas };
