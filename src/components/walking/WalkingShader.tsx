import { 
  Canvas,
  useFrame
} from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei'
import { 
    useEffect,
    useRef
} from 'react';
import {
    DoubleSide,
    InstancedMesh,
    InstancedBufferAttribute,
    Object3D,
    PlaneGeometry,
    RepeatWrapping,
    ShaderMaterial,
    Vector3,
    WebGLRenderer
} from 'three';
import { GPUComputationRenderer } from 'three/addons/misc/GPUComputationRenderer.js';

const simBounds = 10;

const fillPositionTexture = ( texture ) => {

  const theArray = texture.image.data;

  for ( let k = 0, kl = theArray.length; k < kl; k += 4 ) {
    const x = Math.random() * simBounds - simBounds/2;
    const y = Math.random() * simBounds - simBounds/2;
    const z = Math.random() * simBounds - simBounds/2;
    theArray[ k + 0 ] = x;
    theArray[ k + 1 ] = y;
    theArray[ k + 2 ] = z;
    theArray[ k + 3 ] = 1;
  };

};

function fillVelocityTexture( texture ) {

  const theArray = texture.image.data;

  for ( let k = 0, kl = theArray.length; k < kl; k += 4 ) {
    const x = Math.random() - 0.5;
    const y = Math.random() - 0.5;
    const z = Math.random() - 0.5;
    theArray[ k + 0 ] = x * 10;
    theArray[ k + 1 ] = y * 10;
    theArray[ k + 2 ] = z * 10;
    theArray[ k + 3 ] = 1;
  };

};

const gpgpuWidth = 4;
const people = gpgpuWidth * gpgpuWidth;
const gpgpuRenderer = new WebGLRenderer();

let gpuCompute;
let velocityVariable;
let positionVariable;
let positionUniforms;
let velocityUniforms;
// let peopleUniforms;

const fragmentShaderVelocity = `
  uniform float time;
  void main () {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
`
const fragmentShaderPosition = `
  uniform float time;
  void main () {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
`

function initComputeRenderer() {

  gpuCompute = new GPUComputationRenderer( gpgpuWidth, gpgpuWidth, gpgpuRenderer );

  const dtPosition = gpuCompute.createTexture();
  const dtVelocity = gpuCompute.createTexture();
  fillPositionTexture( dtPosition );
  fillVelocityTexture( dtVelocity );

  velocityVariable = gpuCompute.addVariable( 'textureVelocity', fragmentShaderVelocity, dtVelocity );
  positionVariable = gpuCompute.addVariable( 'texturePosition', fragmentShaderPosition, dtPosition );

  gpuCompute.setVariableDependencies( velocityVariable, [ positionVariable, velocityVariable ] );
  gpuCompute.setVariableDependencies( positionVariable, [ positionVariable, velocityVariable ] );

  positionUniforms = positionVariable.material.uniforms;
  velocityUniforms = velocityVariable.material.uniforms;

  positionUniforms[ 'time' ] = { value: 0.0 };
  positionUniforms[ 'delta' ] = { value: 0.0 };
  velocityUniforms[ 'time' ] = { value: 1.0 };
  velocityUniforms[ 'delta' ] = { value: 0.0 };
  velocityUniforms[ 'testing' ] = { value: 1.0 };
  velocityUniforms[ 'separationDistance' ] = { value: 1.0 };
  velocityUniforms[ 'alignmentDistance' ] = { value: 1.0 };
  velocityUniforms[ 'cohesionDistance' ] = { value: 1.0 };
  velocityUniforms[ 'freedomFactor' ] = { value: 1.0 };
  velocityVariable.material.defines.simBounds = simBounds.toFixed( 2 );

  velocityVariable.wrapS = RepeatWrapping;
  velocityVariable.wrapT = RepeatWrapping;
  positionVariable.wrapS = RepeatWrapping;
  positionVariable.wrapT = RepeatWrapping;

  const error = gpuCompute.init();

  if ( error !== null ) {

    console.error( error );

  }
  (window as any).gpuCompute = gpuCompute;
  console.log(gpuCompute);
  console.log(gpuCompute.getCurrentRenderTarget( positionVariable ).texture);
}

const personShader = {
    vertexShader: `
    varying vec2 vUv;
    uniform float time;
    varying vec3 vPosition;
    attribute float instanceIndex;
    varying float vInstanceIndex;
      void main() {
        vUv = uv;      
        vec4 mvPosition = vec4( position, 1.0 );
        #ifdef USE_INSTANCING
            mvPosition = instanceMatrix * mvPosition;
            vPosition = vec3(mvPosition.x, mvPosition.y, mvPosition.z);
            vInstanceIndex = instanceIndex;
        #endif
        // float dispPower = 1.0 - cos( uv.y * 3.1416 / 2.0 );
        // float displacement = sin( mvPosition.z + time * 7.0 ) * ( 0.1 * dispPower );
        // mvPosition.z += displacement;
        vec4 modelViewPosition = modelViewMatrix * mvPosition;
        gl_Position = projectionMatrix * modelViewPosition;
      }
  `,
  fragmentShader: `
    varying vec3 vPosition;
    varying vec2 vUv;
    varying float vInstanceIndex;

    // uniform vec3 skyColorLight;
    // uniform vec3 baseColor;
    void main() {
        // float clarity = ( vUv.y * 0.5 ) + 0.5;
        // vec3 mixSkyColorLight = mix(skyColorLight, baseColor, clarity);
        // gl_FragColor = vec4( mixSkyColorLight, 1 );
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `
};

initComputeRenderer();

const matrixPositionObject = new Object3D();  
const instanceNumber = people;
const placementScale = 2;
const instanceScale = .75;
const instanceOrigin = new Vector3(0, 0, 0);

const rotatedPlaneGeometry = new PlaneGeometry(100, 100, 100, 100);
rotatedPlaneGeometry.rotateX(Math.PI / 2);

const WalkingPerson: React.FC = (): JSX.Element => {  
    const instancedMeshRef = useRef<InstancedMesh>(null);
    const shaderMaterialRef = useRef<ShaderMaterial>(null);

    useEffect(() => {
        if(instancedMeshRef.current) {
            for ( let i=0 ; i<instanceNumber ; i++ ) {
                const angle = Math.random() * Math.PI * 2; 
                const radius = Math.sqrt(Math.random()) * placementScale;
                const x = radius * Math.cos(angle);
                const z = radius * Math.sin(angle);
                matrixPositionObject.scale.y = 1.5 + (Math.random() * instanceScale) - instanceScale / 2;
                matrixPositionObject.position.set(x, matrixPositionObject.scale.y / 2, z);        
                matrixPositionObject.rotation.y = Math.random() * Math.PI;
                matrixPositionObject.updateMatrix();
                instancedMeshRef.current.setMatrixAt( i, matrixPositionObject.matrix );
                instancedMeshRef.current.frustumCulled = false;
            }

            const instanceIndices = new Float32Array(instanceNumber);
            for (let i = 0; i < instanceNumber; i++) {
                instanceIndices[i] = i;
            }

            const instanceIndexAttribute = new InstancedBufferAttribute(instanceIndices, 1, false);
            instancedMeshRef.current.geometry.setAttribute('instanceIndex', instanceIndexAttribute);            

            instancedMeshRef.current.instanceMatrix.needsUpdate = true;
            instancedMeshRef.current.frustumCulled = false;
        }
    }, [])

    useFrame(({clock}) => {
        if(shaderMaterialRef.current) {
            shaderMaterialRef.current.uniforms.time.value = clock.getElapsedTime();
            shaderMaterialRef.current.uniformsNeedUpdate = true;
            gpuCompute.compute();

            // positionUniforms[ 'time' ].value = clock.elapsedTime;
            // positionUniforms[ 'delta' ].value = clock.getDelta();
            // velocityUniforms[ 'time' ].value = clock.elapsedTime;
            // velocityUniforms[ 'delta' ].value = clock.getDelta();

            shaderMaterialRef.current.uniforms[ 'texturePosition' ].value = gpuCompute.getCurrentRenderTarget( positionVariable ).texture;
    				shaderMaterialRef.current.uniforms[ 'textureVelocity' ].value = gpuCompute.getCurrentRenderTarget( velocityVariable ).texture;
        }
    });

    return (
      <>
        <mesh position={[0.0, 0.0, 0.0]}>
          <primitive object={rotatedPlaneGeometry} />
          <meshBasicMaterial color={0x00ff00} side={DoubleSide}/>
        </mesh>
        <gridHelper args={[100, 100, 100, 100]} position={[0, 0.01, 0]}/>
        <instancedMesh position={instanceOrigin} args={[null as any, null as any, instanceNumber]} ref={instancedMeshRef} >
          <planeGeometry args={[1, 1, 1, 1]} />
          <shaderMaterial 
              ref={shaderMaterialRef}
              vertexShader={personShader.vertexShader}
              fragmentShader={personShader.fragmentShader}
              uniforms={{
                  time: {
                      value: 0
                  },
                  texturePosition: {
                    value: null
                  },
                  textureVelocity: {
                    value: null
                  }
              }}
              side={DoubleSide}
            />
        </instancedMesh>
      </>
    )
};

const WalkingShaderCanvas: React.FC = (): JSX.Element => {
  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 15] }}
      >
        <WalkingPerson />
        <OrbitControls
          enableDamping={true}
          dampingFactor={0.05}
          screenSpacePanning={false}
          zoomSpeed={.1}
          panSpeed={.1}
          rotateSpeed={.1}
        />
      </Canvas>
    </>
  )
};

export { WalkingShaderCanvas };