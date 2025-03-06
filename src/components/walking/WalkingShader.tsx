import useGPGPU from './useGPGPU';
import { OrbitControls } from '@react-three/drei';
import { 
  Canvas, 
  useFrame 
} from '@react-three/fiber';
import { 
  useEffect, 
  useRef, 
  useMemo 
} from 'react';
import { 
  DoubleSide,
  InstancedMesh,
  MeshBasicMaterial,
  Object3D,
  PlaneGeometry,
  ShaderMaterial
} from 'three';

const rotatedPlaneGeometry = new PlaneGeometry(100, 100, 1, 1);
rotatedPlaneGeometry.rotateX(Math.PI / 2);
const matrixPositionObject =  new Object3D;
const instanceScale = .75;

const WalkingPeople = ({ width = 100, spread = 50.0 }) => {
  const instancedMeshRef = useRef<InstancedMesh>();
  const numPeople = width * width;
  const { gpgpuRenderer, data } = useGPGPU(numPeople, spread);
  // const velocityCheckMaterialRef = useRef<MeshBasicMaterial>()

  console.log(numPeople)

  useEffect(() => {
    if(instancedMeshRef.current) {
      for ( let i=0 ; i<numPeople ; i++ ) {
        matrixPositionObject.scale.y = 1.5 + (Math.random() * instanceScale) - instanceScale / 2;
        matrixPositionObject.position.set(0, matrixPositionObject.scale.y / 2, 0);        
        matrixPositionObject.updateMatrix();
        instancedMeshRef.current.setMatrixAt( i, matrixPositionObject.matrix );
        instancedMeshRef.current.frustumCulled = false;
      }
      instancedMeshRef.current.instanceMatrix.needsUpdate = true;
      instancedMeshRef.current.frustumCulled = false;
    }
  }, [])

  const shaderMaterial = useMemo(() => new ShaderMaterial({
    uniforms: {
      gPositionMap: { value: data.position.texture},
      gVelocityMap: { value: data.velocity.texture},
      time: { value: 0 }
    },
    vertexShader: `
      uniform sampler2D gVelocityMap;
      uniform sampler2D gPositionMap;
      uniform float time;
      varying vec4 vPosition;
      varying vec3 vOriginalPosition;
      varying vec4 vgPosition;
      void main() {
        vOriginalPosition = position;
        int index = gl_InstanceID;
        float floatIndex = float(index);
        float xCoor = mod(floatIndex, ${width}.0);
        float yCoor = mod(floatIndex / ${width}.0, ${width}.0);
        vec2 uv = vec2(xCoor / ${width}.0, yCoor / ${width}.0);
        vec4 gVelocityData = texture2D(gVelocityMap, uv);        
        vec4 gPositionData = texture2D(gPositionMap, uv);
        vgPosition = gPositionData;
        vec4 mvPosition = vec4( position, 1.0 );
        #ifdef USE_INSTANCING
            mvPosition = instanceMatrix * mvPosition;
            vPosition = mvPosition;
        #endif

        float angle = atan(gVelocityData.x, gVelocityData.z);
        mat4 rotationMatrix = mat4(
            cos(angle), 0.0, -sin(angle), 0.0,
            0.0, 1.0, 0.0, 0.0,
            sin(angle), 0.0, cos(angle), 0.0,
            0.0, 0.0, 0.0, 1.0
        );

        vPosition = rotationMatrix * vPosition;
        vPosition.x = vPosition.x + gPositionData.x;// + (gVelocityData.x * (time));
        vPosition.y = vPosition.y + gPositionData.y;// + (gVelocityData.y * (time));
        vPosition.z = vPosition.z + gPositionData.z;// + (gVelocityData.z * (time));

        gl_Position = projectionMatrix * modelViewMatrix * vPosition;
      }
    `,
    fragmentShader: `
      varying vec4 vgPosition;
      varying vec3 vOriginalPosition;
      void main() {
        vec4 positionColor = vgPosition;

        if(vOriginalPosition.z > 0.0) {
          positionColor = vec4(1.0, 1.0, 1.0, 1.0);
        }
        gl_FragColor = positionColor;
      }
    `,
    side: DoubleSide
  }), [
    width, 
    data.position.texture,
    data.velocity.texture
  ]);

  useFrame(({
    clock
  }) => {
    gpgpuRenderer.compute();

    shaderMaterial.uniforms.time.value = clock.elapsedTime;

    shaderMaterial.uniforms.gPositionMap.value = gpgpuRenderer
      .getCurrentRenderTarget(data.position.variables.positionVariable).texture;
    data.position.variables.positionVariable.material.uniforms.uTime.value = clock.elapsedTime;
    data.position.variables.positionVariable.material.uniforms.uDeltaTime.value = clock.getDelta();
    data.position.variables.positionVariable.material.uniforms.uInitialPosition.value = gpgpuRenderer
    .getCurrentRenderTarget(data.position.variables.positionVariable).texture;

    shaderMaterial.uniforms.gVelocityMap.value = gpgpuRenderer
      .getCurrentRenderTarget(data.velocity.variables.velocityVariable).texture;
    data.velocity.variables.velocityVariable.material.uniforms.uTime.value = clock.elapsedTime;
    data.velocity.variables.velocityVariable.material.uniforms.uDeltaTime.value = clock.getDelta();

    // if (velocityCheckMaterialRef.current) {
    //   velocityCheckMaterialRef.current.map = gpgpuRenderer.getCurrentRenderTarget(data.velocity.variables.velocityVariable).texture;
    //   velocityCheckMaterialRef.current.needsUpdate = true; // Ensure Three.js knows the texture has updated
    // }

  });

  return (
    <>
      <mesh position={[0.0, 0.0, 0.0]}>
        <primitive object={rotatedPlaneGeometry} />
        <meshBasicMaterial color={0x00ff00} side={DoubleSide}/>
      </mesh>
      <gridHelper args={[100, 100, 100, 100]} position={[0, 0.01, 0]}/>
      <instancedMesh ref={instancedMeshRef} args={[null as any, null as any, numPeople]} material={shaderMaterial}>
        <boxGeometry args={[1, 1, .1, 1, 1, 1]} />
      </instancedMesh>
      {/* <mesh position={[0, 10, -10]}>
        <planeGeometry args={[100, 100, 1, 1]} />
        <meshBasicMaterial 
          ref={velocityCheckMaterialRef}
          map={data.velocity.texture} 
          color={0xffffff}
        />
      </mesh> */}
    </>
  );
};

const WalkingShaderCanvas = () => {
  return (
    <Canvas camera={{position: [0, 5, 5]}}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <WalkingPeople width={100} spread={50}/>
      <OrbitControls/>
    </Canvas>
  );
}

export { WalkingShaderCanvas };
