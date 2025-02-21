import { 
    useRef,
    useEffect
} from 'react'
import { MeshReflectorMaterial } from '@react-three/drei';
import { 
    TextureLoader,
    Mesh,
    ShaderMaterial,
    Vector3,
    Euler,
    DoubleSide
} from 'three'; 
import { 
    useLoader, 
    useFrame,
} from "@react-three/fiber";

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

const RomeGroundRippleShader: React.FC = (): JSX.Element => {
  const materialRef = useRef<ShaderMaterial | null>(null);
  const planeRef = useRef<Mesh | null>(null);

  const numberOfWaves = 80;
  const { mouseClicksArray, clickMagnitudesArray } = createUniformData(80);
  const uniforms = {
    'numberOfWaves': { value: numberOfWaves },
    'time': { value: 1.0 },
    'clickMagnitudes': { value: clickMagnitudesArray },
    'mouseClicks': { value: mouseClicksArray }
  };

  let mouseClicks = 0;
  const shader = {
    vertexShader: `  
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform int numberOfWaves;
        uniform vec3 mouseClicks[80];
        uniform float clickMagnitudes[80];
        uniform float time;
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
            float positionDiff = 0.0;
            for (int i = 0; i < numberOfWaves; i++) {
                if(clickMagnitudes[i] >= 0.0) {
                    float distanceFromMouseClick = distance(vPosition, mouseClicks[i]);
                    if(distanceFromMouseClick < 0.1 * clickMagnitudes[i] && distanceFromMouseClick > 0.08 * clickMagnitudes[i]) {
                        positionDiff = 1.0;
                    }
                }
            }
            // gl_FragColor = vec4(positionDiff, positionDiff, positionDiff, positionDiff /2.0); // Red color
            float distanceFromOrigin = distance(vUv, vec2(0.5, 0.5)) * 2.0;
            if(distanceFromOrigin < .75) {
                distanceFromOrigin = 0.0;
            }
            if(distanceFromOrigin > .75) {
                distanceFromOrigin = (distanceFromOrigin - .75) * 4.0;
            }
            vec4 positionDiffVector4 = vec4(positionDiff, positionDiff, positionDiff, positionDiff /2.0);
            vec4 colorBlackVector4 = vec4(0.0, 0.0, 0.0, 1.0);
            gl_FragColor = mix(positionDiffVector4, colorBlackVector4, distanceFromOrigin); // Red color
        }
    `,
  };
  const randomRippleInterval = 10;
  useEffect(() => {
    const interval = setInterval(() => {
      uniforms.mouseClicks.value[mouseClicks % numberOfWaves].set((Math.random() * 5) -2.5, (Math.random() * 5) -2.5, 0);
      uniforms.clickMagnitudes.value[mouseClicks % numberOfWaves] = 0.001;
      mouseClicks++;
    }, randomRippleInterval);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const planeRotation = new Euler(-Math.PI * .5, 0, 0);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
      for (let clickMagnitudeIndex = 0; clickMagnitudeIndex < materialRef.current.uniforms.clickMagnitudes.value.length; clickMagnitudeIndex++) {
        if (materialRef.current.uniforms.clickMagnitudes.value[clickMagnitudeIndex] > 0.0) {
          materialRef.current.uniforms.clickMagnitudes.value[clickMagnitudeIndex] += .1;
        }
        if (materialRef.current.uniforms.clickMagnitudes.value[clickMagnitudeIndex] > .5) {
          materialRef.current.uniforms.clickMagnitudes.value[clickMagnitudeIndex] = -1.0;
        }
      }
    }
  });

  return (
    <>
      <mesh
        ref={planeRef}
        position={[0, .01, 0]}
        rotation={planeRotation}
      >
        <planeGeometry
          args={[5.5, 5.5, 1, 1]}
        />
        <shaderMaterial
          ref={materialRef}
          attach="material"
          uniforms={uniforms}
          fragmentShader={shader.fragmentShader}
          vertexShader={shader.vertexShader}
          transparent={true}
          alphaTest={.5}
          side={DoubleSide}
        />
      </mesh>
    </>
  )
};


const RomeGround: React.FC = (): JSX.Element => {
    const groundTexture = useLoader(TextureLoader, '/rome/ground-inverse-compressed.jpg')

    return (
        <>
            <RomeGroundRippleShader />
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
        </>
    )
};

export { RomeGround };