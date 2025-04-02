import {
    CatmullRomCurve3,
    DoubleSide,
    TubeGeometry,
    Vector3
} from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

const randomNeg1To1 = () => (Math.random() -.5) * 2;

const generateTreeSection = ({n = 1, scale = 1, angleScale = .05, startingPoint = new Vector3(0, 0 ,0), sub=false}) => {
    const points: Vector3[] = [];
    let currentHeight = 0;
    for(let i = 0; i < n; i++) {
        const currentHeightAdj = sub === true ? 0 : 1;
        const positionVector3 = new Vector3(
            startingPoint.x + i * randomNeg1To1(), 
            i === 0 ? startingPoint.y : .1 + startingPoint.y + (currentHeight * currentHeightAdj) + Math.random() * scale, 
            startingPoint.z + i * randomNeg1To1()
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
            n: n/2, scale: scale / 4, startingPoint: branchStartingPoint, angleScale: angleScale * 6, sub: true
        }))
    }
    return sections;
};

const TreeGenerator = () => {
    const sections = generateTree({trunk: {n: 5, scale: 1.5, branches: 5, angleScale: .4, subSections: 0}});
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

export { TreeGenerator };