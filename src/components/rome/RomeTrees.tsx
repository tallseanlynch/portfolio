import { isMobileDevice } from '../../assets/js/util';
import { whiteColor } from './romeColors';
import { useRef, useEffect } from 'react';
import {
    Color,
    DoubleSide,
    InstancedMesh,
    NearestFilter,
    Object3D,
    TextureLoader,
    Vector3
} from 'three';

const mobileDevice = isMobileDevice();
const textureLoader = new TextureLoader();
const treeTexture0 = textureLoader.load('/rome/tree-0-inverse-mix-1-50-compressed-bw.png');
const treeTexture1 = textureLoader.load('/rome/tree-0-inverse-mix-2-50-compressed-bw.png');
treeTexture0.premultiplyAlpha = true;
treeTexture1.premultiplyAlpha = true;
treeTexture0.minFilter = NearestFilter;
treeTexture1.minFilter = NearestFilter;
treeTexture0.magFilter = NearestFilter;
treeTexture1.magFilter = NearestFilter;
const treeTexture2 = textureLoader.load('/rome/tree-0-inverse-mix-1-50-compressed.png');
const treeTexture3 = textureLoader.load('/rome/tree-0-inverse-mix-2-50-compressed.png');
const originVector = new Vector3(0, 0, 0,);

const RomeTreeMaterial0: React.FC = (): JSX.Element => {

    return (
        <meshStandardMaterial
            color={whiteColor}
            map={treeTexture2}
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
            map={treeTexture3}
            transparent={true}
            alphaTest={0.5}
            side={DoubleSide}
        />
    )
};

const matrixCalcObject = new Object3D();

const RomeTreeRing: React.FC<RomeTreeRingProps> = ({
    texture, 
    distance
}): JSX.Element => {
    const instancedMeshRef = useRef<InstancedMesh>(null);
    const instanceCount = mobileDevice ? 25 : 50;
    
    useEffect(() => {
        if(instancedMeshRef.current) {
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
                instancedMeshRef.current.setMatrixAt(instanceIndex, matrixCalcObject.matrix);
            }
            instancedMeshRef.current.instanceMatrix.needsUpdate = true;
            instancedMeshRef.current.frustumCulled = false;
        }
    }, [])

    return (
        <instancedMesh
            args={[null as any, null as any, instanceCount]}
            ref={instancedMeshRef}
        >
            <planeGeometry 
                args={[1, 1, 1, 1]}
            />
            <meshStandardMaterial 
                transparent={true}
                map={texture}
                alphaTest={0.5}
                side={DoubleSide}
                color={new Color(0xccaaaa)} 
            />
        </instancedMesh>
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
                distance={12.5}
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