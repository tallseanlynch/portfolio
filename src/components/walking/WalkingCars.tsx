import { pathData } from './pathData';
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

const vehicleTurnPath = ({
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
    material = new LineBasicMaterial()
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
    
    const turningGeometryPoints = [ directionalEndPointA, crosswalkPointA, ...ellipsePoints3D, directionalEndPointB, crosswalkPointB ];
    const geometry = new BufferGeometry().setFromPoints( turningGeometryPoints );
    const line = new Line( geometry, material );

    return {
        geometry,
        line,
        crosswalkPoints
    }
}

const vehicleStraightPath = ({
    start = new Vector3(),
    end = new Vector3(),
    crosswalkPointA = new Vector3(),
    crosswalkPointB = new Vector3(),
    material = new LineBasicMaterial(),
    visualModifier = new Vector3()
}) => {

    const straightGeometryPoints = [
        start.add(visualModifier),
        crosswalkPointA.add(visualModifier),
        crosswalkPointB.add(visualModifier),
        end.add(visualModifier)
    ]

    const crosswalkPoints = [crosswalkPointA, crosswalkPointB];

    const geometry = new BufferGeometry().setFromPoints( straightGeometryPoints );
    const line = new Line( geometry, material );

    return {
        geometry,
        line,
        crosswalkPoints
    }
}


type VehiclePath = {
    pathLine: Line;
    crosswalkPoints?: Vector3[]
}

const VehiclePath: React.FC<VehiclePath> = ({
    pathLine,
    crosswalkPoints = undefined
}) => {
    return (
        <>
            <primitive object={pathLine} />
            {crosswalkPoints && <CrosswalkPoints points={crosswalkPoints}/>}
        </>
    )
}

const vehiclePath0Turning = vehicleTurnPath(pathData.vehiclePath0Turning);
const vehcilePath0Straight = vehicleStraightPath(pathData.vehiclePath0Straight);
const vehiclePath1Turning = vehicleTurnPath(pathData.vehiclePath1Turning);
const vehcilePath1Straight = vehicleStraightPath(pathData.vehiclePath1Straight);
// const vp0Turn = calculatedVehiclePath0.geometry;
// const vp0Straight = calculatedVehiclePath0.straightGeometry;

const WalkingCars = () => {
    return (
        <>
            <VehiclePath pathLine={vehiclePath0Turning.line} crosswalkPoints={vehiclePath0Turning.crosswalkPoints}/>
            <VehiclePath pathLine={vehcilePath0Straight.line} crosswalkPoints={vehcilePath0Straight.crosswalkPoints}/>
            <VehiclePath pathLine={vehiclePath1Turning.line} crosswalkPoints={vehiclePath1Turning.crosswalkPoints}/>
            <VehiclePath pathLine={vehcilePath1Straight.line} crosswalkPoints={vehcilePath1Straight.crosswalkPoints}/>
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