import {
    DoubleSide,
    Group,
    InstancedMesh,
    Object3D
} from 'three';
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

const cloudsShader = {
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
        vec3 skyColorLighter = mix(skyColorLight, whiteColor, .85);
        vec3 skyColorMix = mix(skyColorLighter, whiteColor, (vPosition.y + 2.0));
        gl_FragColor = vec4(skyColorMix, 1.0);
    }
  `
};

const matrixPositionObject = new Object3D();

const InsectsClouds = ({
    whiteColor,
    skyColor,
    instanceNumber, 
    instanceOrigin,
    placementScale,
    instanceScale
}) => {
    const groupRef = useRef<Group>(null);
    const instancedMeshRef = useRef<InstancedMesh>(null);

    useEffect(() => {
        if(instancedMeshRef.current) {
            for ( let i=0 ; i<instanceNumber ; i++ ) {
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.sqrt(Math.random()) * placementScale;
                const x = radius * Math.cos(angle);
                const z = radius * Math.sin(angle);
                matrixPositionObject.position.set(x, Math.random() * 5, z);    
                matrixPositionObject.scale.x = 1 + Math.random() * instanceScale * 2;
                matrixPositionObject.scale.y = matrixPositionObject.scale.x / 2.0;
                matrixPositionObject.scale.z = matrixPositionObject.scale.x;
                matrixPositionObject.updateMatrix();
                instancedMeshRef.current.setMatrixAt( i, matrixPositionObject.matrix );
            }
            instancedMeshRef.current.instanceMatrix.needsUpdate = true;
            instancedMeshRef.current.frustumCulled = false;
        }
    }, [])
  
    useFrame(({clock}) => {
        if(groupRef && groupRef.current) {
            groupRef.current.rotation.y = clock.elapsedTime / 75.0;
        }
    });

    return (
        <group ref={groupRef}>
            <instancedMesh position={instanceOrigin} ref={instancedMeshRef} args={[null as any, null as any, instanceNumber]} >
                <sphereGeometry args={[1, 20, 20]} />
                <shaderMaterial 
                    vertexShader={cloudsShader.vertexShader}
                    fragmentShader={cloudsShader.fragmentShader}
                    uniforms={{
                        time: {
                            value: 0
                        },
                        skyColorLight: {
                            value: skyColor
                        },
                        whiteColor: {
                            value: whiteColor
                        }
                    }}
                    side={DoubleSide}
                />
            </instancedMesh>
        </group>
    )
};

export { InsectsClouds };