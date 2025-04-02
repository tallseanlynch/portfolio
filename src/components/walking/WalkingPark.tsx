import { trees, tallTrees } from './parkTrees';
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

const randomNeg1To1 = () => (Math.random() -.5) * 2;

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
            <mesh position={[37.5, .05, -15]}>
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
            <mesh position={[100, .025, 0]}>
                <primitive object={rotatedGrassGeometry.clone()} />
                <meshBasicMaterial color={parkGrassColor} />
            </mesh>
        </group>
    )
}

const parkTreesColor = new Color(0x4f772d);
const parkTreeTrunkColor = new Color(0xa04000);
const parkTreeBColor = new Color(0x57cc99);
const parkTreeColorCold = new Color(0x005f73);
const parkTreeTrunkColorWarm = new Color(0xffba08);
const parkTreeBTrunkColor = new Color(0x5f0f40);
const parkTreeCColor = new Color(0xabc798);

const treeTrunkShaderA = {
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
            vec4 finalColor = mix(baseColor, baseWarmColor, vPosition.y / 10.0);

            gl_FragColor = finalColor;
        }
    `,
    uniforms: {
        uColor: { value: parkTreeTrunkColor },
        uWarmColor: { value: parkTreeTrunkColorWarm }
    }
}    

const treeTrunkShaderB = {
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
            vec4 finalColor = mix(baseColor, baseWarmColor, vPosition.y / 10.0);

            gl_FragColor = finalColor;
        }
    `,
    uniforms: {
        uColor: { value: parkTreeBTrunkColor },
        uWarmColor: { value: parkTreeTrunkColor }
    }
}    

const treeLeafShaderA = {
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

const treeLeafShaderB = {
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
            // gl_FragColor = vec4(vUv.x, vUv.y, 0.0, 1.0);
        }
    `,
    uniforms: {
        uColor: { value: parkTreeBColor },
        uWarmColor: { value: parkTreeColorCold }
    }
}    

const treeLeafShaderC = {
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
            // gl_FragColor = vec4(vUv.x, vUv.y, 0.0, 1.0);
        }
    `,
    uniforms: {
        uColor: { value: parkTreeColorCold },
        uWarmColor: { value: parkTreeCColor }
    }
}    

const ParkTreesA = ({treePositions, treeRotations}) => {
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
}

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
}

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
}

const treePositionsA0 = [
    new Vector3(40, 0, -10),
    new Vector3(40, 0, 20),
    new Vector3(60, 0, 20),
    new Vector3(60, 0, 10),
    new Vector3(50, 0, 5),
    new Vector3(40, 0, 5)
]

const treeRotationsA0 = [
    new Euler(0, Math.PI * .5, 0),
    new Euler(0, 0, 0),
    new Euler(0, Math.PI * .5, 0),
    new Euler(0, 0, 0),
    new Euler(0, Math.PI * .5, 0),
    new Euler(0, 0, 0)
]

const treePositionsA1 = [
    new Vector3(70, 0, 22),
    new Vector3(80, 0, 22),
    new Vector3(60, 15, 18),
    new Vector3(70, 0, -22),
    new Vector3(100, 0, -5),
    new Vector3(100, 0, -15)
]

const treeRotationsA1 = [
    new Euler(0, Math.PI, 0),
    new Euler(0, Math.PI, 0),
    new Euler(0, Math.PI * .5, 0),
    new Euler(0, 0, 0),
    new Euler(0, Math.PI * .5, 0),
    new Euler(0, 0, 0)
]

const treePositionsB0 = [
    new Vector3(40, 0, -5),
    new Vector3(90, 0, -15),
    new Vector3(75, 0, 10),
    new Vector3(100, 0, 20),
    new Vector3(50, 0, 20),
    new Vector3(38, 0, 15)
]

const treeRotationsB0 = [
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, Math.PI * .25, 0)
]

const treePositionsB1 = [
    new Vector3(80, 0, -15),
    new Vector3(90, 0, -20),
    new Vector3(115, 0, -20),
    new Vector3(85, 0, 15),
    new Vector3(50, 0, 15),
    new Vector3(80, 10, -15)
]

const treeRotationsB1 = [
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, -Math.PI, 0),
    new Euler(0, Math.PI, 0),
    new Euler(0, 0, 0)
]

const treePositionsC0 = [
    new Vector3(120, 0, -5),
    new Vector3(90, 0, -15),
    new Vector3(75, 0, 10),
    new Vector3(100, 0, 20),
    new Vector3(130, 0, -20),
    new Vector3(90, 0, 15)
]

const treeRotationsC0 = [
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, Math.PI * .25, 0)
]

const WalkingPark = () => {

    return (
        <group>
            <ParkGrass />            
            <ParkPath />
            {/* <TreeGenerator /> */}
            <ParkTreesA treePositions={treePositionsA0} treeRotations={treeRotationsA0}/>
            <ParkTreesA treePositions={treePositionsA1} treeRotations={treeRotationsA1}/>
            <ParkTreesB treePositions={treePositionsB0} treeRotations={treeRotationsB0}/>
            <ParkTreesB treePositions={treePositionsB1} treeRotations={treeRotationsB1}/>
            <ParkTreesC treePositions={treePositionsC0} treeRotations={treeRotationsC0}/>
        </group>
    )
};

export { WalkingPark };