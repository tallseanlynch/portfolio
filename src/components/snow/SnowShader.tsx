import {
  TextureLoader,
  Vector3,
  DoubleSide,
  Color,
  NearestFilter,
  PlaneGeometry,
  MeshBasicMaterial,
  InstancedMesh,
  Object3D,
  NoToneMapping,
  Fog
} from 'three';
import {
  Canvas,
  useLoader
} from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import {
  defaultFogColor, 
  defaultSceneFog
} from './snowColors';
import { Snowflakes } from './Snowflakes';
import { SnowGroundPlane } from './SnowGroundPlane';
import { spritePaths } from './spritePaths';

const SnowShader:React.FC = (): JSX.Element => {
  const sprites = useRef<InstancedMesh[]>([]);
  const positionInterval = 50;
  const scaleDivision = 400;
  const texturePaths = useMemo(() => spritePaths, []);

  const allTextures = useLoader(TextureLoader, texturePaths);

  useMemo(() => { 
    const matrixCalcObject = new Object3D();
    const meshes = allTextures.map(texture => {
      texture.magFilter = NearestFilter;
      texture.minFilter = NearestFilter;
      const geo = new PlaneGeometry(1, 1);
      const mat = new MeshBasicMaterial({
        side: DoubleSide,
        map: texture,
        transparent: true,
        alphaTest: 0.5
      });
      const instanceCount = 25 + Math.round(Math.random() * 75);
      const instancedMesh = new InstancedMesh(geo, mat, instanceCount);
      for (let instanceIndex = 0; instanceIndex < instanceCount; instanceIndex++) {
        const scaleX = .5 + Math.random() * 2;
        const scaleY = .5 + Math.random() * 2;
        matrixCalcObject.position.set((Math.random() * positionInterval) - (Math.random() * positionInterval), 0, (Math.random() * positionInterval) - (Math.random() * positionInterval));
        matrixCalcObject.position.y = ((texture.image.height / scaleDivision) * scaleY) / 2 + .05
        matrixCalcObject.rotation.y = Math.random() * 2 * Math.PI
        matrixCalcObject.scale.set((texture.image.width / scaleDivision) * scaleX, (texture.image.height / scaleDivision) * scaleY, 1);
        matrixCalcObject.updateMatrix();
        instancedMesh.setMatrixAt(instanceIndex, matrixCalcObject.matrix);
      }
      return instancedMesh;
    });
    if(sprites.current) {
      sprites.current = meshes;
    }
  }, [allTextures])

  return (
    <>
      {sprites.current && sprites.current.map((mesh, index) => {
        return <primitive key={index} object={mesh} />
      })}
    </>
  )
};

interface SnowShaderCanvasProps {
  sceneFog?: Fog,
  backgroundColor?: Color,
  classNames?: string
};

const SnowShaderCanvas: React.FC<SnowShaderCanvasProps> = ({
  sceneFog = defaultSceneFog, 
  backgroundColor = defaultFogColor,
  classNames = ''
}) => {
  return (
    <Canvas
      camera={{ position: new Vector3(25, 10, 0) }}
      gl={{ antialias: true, toneMapping: NoToneMapping }}
      linear
      scene={{ fog: sceneFog, background: backgroundColor }}
      className={classNames}
    >
      <Snowflakes />
      <SnowGroundPlane />
      <SnowShader />
      <OrbitControls
        enableDamping={true}
        dampingFactor={0.05}
        screenSpacePanning={false}
        autoRotate={true}
        autoRotateSpeed={.5}
        zoomSpeed={.1}
        panSpeed={.1}
        rotateSpeed={.1}
      />
    </Canvas>
  )
};

export { SnowShader, SnowShaderCanvas };