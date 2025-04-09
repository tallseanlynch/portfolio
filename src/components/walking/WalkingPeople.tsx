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
  const { gpgpuRenderer, data } = usePedestrianGPGPU(width);

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
      precision highp float;

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

        // possible alternative to test
        // float xCoor = float(int(floatIndex) % int(${width}));
        // float yCoor = floor(floatIndex / ${width}.0);

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

        // vPosition = rotationMatrix * vPosition;
        // vPosition.x = (-50.0 + vPosition.x + xCoor * .1) + gPositionData.x * .1;
        // vPosition.y = vPosition.y;
        // vPosition.z = ((-50.0 + vPosition.z + yCoor) + sin(time * yCoor / 10.0) * 5.0) + gPositionData.y * .1;

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
        float numPeopleId = (instanceId / ${width * width}.0);

        vec3 personHue = vec3(250.0, 215.0, 195.0) / 256.0;
        personHue = personHue * instanceIdColor;
        finalColor = vec4(personHue, 1.0);

        float modColor = numPeopleId * colorsLength;
        int modColorInt = int(modColor);

        float step0a = step(0.5, vOriginalPosition.y);
        float step0b = step(vOriginalPosition.y, 1.125);
        float condition0a = step0a * step0b;
        finalColor = mix(finalColor, vec4(uColors[modColorInt], 1.0), condition0a);

        // if(vOriginalPosition.y > 0.5 && vOriginalPosition.y < 1.125) {
        //   finalColor = vec4(uColors[modColorInt], 1.0);
        // }

        float modColorBottom = numPeopleId * colorsBottomLength;
        int modColorBottomInt = int(modColorBottom);

        float step1a = step(vOriginalPosition.y, .5);
        float step1b = step(vOriginalPosition.x, .5);
        float step1c = step(-.5, vOriginalPosition.x);
        float condition1a = step1a * step1b * step1c;
        finalColor = mix(finalColor, vec4(uColorsBottom[modColorBottomInt], 1.0), condition1a);

        // if(vOriginalPosition.y < 0.5 && vOriginalPosition.x < .5 && vOriginalPosition.x > -.5) {
        //   finalColor = vec4(uColorsBottom[modColorBottomInt], 1.0);
        // }

        // hair
        float modColorHair = numPeopleId * .9 * colorsBottomLength;
        int modColorHairInt = int(modColorHair);

        float step2a = step(1.4, vOriginalPosition.y);
        float condition2a = step2a;
        finalColor = mix(finalColor, vec4(uColorsBottom[modColorHairInt], 1.0), condition2a);

        // if(vOriginalPosition.y > 1.4) {
        //   finalColor = vec4(uColorsBottom[modColorHairInt], 1.0);
        // }

        float step3a = step(1.3 - vUv.y * .25, vOriginalPosition.y);
        float step3b = step(vOriginalPosition.z, 0.0);
        float condition3a = step3a * step3b;
        finalColor = mix(finalColor, vec4(uColorsBottom[modColorHairInt], 1.0), condition3a);

        // if(vOriginalPosition.y > 1.3 - vUv.y * .25 && vOriginalPosition.z < 0.0) {
        //   finalColor = vec4(uColorsBottom[modColorHairInt], 1.0);
        // }

        // vec4 eyeColor = mix(vec4(personHue, 1.0), vec4(1.0, 1.0, 1.0, 1.0), .5);

        // float step4a = step(.1, vOriginalPosition.x);
        // float step4b = step(vOriginalPosition.x, .2);
        // float step4c = step(1.25, vOriginalPosition.y);
        // float step4d = step(vOriginalPosition.y, 1.3);
        // float step4e = step(.23, vOriginalPosition.z);
        // float condition4a = step4a * step4b * step4c * step4d * step4e;
        // finalColor = mix(finalColor, eyeColor, condition4a);

        // if(
        //   vOriginalPosition.x > .1 && vOriginalPosition.x < .2 && 
        //   vOriginalPosition.y > 1.25 && vOriginalPosition.y < 1.3 && 
        //   vOriginalPosition.z > 0.23
        // ) {
        //   finalColor = mix(vec4(personHue, 1.0), vec4(1.0, 1.0, 1.0, 1.0), .5);
        // }

        // if(
        //   vOriginalPosition.x < -.1 && vOriginalPosition.x > -.2 && 
        //   vOriginalPosition.y > 1.25 && vOriginalPosition.y < 1.3 && 
        //   vOriginalPosition.z > 0.23
        // ) {
        //   finalColor = mix(vec4(personHue, 1.0), vec4(1.0, 1.0, 1.0, 1.0), .5);
        // }

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

  console.log(shaderMaterial);

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