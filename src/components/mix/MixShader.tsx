import SimulationMaterial from './SimulationMaterial';
import { 
  OrbitControls, 
  useFBO 
} from "@react-three/drei";
import { 
  Canvas, 
  createPortal, 
  extend, 
  ThreeElement,
  useFrame
} from "@react-three/fiber";
import { 
  useMemo, 
  useRef 
} from "react";
import { 
  AdditiveBlending,
  Color,
  FloatType, 
  NearestFilter, 
  OrthographicCamera, 
  Points,
  RGBAFormat, 
  Scene, 
  ShaderMaterial
} from 'three';

extend({ SimulationMaterial: SimulationMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    simulationMaterial: ThreeElement<typeof SimulationMaterial>
  }
}

const vertexShader = `
  uniform sampler2D uPositions;
  uniform float uTime;

  void main() {
    vec3 pos = texture2D(uPositions, position.xy).xyz;
    vec4 projectedPosition = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);
    gl_Position = projectedPosition;

    gl_PointSize = 3.0;
    // Size attenuation;
    gl_PointSize *= step(1.0 - (1.0/64.0), position.x) + 0.5;
  }
`;

const fragmentShader = `
  void main() {
    vec3 color = vec3(0.34, 0.53, 0.96);
    gl_FragColor = vec4(color, 1.0);
  }
`;

const FBOParticles = () => {
  const size = 128;

  const points = useRef<Points>();
  const simulationMaterialRef = useRef<SimulationMaterial>();

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1);
  const positions = new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0]);
  const uvs = new Float32Array([
    0, 0,  // bottom-left
    1, 0,  // bottom-right
    1, 1,  // top-right
    0, 0,  // bottom-left
    1, 1,  // top-right
    0, 1   // top-left
  ]);

  const renderTarget = useFBO(size, size, {
    minFilter: NearestFilter,
    magFilter: NearestFilter,
    format: RGBAFormat,
    stencilBuffer: false,
    type: FloatType,
  });

  // Generate our positions attributes array
  const particlesPosition = useMemo(() => {
    const length = size * size;
    const particles = new Float32Array(length * 3);
    for (let i = 0; i < length; i++) {
      const i3 = i * 3;
      particles[i3 + 0] = (i % size) / size;
      particles[i3 + 1] = i / size / size;
    }
    return particles;
  }, [size]);

  const uniforms = useMemo(() => ({
    uPositions: {
      value: null,
    }
  }), [])

  useFrame((state) => {
    const { gl, clock } = state;

    gl.setRenderTarget(renderTarget);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    if (points.current && simulationMaterialRef.current) {
      (points.current.material as ShaderMaterial).uniforms.uPositions.value = renderTarget.texture;
      simulationMaterialRef.current.uniforms.uTime.value = clock.elapsedTime;
    }

  });

  return (
    <>
      {createPortal(
        <mesh>
          <simulationMaterial ref={simulationMaterialRef} args={[size]} />
          <bufferGeometry>
            <bufferAttribute
              args={[positions, positions.length / 3]}
              attach="attributes-position"
              count={positions.length / 3}
              array={positions}
              itemSize={3}
            />
            <bufferAttribute
              args={[uvs, uvs.length / 2]}
              attach="attributes-uv"
              count={uvs.length / 2}
              array={uvs}
              itemSize={2}
            />
          </bufferGeometry>
        </mesh>,
        scene
      )}
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute
            args={[particlesPosition, particlesPosition.length / 3]}
            attach="attributes-position"
            count={particlesPosition.length / 3}
            array={particlesPosition}
            itemSize={3}
          />
        </bufferGeometry>
        <shaderMaterial
          blending={AdditiveBlending}
          depthWrite={false}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          uniforms={uniforms}
        />
      </points>
    </>
  );
};

const MixShaderCanvas = () => {
  return (
    <Canvas 
      camera={{ position: [1.5, 1.5, 2.5] }}
      scene={{
        background: new Color(0x000000)
      }}
    >
      <ambientLight intensity={0.5} />
      <FBOParticles />
      <OrbitControls />
    </Canvas>
  );
};

export { MixShaderCanvas };
