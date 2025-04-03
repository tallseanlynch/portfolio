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


const rotatedGrassGeometry1 = new PlaneGeometry(125, 125, 1, 1);
rotatedGrassGeometry1.rotateX(-Math.PI / 2);

const ParkGrass1 = () => {
    return (
        <group>
            <mesh position={[-100, .25, 100]}>
                <primitive object={rotatedGrassGeometry1} />
                <meshBasicMaterial color={parkGrassColor} />
            </mesh>
        </group>
    )
}

const rotatedGrassGeometry2 = new PlaneGeometry(125, 125, 1, 1);
rotatedGrassGeometry2.rotateX(-Math.PI / 2);

const ParkGrass2 = () => {
    return (
        <group>
            <mesh position={[-100, .25, -100]}>
                <primitive object={rotatedGrassGeometry2} />
                <meshBasicMaterial color={parkGrassColor} />
            </mesh>
        </group>
    )
}


const parkPathColor1 = new Color(0x91b500);
const parkPathShape1 = new Shape()
    .moveTo(0, 0)
    .lineTo(30, 0)
    .lineTo(112, -90)
    .lineTo(112, -115)

const parkPathShapeGeometry1 = new ShapeGeometry(parkPathShape1);
parkPathShapeGeometry1.rotateX(-Math.PI / 2);

const ParkPath1 = () => {
    return (
        <>
            <mesh position={[-150, .3, 37.5]}>
                <primitive object={parkPathShapeGeometry1} />
                <meshBasicMaterial color={parkPathColor1} side={DoubleSide}/>
            </mesh>
        </>
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

const treePositionsC1 = [
    new Vector3(-60, 0, 55),
    new Vector3(-95, 0, 45),
    new Vector3(-45, 0, 70),
    new Vector3(-70, 0, 85),
    new Vector3(-70, 0, 50),
    new Vector3(-90, 0, 65)
]

const treeRotationsC1 = [
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, Math.PI * .25, 0)
]

const treePositionsC2 = [
    new Vector3(-60, 0, 95),
    new Vector3(-95, 0, 130),
    new Vector3(-115, 0, 120),
    new Vector3(-120, 0, 85),
    new Vector3(-100, 0, 110),
    new Vector3(-110, 0, 105)
]

const treeRotationsC2 = [
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, Math.PI * .25, 0),
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0)
]

const treePositionsC3 = [
    new Vector3(-111, 0, 43),
    new Vector3(-80, 0, 73),
    new Vector3(-56, 0, 77),
    new Vector3(-130, 0, 70),
    new Vector3(-65, 0, 40),
    new Vector3(-62, 0, 131)
]

const treeRotationsC3 = [
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, Math.PI * .25, 0),
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0)
]

const treePositionsB2 = [
    new Vector3(-50, 0, 55),
    new Vector3(-85, 0, 45),
    new Vector3(-55, 0, 70),
    new Vector3(-50, 0, 85),
    new Vector3(-50, 0, 40),
    new Vector3(-70, 0, 55)
]

const treeRotationsB2 = [
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, Math.PI * .25, 0),
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, 0, 0)
]

const treePositionsB3 = [
    new Vector3(-70, 0, 95),
    new Vector3(-95, 0, 130),
    new Vector3(-115, 0, 120),
    new Vector3(-90, 0, 105),
    new Vector3(-100, 0, 90),
    new Vector3(-110, 0, 95)
]

const treeRotationsB3 = [
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, Math.PI * .25, 0),
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0)
]

const treePositionsB4 = [
    new Vector3(-70, 10, 95),
    new Vector3(-95, 5, 130),
    new Vector3(-115, 15, 120),
    new Vector3(-90, 10, 105),
    new Vector3(-100, 10, 90),
    new Vector3(-110, 15, 95)
]

const treeRotationsB4 = [
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, Math.PI * .25, 0),
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0)
].reverse()

const treePositionsB5 = [
    new Vector3(-38, 0, 112),
    new Vector3(-45, 0, 95),
    new Vector3(-40, 0, 90),
    new Vector3(-40, 0, 105),
    new Vector3(-44, 0, 60),
    new Vector3(-60, 0, 45)
]

const treeRotationsB5 = [
    new Euler(0, Math.PI * .25, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0)
].reverse()


const treePositionsA2 = [
    new Vector3(-50, 0, 105),
    new Vector3(-85, 0, 55),
    new Vector3(-65, 0, 70),
    new Vector3(-60, 0, 85),
    new Vector3(-40, 0, 45),
    new Vector3(-75, 0, 65)
]

const treeRotationsA2 = [
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, Math.PI * .25, 0),
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, 0, 0)
]

const treePositionsA3 = [
    new Vector3(-50, 0, 95),
    new Vector3(-75, 0, 120),
    new Vector3(-95, 0, 120),
    new Vector3(-85, 0, 110),
    new Vector3(-100, 0, 100),
    new Vector3(-120, 0, 95)
]

const treeRotationsA3 = [
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, Math.PI * .25, 0),
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0)
]

const treePositionsA4 = [
    new Vector3(-42, 0, 52),
    new Vector3(-42, 0, 80),
    new Vector3(-40, 0, 120),
    new Vector3(-45, 0, 110),
    new Vector3(-100, 0, 100),
    new Vector3(-45, 10, 110)
]

const treeRotationsA4 = [
    new Euler(0, Math.PI * .25, 0),
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0)
]

//----

const treePositionsA5 = [
    new Vector3(-135, 0, -43),
    new Vector3(-90, 0, -41),
    new Vector3(-88, 0, -60),
    new Vector3(-51, 0, -43),
    new Vector3(-42, 0, -64),
    new Vector3(-42, 0, -110)
]

const treeRotationsA5 = [
    new Euler(0, Math.PI * .25, 0),
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0)
]

const treePositionsA6 = [
    new Vector3(-39, 0, -113),
    new Vector3(-87, 0, -70),
    new Vector3(-88, 0, -48),
    new Vector3(-79, 0, -40),
    new Vector3(-42, 0, -41),
    new Vector3(-40.5, 0, -90)
]

const treeRotationsA6 = [
    new Euler(0, Math.PI * .25, 0),
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0)
]

const treePositionsB6 = [
    new Vector3(-125, 0, -45),
    new Vector3(-106, 0, -42),
    new Vector3(-81, 0, -70),
    new Vector3(-79, 0, -51),
    new Vector3(-41, 0, -47),
    new Vector3(-72, 0, -41)
]

const treeRotationsB6 = [
    new Euler(0, Math.PI * .25, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0)
].reverse()

const treePositionsB7 = [
    new Vector3(-83, 0, -42),
    new Vector3(-42, 0, -54),
    new Vector3(-73, 0, -68),
    new Vector3(-90, 0, -68),
    new Vector3(-40, 0, -105),
    new Vector3(-113, 0, -46)
]

const treeRotationsB7 = [
    new Euler(0, Math.PI * .25, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0)
].reverse()


const treePositionsC4 = [
    new Vector3(-40, 0, -122),
    new Vector3(-54, 0, -108),
    new Vector3(-117, 0, -44),
    new Vector3(-78, 0, -78),
    new Vector3(-75, 0, -55),
    new Vector3(-85, 0, -82)
]

const treeRotationsC4 = [
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0)
]

const treePositionsC5 = [
    new Vector3(-48, 0, -79),
    new Vector3(-45, 0, -95),
    new Vector3(-45, 0, -79),
    new Vector3(-64, 0, -43),
    new Vector3(-100, 0, -42),
    new Vector3(-96, 0, -43)
]

const treeRotationsC5 = [
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0)
]


const WalkingPark = ({groupPosition = new Vector3(0,0,0)}) => {

    return (
        <group position={groupPosition}>
            <ParkGrass />
            <ParkPath />
            {/* <TreeGenerator /> */}
            <ParkTreesA treePositions={treePositionsA0} treeRotations={treeRotationsA0}/>
            <ParkTreesA treePositions={treePositionsA1} treeRotations={treeRotationsA1}/>
            <ParkTreesB treePositions={treePositionsB0} treeRotations={treeRotationsB0}/>
            <ParkTreesB treePositions={treePositionsB1} treeRotations={treeRotationsB1}/>
            <ParkTreesC treePositions={treePositionsC0} treeRotations={treeRotationsC0}/>

            <ParkGrass1 />
            <ParkPath1 />
            <ParkTreesA treePositions={treePositionsA2} treeRotations={treeRotationsA2}/>
            <ParkTreesA treePositions={treePositionsA3} treeRotations={treeRotationsA3}/>
            <ParkTreesA treePositions={treePositionsA4} treeRotations={treeRotationsA4}/>
            <ParkTreesB treePositions={treePositionsB2} treeRotations={treeRotationsB2}/>
            <ParkTreesB treePositions={treePositionsB3} treeRotations={treeRotationsB3}/>
            <ParkTreesB treePositions={treePositionsB4} treeRotations={treeRotationsB4}/>
            <ParkTreesB treePositions={treePositionsB5} treeRotations={treeRotationsB5}/>
            <ParkTreesC treePositions={treePositionsC1} treeRotations={treeRotationsC1}/>
            <ParkTreesC treePositions={treePositionsC2} treeRotations={treeRotationsC2}/>
            <ParkTreesC treePositions={treePositionsC3} treeRotations={treeRotationsC3}/>

            <ParkTreesA treePositions={treePositionsA5} treeRotations={treeRotationsA5}/>
            <ParkTreesA treePositions={treePositionsA6} treeRotations={treeRotationsA6}/>
            <ParkTreesB treePositions={treePositionsB6} treeRotations={treeRotationsB6}/>
            <ParkTreesB treePositions={treePositionsB7} treeRotations={treeRotationsB7}/>
            <ParkTreesC treePositions={treePositionsC4} treeRotations={treeRotationsC4}/>
            <ParkTreesC treePositions={treePositionsC5} treeRotations={treeRotationsC5}/>

            <ParkGrass2 />
        </group>
    )
};

export { WalkingPark };