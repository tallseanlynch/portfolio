import {
    useFrame,
} from '@react-three/fiber';
import {
    Vector3,
    DoubleSide,
    Color,
    ShaderMaterial,
    InstancedMesh,
    PlaneGeometry,
    Object3D,
} from 'three';

// huge thank you to felixmariotto and the three.js discord
// modified shader from: https://discourse.threejs.org/t/simple-instanced-grass-example/26694
const grassShader = {
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
        // vec3 positionColor = mix(skyColorLight, vPosition, .05);
        // vec3 mixSkyColorLight = mix(positionColor, baseColor, clarity);
        vec3 mixSkyColorLight = mix(skyColorLight, baseColor, clarity);
        //mixSkyColorLight = mix(mixSkyColorLight, vPosition / 10.0, .125);
        // gl_FragColor = vec4(mix(mixSkyColorLight, vPosition, .0125), 1.0);
        gl_FragColor = vec4( mixSkyColorLight, 1 );
    }
  `
};

interface GrassProps {
    baseColor: Color,
    skyColor: Color,
    instanceNumber: number, 
    instanceOrigin: Vector3,
    planeGeometryArgs: number[],
    placementScale: number,
    instanceScale: number    
};

const InsectsGrass: React.FC<GrassProps> = ({
    baseColor,
    skyColor,
    instanceNumber, 
    instanceOrigin,
    planeGeometryArgs,
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
    vertexShader: grassShader.vertexShader,
    fragmentShader: grassShader.fragmentShader,
    uniforms,
    side: DoubleSide
  });
    
  const matrixPositionObject = new Object3D();  
  const geometry = new PlaneGeometry(planeGeometryArgs[0], planeGeometryArgs[1], planeGeometryArgs[2], planeGeometryArgs[3])
  const instancedMesh = new InstancedMesh( geometry, leavesMaterial, instanceNumber );
    for ( let i=0 ; i<instanceNumber ; i++ ) {
        const angle = Math.random() * Math.PI * 2; 
        const radius = Math.sqrt(Math.random()) * placementScale;

        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);

        matrixPositionObject.position.set(x, 0, z);        
        matrixPositionObject.scale.setScalar( 0.5 + Math.random() * instanceScale );
        matrixPositionObject.rotation.y = Math.random() * Math.PI;
        matrixPositionObject.updateMatrix();
        instancedMesh.setMatrixAt( i, matrixPositionObject.matrix );
    }

    instancedMesh.position.copy(instanceOrigin);

    useFrame(({clock}) => {
        leavesMaterial.uniforms.time.value = clock.getElapsedTime();
        leavesMaterial.uniformsNeedUpdate = true;
    });

    return (
        <primitive object={instancedMesh}/>
    )
};

export { InsectsGrass };
