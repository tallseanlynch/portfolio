import {
  useGPGPU,
  // useGPGPUTracking
} from './useGPGPU';
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
  CanvasTexture,
  DoubleSide,
  InstancedMesh,
  MeshBasicMaterial,
  // MeshBasicMaterial,
  Object3D,
  PlaneGeometry,
  ShaderMaterial
} from 'three';

const planeSize = 100;
const planeUnitResolution = 10;
const trackingPlaneTextureResolution = planeSize * planeUnitResolution;
const rotatedPlaneGeometry = new PlaneGeometry(planeSize, planeSize, 1, 1);
rotatedPlaneGeometry.rotateX(Math.PI / 2);
const matrixPositionObject =  new Object3D;
const instanceScale = .75;

const WalkingPeople = ({ width = 100, spread = 50.0}) => {
  const instancedMeshRef = useRef<InstancedMesh>();
  const numPeople = width * width;
  const { gpgpuRenderer, data } = useGPGPU(numPeople, spread);
  // const { gpgpuRenderer: gpgpuTrackingRenderer, data: trackingData } = useGPGPUTracking(
  //   planeSize, 
  //   planeUnitResolution, 
  //   width, 
  //   gpgpuRenderer
  //     .getCurrentRenderTarget(data.position.variables.positionVariable).texture
  // );
  const velocityCheckMaterialRef = useRef<MeshBasicMaterial>();
  const destinationCheckMaterialRef = useRef<MeshBasicMaterial>();
  const positionCheckMaterialRef = useRef<MeshBasicMaterial>();
  const trackingCheckMaterialRef = useRef<MeshBasicMaterial>();
  const goundMaterialRef = useRef<MeshBasicMaterial>();

  console.log(planeSize, gpgpuRenderer, data)
  // console.log(planeSize, gpgpuTrackingRenderer, trackingData)

  const canvas = useMemo(() => {
    const offscreenCanvas = new OffscreenCanvas(trackingPlaneTextureResolution, trackingPlaneTextureResolution);
    const ctx = offscreenCanvas.getContext('2d');

    // Initial drawing setup
    if(ctx) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, trackingPlaneTextureResolution, trackingPlaneTextureResolution);  
    }

    // Create a texture from the OffscreenCanvas
    const texture = new CanvasTexture(offscreenCanvas);
    texture.needsUpdate = true; // Ensure texture is updated on creation

    return {
      texture, 
      ctx
    };
  }, []); // Empty dependency array means this runs only once

  useEffect(() => {
    if(instancedMeshRef.current) {
      for ( let i=0 ; i<numPeople ; i++ ) {
        matrixPositionObject.scale.y = 2.0 + (Math.random() * instanceScale) - instanceScale / 2;
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
      gDestinationMap: { value: data.destination.texture },
      time: { value: 0 }
    },
    vertexShader: `
      uniform sampler2D gVelocityMap;
      uniform sampler2D gPositionMap;
      uniform sampler2D gDestinationMap;
      uniform float time;
      varying vec4 vPosition;
      varying vec3 vOriginalPosition;
      varying vec4 vgPosition;
      varying vec4 vgDestination;

      void main() {
        vOriginalPosition = position;
        int index = gl_InstanceID;
        float floatIndex = float(index);
        float xCoor = mod(floatIndex, ${width}.0);
        float yCoor = mod(floatIndex / ${width}.0, ${width}.0);
        vec2 uv = vec2(xCoor / ${width}.0, yCoor / ${width}.0);
        vec4 gVelocityData = texture2D(gVelocityMap, uv);        
        vec4 gPositionData = texture2D(gPositionMap, uv);
        vec4 gDestinationData = texture2D(gDestinationMap, uv);
        vgPosition = gPositionData;
        vgDestination = gDestinationData;
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
      varying vec4 vgDestination;

      void main() {
        vec4 positionColor = vgPosition;
        vec4 destinationColor = vgDestination;
        vec4 finalColor = positionColor;

        if(vOriginalPosition.z > 0.0) {
          finalColor = vec4(1.0, 1.0, 1.0, 1.0);
        }

        if(distance(vgPosition, vgDestination) < .25) {
          finalColor = vec4(.5, .5, .5, 1.0);
        }

        gl_FragColor = finalColor;
      }
    `,
    side: DoubleSide
  }), [
    width, 
    data.position.texture,
    data.velocity.texture,
    data.destination.texture
  ]);

  // const trackingShaderMaterial = useMemo(() => new ShaderMaterial({
  //   uniforms: {
  //     gPositionTrackingMap: { value: trackingData.positionTracking.texture}
  //   },
  //   vertexShader: `
  //     varying vec2 vUv;

  //     void main() {
  //       vUv = uv;
  //       gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  //     }
  //   `,
  //   fragmentShader: `
  //     uniform sampler2D gPositionTrackingMap;
  //     varying vec2 vUv;

  //     void main() {
  //       vec4 gPositionTrackingData = texture2D(gPositionTrackingMap, vUv);
  //       gl_FragColor = gPositionTrackingData;
  //       // gl_FragColor = vec4(vUv.x, vUv.y, 0.0, 1.0);
  //     }
  //   `,
  //   side: DoubleSide,
  //   transparent: true
  // }), [
  //   trackingData.positionTracking.texture
  // ]);

  const buffer = useMemo(() => {
    return new Float32Array(width * width * 4);
  }, [width])

  useFrame(({
    clock,
    gl
  }) => {

    gl.readRenderTargetPixels(
      gpgpuRenderer.getCurrentRenderTarget(data.position.variables.positionVariable),
      0, 0, width, width,
      buffer
    );

    if(canvas.ctx && trackingCheckMaterialRef.current && goundMaterialRef.current) {

      // // origin
      // canvas.ctx.fillStyle = 'blue';
      // canvas.ctx.fillRect(500, 500, 4, 4);

      canvas.ctx.fillStyle = 'red';
      for (let i = 0; i < buffer.length; i += 4) {
            // const x = (i / 4) % width;
            // const y = Math.floor((i / 4) / width);
            canvas.ctx.fillRect(500 + buffer[i] * 10, 500 + buffer[i + 2] * -10, 2, 2);
    }
    canvas.texture.needsUpdate = true;
    trackingCheckMaterialRef.current.needsUpdate = true;
    goundMaterialRef.current.needsUpdate = true;
  }

    // computer renderers
    // gpgpuTrackingRenderer.compute();
    gpgpuRenderer.compute();

    shaderMaterial.uniforms.time.value = clock.elapsedTime;

    // positions

    shaderMaterial.uniforms.gPositionMap.value = gpgpuRenderer
      .getCurrentRenderTarget(data.position.variables.positionVariable).texture;
    data.position.variables.positionVariable.material.uniforms.uTime.value = clock.elapsedTime;
    data.position.variables.positionVariable.material.uniforms.uDeltaTime.value = clock.getDelta();
    // input position texture back into position fragment
    data.position.variables.positionVariable.material.uniforms.uInitialPosition.value = gpgpuRenderer
    .getCurrentRenderTarget(data.position.variables.positionVariable).texture;
    // input velocity texture back into position fragment
    data.position.variables.positionVariable.material.uniforms.uInitialVelocity.value = gpgpuRenderer
    .getCurrentRenderTarget(data.velocity.variables.velocityVariable).texture;

    // velocity

    shaderMaterial.uniforms.gVelocityMap.value = gpgpuRenderer
      .getCurrentRenderTarget(data.velocity.variables.velocityVariable).texture;
    data.velocity.variables.velocityVariable.material.uniforms.uTime.value = clock.elapsedTime;
    data.velocity.variables.velocityVariable.material.uniforms.uDeltaTime.value = clock.getDelta();
    // input position texture back into velocity fragment
    data.velocity.variables.velocityVariable.material.uniforms.uInitialPosition.value = gpgpuRenderer
    .getCurrentRenderTarget(data.position.variables.positionVariable).texture;

    // destination

    shaderMaterial.uniforms.gDestinationMap.value = gpgpuRenderer
      .getCurrentRenderTarget(data.destination.variables.destinationVariable).texture;
    data.destination.variables.destinationVariable.material.uniforms.uTime.value = clock.elapsedTime;
    data.destination.variables.destinationVariable.material.uniforms.uDeltaTime.value = clock.getDelta();


    // // tracking material

    // trackingData.positionTracking.variables.positionTrackingVariable.material.uniforms.uTime.value = clock.elapsedTime;
    // trackingShaderMaterial.uniforms.gPositionTrackingMap.value = gpgpuTrackingRenderer
    //  .getCurrentRenderTarget(trackingData.positionTracking.variables.positionTrackingVariable).texture;
    // // trackingData.positionTracking.variables.positionTrackingVariable.material.uniforms.uInitialPositionTracking.value = gpgpuRenderer
    // //  .getCurrentRenderTarget(trackingData.positionTracking.variables.positionTrackingVariable).texture; 
    //  //  uInitialPositionTracking
    

     // check materials

    if (positionCheckMaterialRef.current) {
      positionCheckMaterialRef.current.map = gpgpuRenderer
        .getCurrentRenderTarget(data.position.variables.positionVariable).texture;
      positionCheckMaterialRef.current.needsUpdate = true;
    }

    if (velocityCheckMaterialRef.current) {
      velocityCheckMaterialRef.current.map = gpgpuRenderer
        .getCurrentRenderTarget(data.velocity.variables.velocityVariable).texture;
      velocityCheckMaterialRef.current.needsUpdate = true;
    }

    if (destinationCheckMaterialRef.current) {
      destinationCheckMaterialRef.current.map = gpgpuRenderer
        .getCurrentRenderTarget(data.destination.variables.destinationVariable).texture;
      destinationCheckMaterialRef.current.needsUpdate = true;
    }

    // if (trackingCheckMaterialRef.current) {
    //   trackingCheckMaterialRef.current.map = gpgpuRenderer
    //     .getCurrentRenderTarget(trackingData.positionTracking.variables.positionTrackingVariable).texture;
    //     trackingCheckMaterialRef.current.needsUpdate = true;
    // }

  });

  return (
    <>
      <mesh 
        position={[0.0, 0.0, 0.0]}
        // material={trackingShaderMaterial}
      >
        <primitive object={rotatedPlaneGeometry} />
        <meshBasicMaterial color={0xffffff} side={DoubleSide} map={canvas.texture} ref={goundMaterialRef}/>
        {/* <meshBasicMaterial color={0xffffff} side={DoubleSide} map={trackingData.positionTracking.texture}/> */}
      </mesh>
      {/* <gridHelper 
        args={[100, 100, 100, 100]} 
        position={[0, 0.01, 0]}
      /> */}
      <instancedMesh 
        ref={instancedMeshRef} 
        args={[null as any, null as any, numPeople]} 
        material={shaderMaterial}
      >
        <boxGeometry args={[1, 1, .1, 1, 1, 1]} />
      </instancedMesh>

      <mesh position={[-10, 10, -10]}>
        <planeGeometry args={[10, 10, 1, 1]} />
        <meshBasicMaterial 
          ref={positionCheckMaterialRef}
          map={data.position.texture} 
          color={0xffffff}
        />
      </mesh>
      <mesh position={[0, 10, -10]}>
        <planeGeometry args={[10, 10, 1, 1]} />
        <meshBasicMaterial 
          ref={velocityCheckMaterialRef}
          map={data.velocity.texture} 
          color={0xffffff}
        />
      </mesh>
      <mesh position={[10, 10, -10]}>
        <planeGeometry args={[10, 10, 1, 1]} />
        <meshBasicMaterial 
          ref={destinationCheckMaterialRef}
          map={data.destination.texture} 
          color={0xffffff}
        />
      </mesh>
      <mesh position={[20, 10, -10]}>
        <planeGeometry args={[10, 10, 1, 1]} />
        <meshBasicMaterial 
          ref={trackingCheckMaterialRef}
          map={canvas.texture} 
          color={0xffffff}
          transparent={true}
        />
      </mesh>
    </>
  );
};

const WalkingShaderCanvas = () => {
  return (
    <Canvas camera={{position: [0, 25, 25]}}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <WalkingPeople width={50} spread={50}/>
      <OrbitControls/>
    </Canvas>
  );
}

export { WalkingShaderCanvas };
