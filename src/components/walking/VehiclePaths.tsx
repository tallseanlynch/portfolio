import { pathData } from './pathData';
import { 
    Line, 
    Vector3 
} from 'three';

type PointsProps = {
    points: Vector3[]
};

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
};

type VehiclePath = {
    pathLine: Line;
    crosswalkPoints?: Vector3[]
};

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
};

const VehiclePaths = () => {
    return (
        <>
            <VehiclePath 
                pathLine={pathData.vehiclePath0TurningData.line} 
                crosswalkPoints={pathData.vehiclePath0TurningData.crosswalkPoints}
            />
            <VehiclePath 
                pathLine={pathData.vehiclePath1StraightData.line} 
                crosswalkPoints={pathData.vehiclePath1StraightData.crosswalkPoints}
            />
            <VehiclePath 
                pathLine={pathData.vehiclePath2StraightData.line} 
                crosswalkPoints={pathData.vehiclePath2StraightData.crosswalkPoints}
            />
            <VehiclePath 
                pathLine={pathData.vehiclePath3StraightData.line} 
                crosswalkPoints={pathData.vehiclePath3StraightData.crosswalkPoints}
            />
            <VehiclePath 
                pathLine={pathData.vehiclePath4StraightData.line} 
                crosswalkPoints={pathData.vehiclePath4StraightData.crosswalkPoints}
            />
            <VehiclePath 
                pathLine={pathData.vehiclePath5StraightData.line} 
                crosswalkPoints={pathData.vehiclePath5StraightData.crosswalkPoints}
            />
            <VehiclePath 
                pathLine={pathData.vehiclePath6StraightData.line} 
                crosswalkPoints={pathData.vehiclePath6StraightData.crosswalkPoints}
            />
            <VehiclePath 
                pathLine={pathData.vehiclePath7TurningData.line} 
                crosswalkPoints={pathData.vehiclePath7TurningData.crosswalkPoints}
            />
            <VehiclePath 
                pathLine={pathData.vehiclePath8TurningData.line} 
                crosswalkPoints={pathData.vehiclePath8TurningData.crosswalkPoints}
            />
            <VehiclePath 
                pathLine={pathData.vehiclePath9TurningData.line} 
                crosswalkPoints={pathData.vehiclePath9TurningData.crosswalkPoints}
            />
            <VehiclePath 
                pathLine={pathData.vehiclePath10TurningData.line} 
                crosswalkPoints={pathData.vehiclePath10TurningData.crosswalkPoints}
            />
            <VehiclePath 
                pathLine={pathData.vehiclePath11TurningData.line} 
                crosswalkPoints={pathData.vehiclePath11TurningData.crosswalkPoints}
            />
        </>
    )
};

export { VehiclePaths };