import { 
    Color,
    DoubleSide,
    PlaneGeometry,
    Shape,
    ShapeGeometry
} from 'three';

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
                {/* <primitive object={rotatedPlaneGeometry.clone()} /> */}
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

const WalkingPark = () => {

    return (
        <group>
            <ParkGrass />            
            <ParkPath />
        </group>
    )
};

export { WalkingPark };