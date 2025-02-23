import {
    DoubleSide,
    ShaderMaterial,
    InstancedMesh,
    Object3D,
    SphereGeometry,
    Group
} from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

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
        if(mvPosition.y < 0.0) {
            mvPosition.y = mvPosition.y / 3.0;
        }
        vec3 originVector = vec3(0.0, 0.0, 0.0);
        float distanceFromOrigin = distance(originVector, vPosition) / 150.0;
        mvPosition.y = mvPosition.y - distanceFromOrigin * 12.5;
        vec4 modelViewPosition = modelViewMatrix * mvPosition;
        
        gl_Position = projectionMatrix * modelViewPosition;
      }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform vec3 whiteColor;
    uniform vec3 skyColorLight;

    void main() {
        // float distanceToBottom = distance(vPosition, vec3(0.0, -1.0, 0.0));
        vec3 skyColorLighter = mix(skyColorLight, whiteColor, .85);
        vec3 skyColorMix = mix(skyColorLighter, whiteColor, (vPosition.y + 2.0));
        // gl_FragColor = vec4(vPosition.y, vPosition.y, vPosition.y, 1.0);
        // vec3 originVector = vec3(0.0, 0.0, 0.0);
        // float distanceFromOrigin = distance(originVector, vPosition) / 150.0;
        // gl_FragColor = vec4(skyColorMix, 1.0 - distanceFromOrigin);
        gl_FragColor = vec4(skyColorMix, 1.0);
    }
  `
};

const InsectsClouds = ({
    whiteColor,
    skyColor,
    instanceNumber, 
    instanceOrigin,
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
      whiteColor: {
        value: whiteColor
      }
    };

    const cloudsMaterial = new ShaderMaterial({
      vertexShader: flowerShader.vertexShader,
      fragmentShader: flowerShader.fragmentShader,
      uniforms,
      side: DoubleSide
    });

    const cloudGeometry = new SphereGeometry(1, 20, 20);
      
    const matrixPositionObject = new Object3D();
    const geometry = cloudGeometry;    
    const instancedMesh = new InstancedMesh( geometry, cloudsMaterial, instanceNumber );
    for ( let i=0 ; i<instanceNumber ; i++ ) {
        const angle = Math.random() * Math.PI * 2; // Random angle between 0 and 2π
        const radius = Math.sqrt(Math.random()) * placementScale; // Square root of random number times the radius of the circle

        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);

        matrixPositionObject.position.set(x, Math.random() * 5, z);    
//          matrixPositionObject.scale.setScalar( 0.1 + Math.random() * instanceScale );

        matrixPositionObject.scale.x = 1 + Math.random() * instanceScale * 2;
        matrixPositionObject.scale.y = matrixPositionObject.scale.x / 2.0;
        matrixPositionObject.scale.z = matrixPositionObject.scale.x;
        //   matrixPositionObject.rotation.set(Math.PI / Math.random() * 2, Math.random() / 10, Math.random() / 10);
        matrixPositionObject.updateMatrix();
        instancedMesh.setMatrixAt( i, matrixPositionObject.matrix );
    }
    instancedMesh.position.copy(instanceOrigin);
  
    useFrame(({clock}) => {
        if(groupRef && groupRef.current) {
            groupRef.current.rotation.y = clock.elapsedTime / 75.0;
        }
    });

    const groupRef = useRef<Group>(null)

    return (
        <group ref={groupRef}>
            <primitive object={instancedMesh}/>
        </group>
    )
};

export { InsectsClouds };
