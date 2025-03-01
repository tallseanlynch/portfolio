import { isMobileDevice } from '../../assets/js/util';
import { whiteColor } from './romeColors';
import { useFrame } from '@react-three/fiber';
import { 
    useEffect,
    useRef
} from 'react';
import {
    InstancedMesh,
    Matrix4,
    Object3D,
    Quaternion,
    Vector3
} from 'three';

const mobileDevice = isMobileDevice();
const matrixCalcObject = new Object3D();
const calcMatrix4 = new Matrix4();
const decomposePosition = new Vector3();
const decomposeQuaternion = new Quaternion();
const decomposeScale = new Vector3();
const positionInterval = 5;
const lineDirection = (.125/2) * Math.PI;
const lineDirectionVector3 = new Vector3(
    Math.sin(lineDirection),  
    -Math.cos(lineDirection),
    0
).multiplyScalar(.05);
const instanceCount = mobileDevice ? 200 : 1000;

const RomeRain: React.FC = (): JSX.Element => {
    const instancedMeshRef = useRef<InstancedMesh>(null);

    useEffect(() => {
        if(instancedMeshRef.current) {
            instancedMeshRef.current.position.set(-2.5, 0, -2.5);
            for (let instanceIndex = 0; instanceIndex < instanceCount; instanceIndex++) {
                matrixCalcObject.position.set(
                    (Math.random() * positionInterval),
                    (Math.random() * positionInterval),
                    (Math.random() * positionInterval)
                );
                matrixCalcObject.rotation.z = lineDirection;
                matrixCalcObject.updateMatrix();
                instancedMeshRef.current.setMatrixAt(instanceIndex, matrixCalcObject.matrix);
            }        
        }
    }, [])

    useFrame(() => {
        if(instancedMeshRef.current) {
            for (let instanceIndex = 0; instanceIndex < instanceCount; instanceIndex++) {
                instancedMeshRef.current.getMatrixAt(instanceIndex, calcMatrix4);
                calcMatrix4.decompose(
                    decomposePosition,
                    decomposeQuaternion,
                    decomposeScale
                );
                matrixCalcObject.position.copy(decomposePosition).add(lineDirectionVector3);
                if(matrixCalcObject.position.y < 0) {
                    matrixCalcObject.position.y = 3;
                    matrixCalcObject.position.x = Math.random() * positionInterval;
                    matrixCalcObject.position.z = Math.random() * positionInterval;
                }
                matrixCalcObject.updateMatrix();
                instancedMeshRef.current.setMatrixAt(instanceIndex, matrixCalcObject.matrix);
            }
            instancedMeshRef.current.instanceMatrix.needsUpdate = true;
            instancedMeshRef.current.frustumCulled = false;    
        }
    });

    return (
        <instancedMesh
            args={[null as any, null as any, instanceCount]}
            ref={instancedMeshRef}
        >
            <meshBasicMaterial 
                color={whiteColor}
                transparent={true}
                opacity={.25}
            />
            <boxGeometry args={[.005, .1, .005]} />
        </instancedMesh>
    );
};

export { RomeRain };