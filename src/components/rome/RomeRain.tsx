import {
    Vector3,
    InstancedMesh,
    Object3D,
    MeshBasicMaterial,
    BoxGeometry,
    Matrix4,
    Quaternion
} from 'three';
import { useFrame } from '@react-three/fiber';
import { whiteColor } from './romeColors';

const RomeRain: React.FC = ():JSX.Element => {
    const positionInterval = 5;
    const matrixCalcObject = new Object3D();
    const mat = new MeshBasicMaterial(
        { 
            color: whiteColor,
            transparent: true,
            opacity: .25
        }
    );
    const geo = new BoxGeometry(.005, .1, .005);    
    const lineDirection = (.125/2) * Math.PI;
    const lineDirectionVector3 = new Vector3(
        Math.sin(lineDirection),  
        -Math.cos(lineDirection),
        0
    ).multiplyScalar(.05);
    const instanceCount = 200;
    const instancedMesh = new InstancedMesh(geo, mat, instanceCount);
    instancedMesh.position.set(-2.5, 0, -2.5);
    for (let instanceIndex = 0; instanceIndex < instanceCount; instanceIndex++) {
        matrixCalcObject.position.set(
            (Math.random() * positionInterval),
            (Math.random() * positionInterval),
            (Math.random() * positionInterval)
        );
        matrixCalcObject.rotation.z = lineDirection;
        matrixCalcObject.updateMatrix();
        instancedMesh.setMatrixAt(instanceIndex, matrixCalcObject.matrix);
    }

    const calcMatrix4 = new Matrix4();
    const decomposePosition = new Vector3();
    const decomposeQuaternion = new Quaternion();
    const decomposeScale = new Vector3();

    useFrame(() => {
        for (let instanceIndex = 0; instanceIndex < instanceCount; instanceIndex++) {
            instancedMesh.getMatrixAt(instanceIndex, calcMatrix4);
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
            instancedMesh.setMatrixAt(instanceIndex, matrixCalcObject.matrix);
        }
        instancedMesh.instanceMatrix.needsUpdate = true;
    });

    return (<primitive object={instancedMesh} />);
};

export { RomeRain };