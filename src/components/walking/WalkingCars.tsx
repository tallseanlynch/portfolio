import { BufferGeometry, EllipseCurve, Line, LineBasicMaterial, Vector3 } from 'three';

const carSize = 2;
const carColor0 = 0xff0000;
const carColor1 = 0x00ff00;

const ProtoCar = ({pos, color = carColor0}) => {
    return (
        <mesh position={pos}>
            <boxGeometry args={[2.5, carSize, 5.0]} />
            <meshBasicMaterial color={color} transparent={true} opacity={.5}/>
        </mesh>
    )
}

const turningMaterial = new LineBasicMaterial({
    color: 0xff0000
});

const straightMaterial = new LineBasicMaterial({
    color: 0x00ffff
});

const xVisualModifier = new Vector3(0.2, 0, 0);
const zVisualModifier = new Vector3(0, 0, 0.2);

type PointsProps = {
    points: Vector3[]
}

// debug mesh for cross walk points
const CrosswalkPoints: React.FC<PointsProps> = ({points = []}) => {
    return (
        points.map((cwp, cwpindex) => {
            return (
                <mesh key={cwpindex} position={cwp}>
                    <boxGeometry args={[.5, .5, .5]} />
                    <meshBasicMaterial color={0x0000ff} />
                </mesh>
            )            
        })
    )
}

// debug mesh for turning points
const TurningPoints: React.FC<PointsProps> = ({points = []}) => {
    return (
        points.map((tp, tpindex) => {
            return (
                <mesh key={tpindex} position={tp}>
                    <boxGeometry args={[.5, .5, .5]} />
                    <meshBasicMaterial color={0x00ff00} />
                </mesh>
            )            
        })
    )
}

//carPath(-25, 25, 7.5, 7.5, -Math.PI * .5, 0, false, 0)
const vehiclePath0 = {
    ellipseCenterX: -25,
    ellipseCenterY: 25,
    radiusX: 12.5,
    radiusY: 12.5,
    startAngle: -Math.PI * .5,
    endAngle: 0,
    clockWise: false,
    rotation: 0,
    directionalPointA: new Vector3(-130, 0, 0),
    directionalPointB: new Vector3(0, 0, 130),
    crossWalkPointA: new Vector3(-15, 0, 0),
    crossWalkPointB: new Vector3(0, 0, 15),
    straightEndPoint: new Vector3(0, 0, 115),
    straightOppositeEndPoint: new Vector3(0, 0, -195),
    visualModifier: new Vector3(.2, 0, 0)
}

const vehiclePath1 = {
    ellipseCenterX: -25,
    ellipseCenterY: 25,
    radiusX: 7.5,
    radiusY: 7.5,
    startAngle: -Math.PI * .5,
    endAngle: 0,
    clockWise: false,
    rotation: 0,
    directionalPointA: new Vector3(-130, 0, 0),
    directionalPointB: new Vector3(0, 0, 130),
    crossWalkPointA: new Vector3(-15, 0, 0),
    crossWalkPointB: new Vector3(0, 0, 15),
    straightEndPoint: new Vector3(0, 0, 115),
    straightOppositeEndPoint: new Vector3(0, 0, -195),
    visualModifier: new Vector3(.2, 0, 0)
}


const VehiclePath = ({
    ellipseCenterX = 0,
    ellipseCenterY = 0,
    radiusX = 0,
    radiusY = 0,
    startAngle = 0,
    endAngle = 0,
    clockWise = false,
    rotation = 0,
    directionalPointA = new Vector3(),
    directionalPointB = new Vector3(),
    crossWalkPointA = new Vector3(),
    crossWalkPointB = new Vector3(),
    straightEndPoint = new Vector3(),
    straightOppositeEndPoint = new Vector3(),
    visualModifier = new Vector3()
}) => {
    const ellipse = new EllipseCurve(
        ellipseCenterX, ellipseCenterY, // center x, y
        radiusX, radiusY, // radius x, y
        startAngle, endAngle, // start angle, end angle
        clockWise, // clockwise
        rotation // rotation
    );

    const ellipsePoints = ellipse.getPoints(8);
    const ellipsePoints3D = ellipsePoints.map(ep => new Vector3(ep.x, 0.1, ep.y));

    const crosswalkPointA = ellipsePoints3D[0].clone();
    crosswalkPointA.add(crossWalkPointA);
    const directionalEndPointA = ellipsePoints3D[0].clone();
    directionalEndPointA.add(directionalPointA);

    const crosswalkPointB = ellipsePoints3D[ellipsePoints3D.length - 1].clone();
    crosswalkPointB.add(crossWalkPointB);
    const directionalEndPointB = ellipsePoints3D[ellipsePoints3D.length - 1].clone();
    directionalEndPointB.add(directionalPointB);

    const crosswalkPoints = [
        crosswalkPointA,
        crosswalkPointB
    ]
    
    const turningPoints = [
        ellipsePoints3D[ellipsePoints3D.length - 1],
        ellipsePoints3D[0].clone()
    ]

    const straightGeometryPoints = [
        crosswalkPointB.clone().add(straightOppositeEndPoint).add(visualModifier),
        crosswalkPointB.clone().add(visualModifier),
        crosswalkPointB.clone().add(straightEndPoint).add(visualModifier)    
    ]

    const straightGeometry = new BufferGeometry().setFromPoints( straightGeometryPoints );
    const straightLine = new Line( straightGeometry, straightMaterial );

    const turningGeometryPoints = [ directionalEndPointA, crosswalkPointA, ...ellipsePoints3D, directionalEndPointB, crosswalkPointB ];
    const turningGeometry = new BufferGeometry().setFromPoints( turningGeometryPoints );
    const turningLine = new Line( turningGeometry, turningMaterial );

    return (
        <>
            <CrosswalkPoints points={crosswalkPoints}/>
            <TurningPoints points={turningPoints}/>
            <primitive object={turningLine} />
            <primitive object={straightLine} />
        </>
    )

}

const WalkingCars = () => {
    return (
        <>
            <VehiclePath {...vehiclePath0} />
            <VehiclePath {...vehiclePath1} />
            <group position={new Vector3(-20, 0, 40)}>
                <ProtoCar pos={new Vector3(2.5, (carSize / 2.0) + .25, 0)} color={carColor1} />
                <ProtoCar pos={new Vector3(7.5, (carSize / 2.0) + .25, 0)} color={carColor1} />
                <ProtoCar pos={new Vector3(12.5, (carSize / 2.0) + .25, 0)} color={carColor1} />
                <ProtoCar pos={new Vector3(17, (carSize / 2.0) + .25, 0)} color={carColor1} />
            </group>
            <group position={new Vector3(3, 0, 40)}>
                <ProtoCar pos={new Vector3(0, (carSize / 2.0) + .25, 0)} />
                <ProtoCar pos={new Vector3(4.5, (carSize / 2.0) + .25, 0)} />
                <ProtoCar pos={new Vector3(9.5, (carSize / 2.0) + .25, 0)} />
                <ProtoCar pos={new Vector3(14.5, (carSize / 2.0) + .25, 0)} />
            </group>
        </>
    )
}

export { WalkingCars };