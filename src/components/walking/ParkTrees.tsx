import { trees, tallTrees } from './parkTreesData';
import { 
    treeTrunkShaderA,
    treeLeafShaderA,
    treeTrunkShaderB,
    treeLeafShaderB,
    treeLeafShaderC,
} from './parkTreeShaders';
import {
    BufferGeometry,
    CatmullRomCurve3,
    SphereGeometry,
    TubeGeometry,
    Vector3
} from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

const randomNeg1To1 = () => (Math.random() -.5) * 2;

const ParkTreesA = ({treePositions, treeRotations}) => {
    const mergedTreeGeometries: BufferGeometry[] = [];
    const mergedSphereGeometries: BufferGeometry[] = [];    
    trees.forEach(t => {
        const sectionGeometries: TubeGeometry[] = [];
        const sectionLeaves: SphereGeometry[] = [];
        t.forEach((s, si) => {
            const vector3s = s.map(v => new Vector3(v.x, v.y, v.z));
            const curve = new CatmullRomCurve3(vector3s);
            const geometry = new TubeGeometry( curve, 8, .25 - (si * .0125), 8, false );
            sectionGeometries.push(geometry);    
            const leafSphere = new SphereGeometry(1.5, 8, 8);
            leafSphere.scale(2, 1, 2);
            leafSphere.translate(
                vector3s[vector3s.length -1].x,
                vector3s[vector3s.length -1].y + .75,
                vector3s[vector3s.length -1].z
            );
            sectionLeaves.push(leafSphere);
        })
        mergedTreeGeometries.push(mergeGeometries(sectionGeometries));
        mergedSphereGeometries.push(mergeGeometries(sectionLeaves))
    })

    return (
        mergedTreeGeometries.map((mtg, mtgi) => (
            <group key={mtgi}>
                <mesh position={treePositions[mtgi]} rotation={treeRotations[mtgi]}>
                    <primitive object={mtg} />
                    <shaderMaterial 
                        { ...treeTrunkShaderA }
                    />
                </mesh>
                <mesh position={treePositions[mtgi]} rotation={treeRotations[mtgi]}>
                    <primitive object={mergedSphereGeometries[mtgi]} />
                    <shaderMaterial 
                        { ...treeLeafShaderA }
                    />
                </mesh>
            </group>)    
        )
    )
};

const ParkTreesB = ({treePositions, treeRotations}) => {
    const mergedTreeGeometries: BufferGeometry[] = [];
    const mergedSphereGeometries: BufferGeometry[] = [];    
    trees.forEach(t => {
        const sectionGeometries: TubeGeometry[] = [];
        const sectionLeaves: SphereGeometry[] = [];
        t.forEach((s, si) => {
            const vector3s = s.map(v => new Vector3(v.x, v.y, v.z));
            const curve = new CatmullRomCurve3(vector3s);
            const geometry = new TubeGeometry( curve, 8, .25 - (si * .0125), 8, false );
            sectionGeometries.push(geometry);    
            const leafSphere = new SphereGeometry(1.5, 8, 8);
            leafSphere.attributes.position.array.forEach((p, pi) => {
                if(pi % 3 === 1){
                    if(leafSphere.attributes.position.array[pi] > 0) {
                        leafSphere.attributes.position.array[pi] *= leafSphere.attributes.position.array[pi];
                    }
                }
            })
            leafSphere.scale(1, 2, 1);
            leafSphere.translate(
                vector3s[vector3s.length -1].x,
                vector3s[vector3s.length -1].y + .75,
                vector3s[vector3s.length -1].z
            );
            sectionLeaves.push(leafSphere);
        })
        mergedTreeGeometries.push(mergeGeometries(sectionGeometries));
        mergedSphereGeometries.push(mergeGeometries(sectionLeaves))
    })

    return (
        mergedTreeGeometries.map((mtg, mtgi) => (
            <group key={mtgi}>
                <mesh position={treePositions[mtgi]} rotation={treeRotations[mtgi]}>
                    <primitive object={mtg} />
                    <shaderMaterial 
                        { ...treeTrunkShaderB }
                    />
                </mesh>
                <mesh position={treePositions[mtgi]} rotation={treeRotations[mtgi]}>
                    <primitive object={mergedSphereGeometries[mtgi]} />
                    <shaderMaterial 
                        { ...treeLeafShaderB }
                    />
                </mesh>
            </group>)    
        )
    )
};

const ParkTreesC = ({treePositions, treeRotations}) => {
    const mergedTreeGeometries: BufferGeometry[] = [];
    const mergedSphereGeometries: BufferGeometry[] = [];    
    tallTrees.forEach(t => {
        const sectionGeometries: TubeGeometry[] = [];
        const sectionLeaves: SphereGeometry[] = [];
        t.forEach((s, si) => {
            const vector3s = s.map(v => new Vector3(v.x, v.y, v.z));
            const curve = new CatmullRomCurve3(vector3s);
            const geometry = new TubeGeometry( curve, 8, .25 - (si * .0125), 8, false );
            sectionGeometries.push(geometry);    
            const leafSphere = new SphereGeometry(1.5, 8, 8);
            leafSphere.attributes.position.array.forEach((p, pi) => {
                if(pi % 3 === 1){
                    if(leafSphere.attributes.position.array[pi] > 0) {
                        leafSphere.attributes.position.array[pi] *= leafSphere.attributes.position.array[pi];
                    }
                }
            })
            leafSphere.scale(3.5, 2.1, 2.75);
            const leafClone0 = leafSphere.clone()
            leafSphere.translate(
                vector3s[vector3s.length -1].x,
                vector3s[vector3s.length -1].y + 1,
                vector3s[vector3s.length -1].z
            );
            leafClone0.translate(
                vector3s[vector3s.length -1].x + randomNeg1To1() * 2.5,
                vector3s[vector3s.length -1].y + randomNeg1To1() * 2.5,
                vector3s[vector3s.length -1].z + randomNeg1To1() * 2.5
            );            
            sectionLeaves.push(leafSphere);
            sectionLeaves.push(leafClone0);
        })
        mergedTreeGeometries.push(mergeGeometries(sectionGeometries));
        mergedSphereGeometries.push(mergeGeometries(sectionLeaves))
    })

    return (
        mergedTreeGeometries.map((mtg, mtgi) => (
            <group key={mtgi}>
                <mesh position={treePositions[mtgi]} rotation={treeRotations[mtgi]}>
                    <primitive object={mtg} />
                    <shaderMaterial 
                        { ...treeTrunkShaderB }
                    />
                </mesh>
                <mesh position={treePositions[mtgi]} rotation={treeRotations[mtgi]}>
                    <primitive object={mergedSphereGeometries[mtgi]} />
                    <shaderMaterial 
                        { ...treeLeafShaderC }
                    />
                </mesh>
            </group>)    
        )
    )
};

export { 
    ParkTreesA,
    ParkTreesB,
    ParkTreesC
};