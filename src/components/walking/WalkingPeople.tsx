import { isMobileDevice } from '../../assets/js/util';
import { peopleGeometry } from './personModel';
import { usePedestrianGPGPU } from './usePedestrianGPGPU';
import { useFrame } from '@react-three/fiber';
import { 
  useEffect, 
  useRef, 
  useMemo
} from 'react';
import { 
  Color,
  InstancedMesh,
  Object3D,
  ShaderMaterial
} from 'three';

const matrixPositionObject =  new Object3D;
const instanceScale = .75;

const colorsRaw = [
  "25ced1","ffffff","fceade","ff8a5b","ea526f",
  "050517","cf5c36","efc88b","f4e3b2","d3d5d7",
  "a18276","b9d2b1","dac6b5","f1d6b8","fbacbe",
  "264653","2a9d8f","e9c46a","f4a261","e76f51",
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

const WalkingPeople = ({ 
  width = 100
}) => {
  const instancedMeshRef = useRef<InstancedMesh>();
  const numPeople = width * width;
  const { gpgpuRenderer, data } = usePedestrianGPGPU(numPeople);

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

  }, [numPeople])

  const shaderMaterial = useMemo(() => new ShaderMaterial({
    uniforms: {
      uIsMobileDevice: { value: isMobileDevice() },
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

      uniform bool uIsMobileDevice;
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

        if(uIsMobileDevice == true) {
          // vec4 personHue = vec4(250.0, 215.0, 195.0, 256.0) / 256.0;
          // personHue = personHue * instanceIdColor;

          // float modColor = instanceIdColor * colorsLength;
          // int modColorInt = int(modColor);
          // finalColor = mix(vec4(uColors[modColorInt], 1.0), personHue, .25);

          finalColor = vec4(instanceIdColor, instanceIdColor, instanceIdColor, 1.0);
        }

        if(uIsMobileDevice == false) {

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
        
        }

        float saturation = 2.25;
        float avg = (finalColor.r + finalColor.g + finalColor.b) / 3.0;
        vec3 gray = vec3(avg, avg, avg);
        gl_FragColor = vec4(mix(gray, finalColor.rgb, saturation), finalColor.a);

      //  gl_FragColor = finalColor;
      }
    `
  }), [
    width, 
    data.position.texture,
    data.direction.texture,
    data.destination.texture
  ]);

  useFrame(({
    clock
  }) => {
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

    // destination
    shaderMaterial.uniforms.gDestinationMap.value = gpgpuRenderer
      .getCurrentRenderTarget(data.destination.variables.destinationVariable).texture;
    data.destination.variables.destinationVariable.material.uniforms.uTime.value = clock.elapsedTime;
    data.destination.variables.destinationVariable.material.uniforms.uDeltaTime.value = clock.getDelta();
  });

  return (
    <>            
      <instancedMesh 
        ref={instancedMeshRef} 
        args={[null as any, null as any, numPeople]} 
        material={shaderMaterial}
      >
        <primitive object={peopleGeometry} />
      </instancedMesh>
    </>
  );
};

export { WalkingPeople };