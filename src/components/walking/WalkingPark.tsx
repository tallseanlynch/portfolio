import { trees } from './parkTrees';

import {
    BufferGeometry,
    CatmullRomCurve3,
    Color,
    DoubleSide,
    Euler,
    PlaneGeometry,
    Shape,
    ShapeGeometry,
    SphereGeometry,
    TubeGeometry,
    Vector3
} from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

const crossWalkWidth = 10;
const crossWalkDepth = 110;

const rotatedPlaneGeometry = new PlaneGeometry(crossWalkWidth, crossWalkDepth, 1, 1);
rotatedPlaneGeometry.rotateX(-Math.PI / 2);

const parkPathColor = new Color(0x91b500);

const parkPathShape = new Shape()
    .moveTo(0, 0)
    .lineTo(120, -60)
    .lineTo(130, -45)
    .lineTo(20, 10)
    .lineTo(0, 10);

const parkPathShapeGeometry = new ShapeGeometry(parkPathShape);
parkPathShapeGeometry.rotateX(-Math.PI / 2);

const ParkPath = () => {
    return (
        <>
            <mesh position={[37.5, .02, -15]}>
                <primitive object={parkPathShapeGeometry} />
                <meshBasicMaterial color={parkPathColor} side={DoubleSide}/>
            </mesh>
        </>
    )
}

const rotatedGrassGeometry = new PlaneGeometry(125, 50, 1, 1);
rotatedGrassGeometry.rotateX(-Math.PI / 2);
const parkGrassColor = new Color(0x58d68d);

const ParkGrass = () => {
    return (
        <group>
            <mesh position={[100, .01, 0]}>
                <primitive object={rotatedGrassGeometry.clone()} />
                <meshBasicMaterial color={parkGrassColor} />
            </mesh>
        </group>
    )
}

const generateTreeSection = ({n = 1, scale = 1, angleScale = .05, startingPoint = new Vector3(0, 0 ,0)}) => {
    const points: Vector3[] = [];
    let currentHeight = 0;
    for(let i = 0; i < n; i++) {
        const positionVector3 = new Vector3(
            startingPoint.x + i * Math.sin(Math.random() * Math.PI * angleScale), 
            i === 0 ? startingPoint.y : .1 + startingPoint.y + currentHeight + Math.random() * scale, 
            startingPoint.z + i * Math.sin(Math.random() * Math.PI * angleScale)
        );
        currentHeight += positionVector3.y - currentHeight;
        points.push(positionVector3);
    }
    return points;
}

const generateTree = ({trunk = {n: 5, scale: 2, branches: 2, angleScale: .1, subSections: 5}}) => {
    const { n, scale, branches, angleScale, subSections } = trunk;
    const sections: Vector3[][] = []
    const generatedTrunk = generateTreeSection({n, scale});
    sections.push(generatedTrunk);
    for(let b = 0; b < branches; b++) {
        const randomIndex = 1 + Math.floor(Math.random() * generatedTrunk.length - 1);
        const branchStartingPoint = generatedTrunk[randomIndex];
        sections.push(generateTreeSection({
            n: n, scale: scale / 2, startingPoint: branchStartingPoint, angleScale: angleScale * 3
        }))
    }
    for(let subs = 0; subs < subSections; subs++) {
        const randomSection = sections[Math.floor(Math.random() * sections.length)];
        const randomIndex = 1 + Math.floor(Math.random() * randomSection.length - 1);
        const branchStartingPoint = randomSection[randomIndex];
        sections.push(generateTreeSection({
            n: n/2, scale: scale / 4, startingPoint: branchStartingPoint, angleScale: angleScale * 6
        }))
    }
    return sections;
};

const TreeGenerator = () => {
    const sections = generateTree({trunk: {n: 5, scale: 1.1, branches: 5, angleScale: .4, subSections: 5}});
    const sectionGeometries: TubeGeometry[] = [];
   console.log(JSON.stringify(sections));
    sections.forEach((s, si) => {
        const curve = new CatmullRomCurve3(s);
        const geometry = new TubeGeometry( curve, 8, .25 - (si * .025), 8, false );
        sectionGeometries.push(geometry);
    })
    const mergedSections = mergeGeometries(sectionGeometries)
    return (<group>
        <mesh>
            <primitive object={mergedSections} />
            <meshBasicMaterial color={0xa04000} side={DoubleSide}/>
        </mesh>
    </group>)
}

const parkTreesColor = new Color(0x4f772d);
const parkTreeTrunkColor = new Color(0xa04000);
// const parkTreeTrunkColorWarm = new Color(0xbb3e03);
const parkTreeTrunkColorWarm = new Color(0xffba08);

const treeTrunkShader = {
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uWarmColor;
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
            vec4 whiteColor = vec4(1.0, 1.0, 1.0, 1.0);
            vec4 transparentColor = vec4(0.0, 0.0, 0.0, 0.0);
            vec4 baseColor = vec4(uColor, 1.0);
            vec4 baseWarmColor = vec4(uWarmColor, 1.0);
            vec4 finalColor = mix(baseColor, baseWarmColor, vPosition.y / 20.0);

            gl_FragColor = finalColor;
        }
    `,
    uniforms: {
        uColor: { value: parkTreeTrunkColor },
        uWarmColor: { value: parkTreeTrunkColorWarm }
    }
}    

const treeLeafShader = {
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uWarmColor;
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
            vec4 whiteColor = vec4(1.0, 1.0, 1.0, 1.0);
            vec4 transparentColor = vec4(0.0, 0.0, 0.0, 0.0);
            vec4 baseColor = vec4(uColor, 1.0);
            vec4 baseWarmColor = vec4(uWarmColor, 1.0);
            vec4 finalColor = mix(baseColor, baseWarmColor, vPosition.y / 40.0);

            gl_FragColor = finalColor;
            // gl_FragColor = vec4(vUv.x, vUv.y, 0.0, 1.0);
        }
    `,
    uniforms: {
        uColor: { value: parkTreesColor },
        uWarmColor: { value: parkTreeTrunkColorWarm }
    }
}    

const ParkTrees = ({treePositions, treeRotations}) => {
    // console.log(trees);
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
                        { ...treeTrunkShader }
                    />
                    {/* <meshBasicMaterial color={parkTreeTrunkColors} side={DoubleSide}/> */}
                </mesh>
                <mesh position={treePositions[mtgi]} rotation={treeRotations[mtgi]}>
                    <primitive object={mergedSphereGeometries[mtgi]} />
                    <shaderMaterial 
                        { ...treeLeafShader }
                    />
                    {/* <meshBasicMaterial color={parkTreesColor} side={DoubleSide}/> */}
                </mesh>
            </group>)    
        )
    )
}

const treePositionsA = [
    new Vector3(40, 0, -10),
    new Vector3(40, 0, 20),
    new Vector3(60, 0, 20),
    new Vector3(60, 0, 10),
    new Vector3(50, 0, 5),
    new Vector3(40, 0, 5)
]

const treeRotationsA = [
    new Euler(0, Math.PI * .5, 0),
    new Euler(0, 0, 0),
    new Euler(0, Math.PI * .5, 0),
    new Euler(0, 0, 0),
    new Euler(0, Math.PI * .5, 0),
    new Euler(0, 0, 0)
]

const treePositionsB = [
    new Vector3(40, 0, 0),
    new Vector3(90, 0, -15),
    new Vector3(110, 0, -20),
    new Vector3(100, 0, 20),
    new Vector3(100, 0, -5),
    new Vector3(38, 0, 15)
]

const treeRotationsB = [
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, Math.PI * .5, 0)
]

const WalkingPark = () => {

    return (
        <group>
            <ParkGrass />            
            <ParkPath />
            {/* <TreeGenerator /> */}
            <ParkTrees treePositions={treePositionsA} treeRotations={treeRotationsA}/>
            <ParkTrees treePositions={treePositionsB} treeRotations={treeRotationsB}/>
        </group>
    )
};

export { WalkingPark };