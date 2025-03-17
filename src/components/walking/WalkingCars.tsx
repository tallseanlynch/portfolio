import { Vector3 } from 'three';

const carSize = 2;
const carColor0 = 0xff0000;
const carColor1 = 0x00ff00;

const ProtoCar = ({pos, color = carColor0}) => {
    return (
        <mesh position={pos}>
            <boxGeometry args={[2.5, carSize, 5.0]} />
            <meshStandardMaterial color={color} />
        </mesh>
    )
}

const WalkingCars = () => {
    return (
        <>
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