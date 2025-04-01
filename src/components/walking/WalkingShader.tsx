import { usePedestrianGPGPU } from './usePedestrianGPGPU';
import { WalkingBoundries } from './WalkingBoundries';
import { WalkingBuildings } from './WalkingBuildings';
import { WalkingCars } from './WalkingCars';
import { WalkingGround } from './WalkingGround';
import { WalkingLights } from './WalkingLights';
import { WalkingPark } from './WalkingPark';
import { OrbitControls } from '@react-three/drei';
import { 
  Canvas, 
  useFrame
} from '@react-three/fiber';
import { 
  useCallback,
  useEffect, 
  useRef, 
  useMemo
} from 'react';
import { 
  BoxGeometry,
  Color,
  CanvasTexture,
  InstancedMesh,
  MeshBasicMaterial,
  NoToneMapping,
  Object3D,
  PlaneGeometry,
  ShaderMaterial,
  Vector3
} from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

const planeSize = 100;
const planeUnitResolution = 10;
const trackingPlaneTextureResolution = planeSize * planeUnitResolution;
const rotatedPlaneGeometry = new PlaneGeometry(planeSize, planeSize, 1, 1);
rotatedPlaneGeometry.rotateX(Math.PI / 2);

const matrixPositionObject =  new Object3D;
const instanceScale = .75;

const personTorso = new BoxGeometry(1, .75, .5, 1, 1, 1);
const personHead = new BoxGeometry(.5, .5, .5, 1, 1, 1);
personHead.translate(0, .5, 0);
const personLegA = new BoxGeometry(.25, .75, .5, 1, 1, 1);
personLegA.translate(-.37, -.75, 0);
const personLegB = new BoxGeometry(.25, .75, .5, 1, 1, 1);
personLegB.translate(.37, -.75, 0);
const personArmA = new BoxGeometry(.25, .75, .5, 1, 1, 1);
personArmA.translate(-.475, -.225, 0);
personArmA.rotateZ(-.4);
const personArmB = new BoxGeometry(.25, .75, .5, 1, 1, 1);
personArmB.translate(.475, -.225, 0);
personArmB.rotateZ(.4);
const peopleGeometry = mergeGeometries([
  personTorso, 
  personHead, 
  personLegA, 
  personLegB, 
  personArmA, 
  personArmB
]);
peopleGeometry.translate(0, .725, 0);

const colorsRaw = [
  "25ced1","ffffff","fceade","ff8a5b","ea526f",
  "050517","cf5c36","efc88b","f4e3b2","d3d5d7",
  "a18276","b9d2b1","dac6b5","f1d6b8","fbacbe",
  "264653","2a9d8f","e9c46a","f4a261","e76f51",
  //pants also
  "413620","9c6615","9f7833","ffd791","cdd1de"
];

const colorsBottomRaw = [
  "413620",
  "9c6615",
  "9f7833",
  "000000",
  "cdd1de",
  "ffffff",
  "413620",
  "9c6615",
  "9f7833",
  "000000"
]

const colors = colorsRaw.map(c => new Color(`#${c}`));
const colorsBottom = colorsBottomRaw.map(c => new Color(`#${c}`));

// const colors = [
//   new Color(125, 206, 160)
// ]

const WalkingPeople = ({ 
  width = 100, 
  checkVector3s = false,
  renderDebugPlane = false,
  consoleLogDebugBuffer = false      
}) => {
  const instancedMeshRef = useRef<InstancedMesh>();
  const numPeople = width * width;
  const { gpgpuRenderer, data } = usePedestrianGPGPU(numPeople);
  // const directionCheckMaterialRef = useRef<MeshBasicMaterial>();
  // const destinationCheckMaterialRef = useRef<MeshBasicMaterial>();
  // const positionCheckMaterialRef = useRef<MeshBasicMaterial>();
  const trackingCheckMaterialRef = useRef<MeshBasicMaterial>();
  const goundMaterialRef = useRef<MeshBasicMaterial>();
  // const lightsTime = useLightsTime();
//  console.log(planeSize, gpgpuRenderer, data)

  const canvas = useMemo(() => {
    if(renderDebugPlane === true) {
      const offscreenCanvas = new OffscreenCanvas(trackingPlaneTextureResolution, trackingPlaneTextureResolution);
      const ctx = offscreenCanvas.getContext('2d');
  
      if(ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, trackingPlaneTextureResolution, trackingPlaneTextureResolution);  
      }
  
      const texture = new CanvasTexture(offscreenCanvas);
      texture.needsUpdate = true;
  
      return {
        texture, 
        ctx
      };  
    } else {
      return {}
    }
  }, []);

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

  // const testUVShaderMaterial = useMemo(() => new ShaderMaterial({
  //   vertexShader: `
  //   varying vec2 vUv;

  //   void main() {
  //     vUv = uv;
  //     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  //   }
  // `,
  // fragmentShader: `
  //   varying vec2 vUv;

  //   void main() {
  //     gl_FragColor = vec4(vUv.x, vUv.y, 0.0, 1.0);
  //   }
  // `
  // }), [])

  const shaderMaterial = useMemo(() => new ShaderMaterial({
    uniforms: {
      gPositionMap: { value: data.position.texture},
      gDirectionMap: { value: data.direction.texture},
      gDestinationMap: { value: data.destination.texture },
      time: { value: 0 },
      uColors: { value: colors },
      uColorsBottom: { value: colorsBottom } 
    },
    vertexShader: `
      uniform sampler2D gDirectionMap;
      uniform sampler2D gPositionMap;
      uniform sampler2D gDestinationMap;
      uniform float time;

      varying vec4 vPosition;
      varying vec3 vOriginalPosition;
      varying vec4 vgPosition;
      varying vec4 vgDestination;
      varying vec4 vgDirection;
      varying float instanceId;
      varying vec2 vUv;

      void main() {
        vOriginalPosition = position;
        int index = gl_InstanceID;
        instanceId = float(index);
        float floatIndex = float(index);
        float xCoor = mod(floatIndex, ${width}.0);
        float yCoor = mod(floatIndex / ${width}.0, ${width}.0);
        vec2 uv = vec2(xCoor / ${width}.0, yCoor / ${width}.0);
        vUv = uv;
        vec4 gDirectionData = texture2D(gDirectionMap, uv);        
        vec4 gPositionData = texture2D(gPositionMap, uv);
        vec4 gDestinationData = texture2D(gDestinationMap, uv);
        vgDirection = gDirectionData;
        vgPosition = gPositionData;
        vgDestination = gDestinationData;
        vec4 mvPosition = vec4( position, 1.0 );

        #ifdef USE_INSTANCING
            mvPosition = instanceMatrix * mvPosition;
            vPosition = mvPosition;
        #endif

        float angle = atan(gDirectionData.x, gDirectionData.z);
        mat4 rotationMatrix = mat4(
            cos(angle), 0.0, -sin(angle), 0.0,
            0.0, 1.0, 0.0, 0.0,
            sin(angle), 0.0, cos(angle), 0.0,
            0.0, 0.0, 0.0, 1.0
        );

        vPosition = rotationMatrix * vPosition;
        vPosition.x = vPosition.x + gPositionData.x;
        vPosition.y = vPosition.y + gPositionData.y;
        vPosition.z = vPosition.z + gPositionData.z;

        gl_Position = projectionMatrix * modelViewMatrix * vPosition;
      }
    `,
    fragmentShader: `
      precision highp float;
      uniform vec3 uColors[${colors.length}];
      uniform vec3 uColorsBottom[${colorsBottom.length}];

      varying vec4 vgPosition;
      varying vec3 vOriginalPosition;
      varying vec4 vgDestination;
      varying vec4 vgDirection;
      varying float instanceId;
      varying vec2 vUv;

      void main() {
        float colorsLength = ${colors.length}.0;
        float colorsBottomLength = ${colorsBottom.length}.0;
        vec4 positionColor = vgPosition;
        vec4 destinationColor = vgDestination;
        vec4 finalColor = positionColor;
        vec3 positionCalc = vec3(vgPosition.xyz);
        vec3 destinationCalc = vec3(vgDestination.xyz);
        vec3 directionCalc = vec3(vgDirection.xyz);
        float instanceIdColor = (instanceId / ${width * width}.0) + .1;

        vec3 personHue = vec3(250.0, 215.0, 195.0) / 256.0;
        personHue = personHue * instanceIdColor;
        finalColor = vec4(personHue, 1.0);

        float modColor = mod((instanceId + instanceId) / (vUv.x * 10.0), colorsLength);
        // float modColor = mod(instanceId, colorsLength);
        int modColorInt = int(modColor);
        if(vOriginalPosition.y > 0.5 && vOriginalPosition.y < 1.125) {
          finalColor = vec4(uColors[modColorInt], 1.0);
        }

        float modColorBottom = mod((instanceId + instanceId) / (vUv.x * 10.0), colorsBottomLength);
        int modColorBottomInt = int(modColorBottom);

        if(vOriginalPosition.y < 0.5 && vOriginalPosition.x < .5 && vOriginalPosition.x > -.5) {
          finalColor = vec4(uColorsBottom[modColorBottomInt], 1.0);
        }

        // hair
        float modColorHair = mod((instanceId) + instanceId / ((vUv.y + vUv.x) * 10.0), colorsBottomLength);
        int modColorHairInt = int(modColorHair);

        if(vOriginalPosition.y > 1.4) {
          finalColor = vec4(uColorsBottom[modColorHairInt], 1.0);
        }

        if(vOriginalPosition.y > 1.3 - vUv.y * .25 && vOriginalPosition.z < 0.0) {
          finalColor = vec4(uColorsBottom[modColorHairInt], 1.0);
        }

        if(
          vOriginalPosition.x > .1 && vOriginalPosition.x < .2 && 
          vOriginalPosition.y > 1.25 && vOriginalPosition.y < 1.3 && 
          vOriginalPosition.z > 0.23
        ) {
          finalColor = mix(vec4(personHue, 1.0), vec4(1.0, 1.0, 1.0, 1.0), .5);
        }

        if(
          vOriginalPosition.x < -.1 && vOriginalPosition.x > -.2 && 
          vOriginalPosition.y > 1.25 && vOriginalPosition.y < 1.3 && 
          vOriginalPosition.z > 0.23
        ) {
          finalColor = mix(vec4(personHue, 1.0), vec4(1.0, 1.0, 1.0, 1.0), .5);
        }

        float saturation = 2.25;
        float avg = (finalColor.r + finalColor.g + finalColor.b) / 3.0;
        vec3 gray = vec3(avg, avg, avg);
        gl_FragColor = vec4(mix(gray, finalColor.rgb, saturation), finalColor.a);

      //  gl_FragColor = finalColor;
      }
    `,
    // side: DoubleSide
    // depthWrite: false
  }), [
    width, 
    data.position.texture,
    data.direction.texture,
    data.destination.texture
  ]);

  const buffer = useMemo(() => {
    return new Float32Array(width * width * 4);
  }, [width])

  const renderTrackingPlane = useCallback((gl) => {
    gl.readRenderTargetPixels(
      gpgpuRenderer.getCurrentRenderTarget(data.position.variables.positionVariable),
      0, 0, width, width,
      buffer
    );

    if(canvas.ctx && trackingCheckMaterialRef.current && goundMaterialRef.current) {

      const fillStyleArray = [
        'red',
        'green',
        'blue'
      ]
      const oneThirdBufferArray = buffer.length / 3;
      for (let i = 0; i < buffer.length; i += 4) {

        canvas.ctx.fillStyle = fillStyleArray[Math.floor(i / oneThirdBufferArray)];
        canvas.ctx.fillRect(500 + buffer[i] * 10, 500 + buffer[i + 2] * -10, 2, 2);
      }
      canvas.texture.needsUpdate = true;
      trackingCheckMaterialRef.current.needsUpdate = true;
      goundMaterialRef.current.needsUpdate = true;
    }

  }, [buffer, canvas.ctx, canvas.texture, data.position.variables.positionVariable, gpgpuRenderer, width])

  const collisionVector3 = useMemo(() => {
    const vec3Array: Vector3[] = [];
    for(let v3 = 0; v3 < width * width; v3++) {
      vec3Array.push(new Vector3())
    }
    return vec3Array;    
  }, [width])

  const debugBufferPosition = useMemo(() => {
    return new Float32Array(width * width * 4);
  }, [width])
  const debugBufferDirection = useMemo(() => {
    return new Float32Array(width * width * 4);
  }, [width])
  const debugBufferDestination = useMemo(() => {
    return new Float32Array(width * width * 4);
  }, [width])

  const logDebugBuffer = useCallback((gl) => {

    gl.readRenderTargetPixels(
      gpgpuRenderer.getCurrentRenderTarget(data.position.variables.positionVariable),
      0, 0, width, width,
      debugBufferPosition
    );

    gl.readRenderTargetPixels(
      gpgpuRenderer.getCurrentRenderTarget(data.direction.variables.directionVariable),
      0, 0, width, width,
      debugBufferDirection
    );

    gl.readRenderTargetPixels(
      gpgpuRenderer.getCurrentRenderTarget(data.destination.variables.destinationVariable),
      0, 0, width, width,
      debugBufferDestination
    );

    for(let l = 0; l < width * width * 4; l += 4) {
      if(checkVector3s === true) {
        collisionVector3[l / 4].set(
          debugBufferPosition[l],
          debugBufferPosition[l + 1],
          debugBufferPosition[l + 2]
        );      
      }
      console.log(`bufferIndex: ${l / 4}`)
      // console.log(`Pos: ${debugBufferPosition[l]}, ${debugBufferPosition[l + 1]}, ${debugBufferPosition[l + 2]}, ${debugBufferPosition[l + 3]}`);
      // console.log(`Dir: ${debugBufferDirection[l]}, ${debugBufferDirection[l + 1]}, ${debugBufferDirection[l + 2]}, ${debugBufferDirection[l + 3]}`);
      console.log(`Des: ${debugBufferDestination[l]}, ${debugBufferDestination[l + 1]}, ${debugBufferDestination[l + 2]}, ${debugBufferDestination[l + 3]}`);
    }

    if(checkVector3s === true) {
      for(let checkVi = 0; checkVi < width; checkVi++) {
        const vectorA = collisionVector3[checkVi];
        for(let checkVj = 0; checkVj < width; checkVj++) {
          const vectorB = collisionVector3[checkVj];
          if(vectorA.distanceTo(vectorB) > .0001 && vectorA.distanceTo(vectorB) < 3.0) {
            console.log('collision');
          }
        }
      }  
    }

  }, [
    debugBufferPosition, 
    debugBufferDirection,
    debugBufferDestination,
    data.position.variables.positionVariable, 
    data.direction.variables.directionVariable, 
    data.destination.variables.destinationVariable, 
    gpgpuRenderer, 
    width,
    collisionVector3,
    checkVector3s
  ])

  useFrame(({
    clock,
    gl
  }) => {
    if(renderDebugPlane) {
      renderTrackingPlane(gl);
    }

    if(consoleLogDebugBuffer && clock.elapsedTime < 200) {
      console.log(clock.elapsedTime)
      logDebugBuffer(gl);
    }

    // computer renderer
    gpgpuRenderer.compute();

    shaderMaterial.uniforms.time.value = clock.elapsedTime;

    // positions
    shaderMaterial.uniforms.gPositionMap.value = gpgpuRenderer
      .getCurrentRenderTarget(data.position.variables.positionVariable).texture;
    data.position.variables.positionVariable.material.uniforms.uTime.value = clock.elapsedTime;
    data.position.variables.positionVariable.material.uniforms.uDeltaTime.value = clock.getDelta();

    // direction
    shaderMaterial.uniforms.gDirectionMap.value = gpgpuRenderer
      .getCurrentRenderTarget(data.direction.variables.directionVariable).texture;
    data.direction.variables.directionVariable.material.uniforms.uTime.value = clock.elapsedTime; // seconds as float -- not miliseconds
    data.direction.variables.directionVariable.material.uniforms.uDeltaTime.value = clock.getDelta();
    // console.log(clock.elapsedTime)
    // data.direction.variables.directionVariable.material.uniforms.uActiveLightNumber.value = lightsTime.activeLightNumber;
    // data.direction.variables.directionVariable.material.uniforms.uActiveLightTimeLeft.value = lightsTime.activeLightTimeLeft;

    // destination
    shaderMaterial.uniforms.gDestinationMap.value = gpgpuRenderer
      .getCurrentRenderTarget(data.destination.variables.destinationVariable).texture;
    data.destination.variables.destinationVariable.material.uniforms.uTime.value = clock.elapsedTime;
    data.destination.variables.destinationVariable.material.uniforms.uDeltaTime.value = clock.getDelta();

    // // check materials
    // if (positionCheckMaterialRef.current) {
    //   positionCheckMaterialRef.current.map = gpgpuRenderer
    //     .getCurrentRenderTarget(data.position.variables.positionVariable).texture;
    //   positionCheckMaterialRef.current.needsUpdate = true;
    // }

    // if (directionCheckMaterialRef.current) {
    //   directionCheckMaterialRef.current.map = gpgpuRenderer
    //     .getCurrentRenderTarget(data.direction.variables.directionVariable).texture;
    //   directionCheckMaterialRef.current.needsUpdate = true;
    // }

    // if (destinationCheckMaterialRef.current) {
    //   destinationCheckMaterialRef.current.map = gpgpuRenderer
    //     .getCurrentRenderTarget(data.destination.variables.destinationVariable).texture;
    //   destinationCheckMaterialRef.current.needsUpdate = true;
    // }

  });

  return (
    <>      
      {/* <gridHelper 
        args={[300, 300, 0xaaaaaa, 0xaaaaaa]} 
        position={[0, 0.01, 0]}
      /> */}
      
      <instancedMesh 
        ref={instancedMeshRef} 
        args={[null as any, null as any, numPeople]} 
        material={shaderMaterial}
      >
        <primitive object={peopleGeometry} />
      </instancedMesh>

      <WalkingBuildings />
      <WalkingCars />
      <WalkingGround />
      <WalkingLights />
      <WalkingBoundries />
      <WalkingPark />

      {/* <primitive object={testUVShaderMaterial} /> */}


      {/* 
      
      <mesh 
        position={[0.0, 0.0, 0.0]}
      >
        <primitive object={rotatedPlaneGeometry} />
        <meshBasicMaterial 
          color={0xffffff} 
          side={DoubleSide} 
          map={canvas.texture} 
          ref={goundMaterialRef}
        />
      </mesh>
      
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
          ref={directionCheckMaterialRef}
          map={data.direction.texture} 
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
      </mesh> */}
    </>
  );
};

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
        position: [0, 50, 75],
        far: 500
      }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <WalkingPeople 
        width={75} 
        renderDebugPlane={false}
        consoleLogDebugBuffer={false}
        checkVector3s={false}
      />
      <OrbitControls 
        maxDistance={120}
        maxPolarAngle={Math.PI * .49}
      />
    </Canvas>
  );
}

export { WalkingShaderCanvas };
