import React, {
  useRef,
  useEffect
} from 'react';
import {
  DoubleSide,
  InstancedMesh,
  Object3D
} from 'three';

const smallFlowerShader = {
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

const InsectsSmallFlowers: React.FC<InsectsSmalFlowersProps> = ({
  baseColor,
  skyColor,
  instanceNumber, 
  instanceOrigin,
  circleGeometryArgs,
  placementScale,
  instanceScale
}): JSX.Element => { 
  const instancedMeshRef = useRef<InstancedMesh>(null);
      
  useEffect(() => {
    if(instancedMeshRef.current) {
      for ( let i=0 ; i<instanceNumber ; i++ ) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.sqrt(Math.random()) * placementScale;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        matrixPositionObject.position.set(x, Math.random() / 5, z);    
        matrixPositionObject.scale.setScalar( 0.1 + Math.random() * instanceScale );
        matrixPositionObject.rotation.set(Math.PI / Math.random() * 2, Math.random() / 10, Math.random() / 10);
        matrixPositionObject.updateMatrix();
        instancedMeshRef.current.setMatrixAt( i, matrixPositionObject.matrix );
      }
      instancedMeshRef.current.instanceMatrix.needsUpdate = true;
      instancedMeshRef.current.frustumCulled = false;
    }
  }, []);
    
    return (
      <instancedMesh 
        args={[null as any, null as any, instanceNumber]} 
        position={instanceOrigin} 
        ref={instancedMeshRef}
      >
        <circleGeometry args={[circleGeometryArgs[0], circleGeometryArgs[1]]} />
        <shaderMaterial 
          vertexShader={smallFlowerShader.vertexShader}
          fragmentShader={smallFlowerShader.fragmentShader}
          uniforms={
            {
              time: {
                  value: 0
              },
              skyColorLight: {
                  value: skyColor
              },
              baseColor: {
                value: baseColor
              }
            }
          }
          side={DoubleSide}
        />
      </instancedMesh>
    )
};

export { InsectsSmallFlowers };