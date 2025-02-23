import {
    TextureLoader,
    DoubleSide,
    Object3D,
    MeshStandardMaterial,
    InstancedMesh,
    PlaneGeometry,
    Vector3
} from 'three';
import { whiteColor } from './romeColors';
import { isMobileDevice } from '../../assets/js/util';

const mobileDevice = isMobileDevice();
const textureLoader = new TextureLoader();
const treeTexture0 = textureLoader.load('/rome/tree-0-inverse-mix-1-50-compressed.png');
const treeTexture1 = textureLoader.load('/rome/tree-0-inverse-mix-2-50-compressed.png');
const originVector = new Vector3(0, 0, 0,);

const RomeTreeMaterial0: React.FC = (): JSX.Element => {

    return (
        <meshStandardMaterial
            color={whiteColor}
            map={treeTexture0}
            transparent={true}
            alphaTest={0.5}
            side={DoubleSide}
        />
    )
};

const RomeTreeMaterial1: React.FC = (): JSX.Element => {

    return (
        <meshStandardMaterial
            color={whiteColor}
            map={treeTexture1}
            transparent={true}
            alphaTest={0.5}
            side={DoubleSide}
        />
    )
};

const RomeTreeRing = ({texture, distance}) => {

    const matrixCalcObject = new Object3D();
    const mat = new MeshStandardMaterial({
        transparent: true,
        map: texture,
        alphaTest: 0.5,
        side: DoubleSide
    });
    const geo = new PlaneGeometry(1, 1, 1, 1);
    const instanceCount = mobileDevice ? 25 : 50;
    const instancedMesh = new InstancedMesh(geo, mat, instanceCount);
    
    for (let instanceIndex = 0; instanceIndex < instanceCount; instanceIndex++) {
        const angle = (instanceIndex / instanceCount) * Math.PI * 2;
        const x = distance * Math.cos(angle); 
        const z = distance * Math.sin(angle); 
        const randomHeight = 2 + Math.random() * 4.0; 
    
        matrixCalcObject.scale.set(
            3 + Math.random() * 2.0,
            randomHeight,
            2 + Math.random() * 2.0
        );
    
        matrixCalcObject.position.set(
            x,
            (randomHeight / 2.0) - Math.random(),
            z
        );
    
        matrixCalcObject.lookAt(originVector);    
        matrixCalcObject.updateMatrix();
        instancedMesh.setMatrixAt(instanceIndex, matrixCalcObject.matrix);
    }

    return (
        <primitive object={instancedMesh}/>
    )
}

const RomeTrees: React.FC = (): JSX.Element => {

    return (
        <>
            <RomeTreeRing
                texture={treeTexture0}
                distance={15}
            />
            <RomeTreeRing
                texture={treeTexture1}
                distance={20}
            />
            <mesh
                position={[-.75, .66, 0.2]}
            >
                <planeGeometry
                    args={[1, 1.35, 1, 1]}
                />
                <RomeTreeMaterial0 />
            </mesh>
            <mesh
                position={[-1.25, .8, -0.2]}
                rotation={[0, Math.PI, 0]}
            >
                <planeGeometry
                    args={[1.25, 1.75, 1, 1]}
                />
                <RomeTreeMaterial1 />
            </mesh>
            <mesh
                position={[.75, .9, 0.15]}
            >
                <planeGeometry
                    args={[1, 1.75, 1, 1]}
                />
                <RomeTreeMaterial0 />
            </mesh>
            <mesh
                position={[1.25, .8, -0.2]}
                rotation={[0, Math.PI, 0]}
            >
                <planeGeometry
                    args={[1.25, 1.75, 1, 1]}
                />
                <RomeTreeMaterial1 />
            </mesh>
        </>
    )
};

export { RomeTrees };