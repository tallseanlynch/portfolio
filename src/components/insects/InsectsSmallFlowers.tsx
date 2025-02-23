import {
    DoubleSide,
    ShaderMaterial,
    InstancedMesh,
    Object3D,
    CircleGeometry,
} from 'three';

const flowerShader = {
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
//        mixSkyColorLight = mix(mixSkyColorLight, vPosition / 10.0, .125);
        gl_FragColor = vec4( mixSkyColorLight, 1 );
    }
  `
};

const InsectsSmallFlowers = ({
    baseColor,
    skyColor,
    instanceNumber, 
    instanceOrigin,
    circleGeometryArgs,
    placementScale,
    instanceScale
}) => {  
    const uniforms = {
        time: {
          value: 0
      },
      skyColorLight: {
          value: skyColor
      },
      baseColor: {
        value: baseColor
      }
    };

    const leavesMaterial = new ShaderMaterial({
      vertexShader: flowerShader.vertexShader,
      fragmentShader: flowerShader.fragmentShader,
      uniforms,
      side: DoubleSide
    });
      
    const matrixPositionObject = new Object3D();
    const geometry = new CircleGeometry(circleGeometryArgs[0], circleGeometryArgs[1]);    
    const instancedMesh = new InstancedMesh( geometry, leavesMaterial, instanceNumber );
      for ( let i=0 ; i<instanceNumber ; i++ ) {
          const angle = Math.random() * Math.PI * 2; // Random angle between 0 and 2π
          const radius = Math.sqrt(Math.random()) * placementScale; // Square root of random number times the radius of the circle
  
          const x = radius * Math.cos(angle);
          const z = radius * Math.sin(angle);
  
          matrixPositionObject.position.set(x, Math.random() / 5, z);    
          matrixPositionObject.scale.setScalar( 0.1 + Math.random() * instanceScale );
          matrixPositionObject.rotation.set(Math.PI / Math.random() * 2, Math.random() / 10, Math.random() / 10);
          matrixPositionObject.updateMatrix();
          instancedMesh.setMatrixAt( i, matrixPositionObject.matrix );
      }
      instancedMesh.position.copy(instanceOrigin);
  
    //   useFrame(({clock}) => {
    //       leavesMaterial.uniforms.time.value = clock.getElapsedTime();
    //       leavesMaterial.uniformsNeedUpdate = true;
    //   });
  
    return (
        <primitive object={instancedMesh}/>
    )
};

export { InsectsSmallFlowers };