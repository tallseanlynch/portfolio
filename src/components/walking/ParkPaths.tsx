import {
    Color,
    DoubleSide,
    PlaneGeometry,
    Shape,
    ShapeGeometry
} from 'three';

const pathWidth = 10;
const pathDepth = 110;
const rotatedPlaneGeometry = new PlaneGeometry(pathWidth, pathDepth, 1, 1);
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

const ParkPathA = () => {
    return (
        <>
            <mesh position={[37.5, .05, -15]}>
                <primitive object={parkPathShapeGeometry} />
                <meshBasicMaterial color={parkPathColor} side={DoubleSide}/>
            </mesh>
        </>
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

const ParkPathB = () => {
    return (
        <>
            <mesh position={[-150, .3, 37.5]}>
                <primitive object={parkPathShapeGeometry1} />
                <meshBasicMaterial color={parkPathColor1} side={DoubleSide}/>
            </mesh>
        </>
    )
};

export {
    ParkPathA,
    ParkPathB
};