import {
  TextureLoader,
  Vector2,
  Vector3,
  ShaderMaterial,
  DoubleSide,
  Color,
  Euler,
  Mesh
} from 'three';
import {
  Canvas,
  useLoader,
  useFrame,
  ThreeEvent
} from '@react-three/fiber';
import {
  useEffect,
  useRef
} from 'react';
import { OrbitControls } from '@react-three/drei';

const createUniformData = (numberOfWaves: number) => {
  const mouseClicksArray: Vector3[] = [];
  const clickMagnitudesArray: number[] = [];
  for (let i = 0; i < numberOfWaves; i++) {
    mouseClicksArray.push(new Vector3(-100, -100, -100));
    clickMagnitudesArray.push(0.0);
  }
  return {
    mouseClicksArray,
    clickMagnitudesArray
  }
};

interface WaterShaderProps {
  render: boolean
};

const WaterShader: React.FC<WaterShaderProps> = ({
  render = true
}): JSX.Element => {
  const materialRef = useRef<ShaderMaterial | null>(null);
  const planeRef = useRef<Mesh | null>(null);
  const raycastPlaneRef = useRef<Mesh | null>(null);

  const [pattern1, pattern2] = useLoader(TextureLoader, [
    '/water/pattern-1-optimized.jpg',
    '/water/pattern-2-optimized.jpg'
  ]);

  const numberOfWaves = 80;
  const { mouseClicksArray, clickMagnitudesArray } = createUniformData(80);
  const eventDebounceTime = 200;
  const uniforms = {
    'numberOfWaves': { value: numberOfWaves },
    'texture1Resolution': { value: new Vector2(2034, 2106) },
    'texture2Resolution': { value: new Vector2(2034, 2106) },
    'time': { value: 1.0 },
    'texture1': { value: pattern1 },
    'texture2': { value: pattern2 },
    'clickMagnitudes': { value: clickMagnitudesArray },
    'mouseClicks': { value: mouseClicksArray }
  };

  let mouseClicks = 0;
  let lastMouseClick = new Date().getTime();
  const randomRippleInterval = 125;
  const shader = {
    vertexShader: `
      uniform int numberOfWaves;
      uniform vec3 mouseClicks[80];
      uniform float clickMagnitudes[80];
      uniform float time;
      varying vec2 vUv;
      varying float positionDiff;
  
      void main() {
        vUv = uv;
        vec3 clickPositionModifier = vec3(0.0, 0.0, 0.0);
        positionDiff = 0.0;

        for (int i = 0; i < numberOfWaves; i++) {
          if(clickMagnitudes[i] >= 0.0) {
            float distanceFromMouseClick = distance(position, mouseClicks[i]);

            float waveWidth = 1.0;  // Width of a single wave crest
            float damping = 2.5;  // Damping factor to smooth out the ripples

            float normalizedDistance = (distanceFromMouseClick - clickMagnitudes[i]) / waveWidth;

            if(abs(normalizedDistance) <= waveWidth) {
              float waveAmplitude = (10.0 - clickMagnitudes[i]) * 0.125;
              float decay = exp(-damping * abs(normalizedDistance));
              clickPositionModifier.z += sin(3.141592 * normalizedDistance) * waveAmplitude * decay;
              positionDiff += clickPositionModifier.z;
            }
          }
        }
        vec3 finalPos = vec3(0.0, 0.0, 0.0);
        finalPos.x = sin(position.y * 0.5 + time) * .25;
        finalPos.y = sin(position.z * 0.5 + time) * .15;
        finalPos.z = sin(position.x * 0.5 + time) * .25;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position + finalPos + clickPositionModifier, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform sampler2D texture1;
      uniform sampler2D texture2;
      varying vec2 vUv;
      varying float positionDiff;
      void main() {
        float angleRadians = radians((positionDiff * .0125) * 360.0);
        vec2 uv = vUv - vec2(0.5, 0.5);
        mat2 rotation = mat2(
          cos(angleRadians), -sin(angleRadians),
          sin(angleRadians), cos(angleRadians)
        );
        uv = rotation * uv + vec2(0.5, 0.5);
        vec4 color1 = texture2D(texture1, uv);
        vec4 color2 = texture2D(texture2, uv);
        vec4 mixColor = mix(color2, color1, abs(sin(time/6.0)));
        
        float distanceColor = (distance(vUv, vec2( 0.5, 0.5)) * 2.0);
        if(distanceColor > .5) {
          mixColor = vec4( mixColor.rgb, ( (1.0 - distanceColor) - ((distanceColor - .95) * 10.0) ));
        }

        float saturation = 2.25;
        float avg = (mixColor.r + mixColor.g + mixColor.b) / 3.0;
        vec3 gray = vec3(avg, avg, avg);
        gl_FragColor = vec4(mix(gray, mixColor.rgb, saturation), mixColor.a);
      }
    `
  };

  useEffect(() => {
    const interval = setInterval(() => {
      uniforms.mouseClicks.value[mouseClicks % numberOfWaves].set((Math.random() * 60) - 30, (Math.random() * 60) - 30, 0);
      uniforms.clickMagnitudes.value[mouseClicks % numberOfWaves] = 0.1;
      mouseClicks++;
    }, randomRippleInterval);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const planeRotation = new Euler(0, 0, 0);

  useFrame(({ clock }) => {
    if (render === false) { return }
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
      for (let clickMagnitudeIndex = 0; clickMagnitudeIndex < materialRef.current.uniforms.clickMagnitudes.value.length; clickMagnitudeIndex++) {
        if (materialRef.current.uniforms.clickMagnitudes.value[clickMagnitudeIndex] > 0.0) {
          materialRef.current.uniforms.clickMagnitudes.value[clickMagnitudeIndex] += .05;
        }
        if (materialRef.current.uniforms.clickMagnitudes.value[clickMagnitudeIndex] > 10.0) {
          materialRef.current.uniforms.clickMagnitudes.value[clickMagnitudeIndex] = -10.0;
        }
      }
    }
    if (planeRef.current && raycastPlaneRef.current) {
      planeRef.current.rotation.z += .001;
      raycastPlaneRef.current.rotation.z += .001;
    }
  });

  const createRipple = (event: ThreeEvent<MouseEvent>) => {
    if (event.intersections.length > 0) {
      const intersect = event.intersections[0];
      uniforms.mouseClicks.value[mouseClicks % numberOfWaves] = intersect.object.worldToLocal(intersect.point);
      uniforms.clickMagnitudes.value[mouseClicks % numberOfWaves] = 0.1;
      mouseClicks++;
    }
  }

  const handleRaycastPlaneClick = (event: ThreeEvent<MouseEvent>) => {
    if (new Date().getTime() - lastMouseClick < eventDebounceTime) { return; }
    createRipple(event);
    lastMouseClick = new Date().getTime();
  }

  const handleRaycastPlaneMouseMove = (event: ThreeEvent<MouseEvent>) => {
    if (new Date().getTime() - lastMouseClick < eventDebounceTime) { return; }
    if (event.buttons > 0) {
      createRipple(event);
      lastMouseClick = new Date().getTime();
    }
  }

  return (
    <>
      <mesh
        ref={planeRef}
        position={[0, 0, 0]}
        rotation={planeRotation}
      >
        <planeGeometry
          args={[60, 60, 500, 500]}
        />
        <shaderMaterial
          ref={materialRef}
          attach="material"
          uniforms={uniforms}
          fragmentShader={shader.fragmentShader}
          vertexShader={shader.vertexShader}
          side={DoubleSide}
          transparent={true}
          alphaTest={.5}
        />
      </mesh>
      <mesh
        ref={raycastPlaneRef}
        rotation={planeRotation}
        visible={false}
        onPointerDown={
          (event: ThreeEvent<MouseEvent>) => {
            handleRaycastPlaneClick(event);
          }
        }
        onPointerMove={
          (event: ThreeEvent<MouseEvent>) => {
            handleRaycastPlaneMouseMove(event);
          }
        }
        position={[0, 0, 0]}
      >
        <planeGeometry
          args={[60, 60, 1, 1]}
        />
        <meshStandardMaterial
          color={new Color(0xff0000)}
          transparent={true}
          opacity={.5}
        />
      </mesh>
    </>
  )
};

interface WaterShaderCanvasProps {
  classNames?: string
};

const WaterShaderCanvas: React.FC<WaterShaderCanvasProps> = ({
  classNames = ''
}) => {
  return (
    <Canvas
      camera={{ position: new Vector3(0, 0, 15) }}
      className={classNames}
    >
      <WaterShader render={classNames === '' ? true : false} />
      <OrbitControls
        enableDamping={true}
        dampingFactor={0.05}
        screenSpacePanning={false}
        zoomSpeed={.1}
        panSpeed={.1}
        rotateSpeed={.1}
      />
    </Canvas>
  )
};

export { WaterShader, WaterShaderCanvas };