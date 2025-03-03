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
    Object3D,
    ShaderMaterial,
    Vector3
} from 'three';

const personShader = {
    vertexShader: `
    varying vec2 vUv;
    uniform float time;
    varying vec3 vPosition;
    
      void main() {
        vUv = uv;      
        vec4 mvPosition = vec4( position, 1.0 );
        #ifdef USE_INSTANCING
            mvPosition = instanceMatrix * mvPosition;
            vPosition = vec3(mvPosition.x, mvPosition.y, mvPosition.z);
        #endif
        float dispPower = 1.0 - cos( uv.y * 3.1416 / 2.0 );
        float displacement = sin( mvPosition.z + time * 7.0 ) * ( 0.1 * dispPower );
        mvPosition.z += displacement;
        vec4 modelViewPosition = modelViewMatrix * mvPosition;
        gl_Position = projectionMatrix * modelViewPosition;
      }
  `,
  fragmentShader: `
    varying vec3 vPosition;
    varying vec2 vUv;
    uniform vec3 skyColorLight;
    uniform vec3 baseColor;
    void main() {
        float clarity = ( vUv.y * 0.5 ) + 0.5;
        vec3 mixSkyColorLight = mix(skyColorLight, baseColor, clarity);
        gl_FragColor = vec4( mixSkyColorLight, 1 );
    }
  `
};

const matrixPositionObject = new Object3D();  
const instanceNumber = 10;
const placementScale = 2;
const instanceScale = 1;
const instanceOrigin = new Vector3(0, 0, 0);

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
                matrixPositionObject.position.set(x, 0, z);        
                matrixPositionObject.scale.setScalar( 0.5 + Math.random() * instanceScale );
                matrixPositionObject.rotation.y = Math.random() * Math.PI;
                matrixPositionObject.updateMatrix();
                instancedMeshRef.current.setMatrixAt( i, matrixPositionObject.matrix );
                instancedMeshRef.current.frustumCulled = false;
            }
            instancedMeshRef.current.instanceMatrix.needsUpdate = true;
            instancedMeshRef.current.frustumCulled = false;
        }
    }, [])

    useFrame(({clock}) => {
        if(shaderMaterialRef.current) {
            shaderMaterialRef.current.uniforms.time.value = clock.getElapsedTime();
            shaderMaterialRef.current.uniformsNeedUpdate = true;    
        }
    });

    return (
        <instancedMesh position={instanceOrigin} args={[null as any, null as any, instanceNumber]} ref={instancedMeshRef} >
            <planeGeometry args={[1, 1.5, 1, 1]} />
            <shaderMaterial 
                ref={shaderMaterialRef}
                vertexShader={personShader.vertexShader}
                fragmentShader={personShader.fragmentShader}
                uniforms={{
                    time: {
                        value: 0
                    }
                }}
                side={DoubleSide}
            />
        </instancedMesh>
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