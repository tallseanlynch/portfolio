// "Grimlock - Dinobot (G1)  .::RAWscan::." (https://skfb.ly/6QWAG) by Andrea Spognetta (Spogna) is licensed under Creative Commons Attribution-NonCommercial (http://creativecommons.org/licenses/by-nc/4.0/).
// "River *Buuurrpp !* Environment (updated)" (https://skfb.ly/6BwtK) by Johndoh is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
import { 
  MathUtils, 
  ShaderMaterial, 
  DataTexture, 
  RGBAFormat, 
  FloatType 
} from "three";

const simulationVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = modelMatrix * viewMatrix * projectionMatrix * vec4(position, 1.0);
  }
`;

const simulationFragmentShader = `
  uniform sampler2D positionsA;
  uniform sampler2D positionsB;
  uniform float uTime;
  uniform float uFrequency;

  varying vec2 vUv;

  void main() {
    float time = abs(sin(uTime * 0.35));

    vec3 spherePositions = texture2D(positionsA, vUv).rgb;
    vec3 boxPositions = texture2D(positionsB, vUv).rgb;

    vec3 pos = mix(boxPositions, spherePositions, time);

    gl_FragColor = vec4(pos, 1.0);
  }
`;

const getRandomDataSphere = (width, height) => {
  // we need to create a vec4 since we're passing the positions to the fragment shader
  // data textures need to have 4 components, R, G, B, and A
  const length = width * height * 4;
  const data = new Float32Array(length);
    
  for (let i = 0; i < length; i++) {
    const stride = i * 4;

    const distance = Math.sqrt((Math.random())) * 2.0;
    const theta = MathUtils.randFloatSpread(360); 
    const phi = MathUtils.randFloatSpread(360); 

    data[stride] =  distance * Math.sin(theta) * Math.cos(phi)
    data[stride + 1] =  distance * Math.sin(theta) * Math.sin(phi);
    data[stride + 2] =  distance * Math.cos(theta);
    data[stride + 3] =  1.0; // this value will not have any impact
  };
  
  return data;
};

const getRandomDataBox = (width, height) => {
  const len = width * height * 4;
  const data = new Float32Array(len);

  for (let i = 0; i < data.length; i++) {
    const stride = i * 4;

    data[stride] = (Math.random() - 0.5) * 2.0;
    data[stride + 1] = (Math.random() - 0.5) * 2.0;
    data[stride + 2] = (Math.random() - 0.5) * 2.0;
    data[stride + 3] = 1.0;
  }
  return data;
};

class SimulationMaterial extends ShaderMaterial {
  constructor(size) {
    const positionsTextureA = new DataTexture(
      getRandomDataSphere(size, size),
      size,
      size,
      RGBAFormat,
      FloatType
    );
    positionsTextureA.needsUpdate = true;

    const positionsTextureB = new DataTexture(
      getRandomDataBox(size, size),
      size,
      size,
      RGBAFormat,
      FloatType
    );
    positionsTextureB.needsUpdate = true;

    const simulationUniforms = {
      positionsA: { value: positionsTextureA },
      positionsB: { value: positionsTextureB },
      uFrequency: { value: 0.25 },
      uTime: { value: 0 },
    };

    super({
      uniforms: simulationUniforms,
      vertexShader: simulationVertexShader,
      fragmentShader: simulationFragmentShader,
    });
  }
};

export default SimulationMaterial;
