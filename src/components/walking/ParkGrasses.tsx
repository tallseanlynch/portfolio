import {
    Color,
    PlaneGeometry
} from 'three';

const rotatedGrassGeometry = new PlaneGeometry(125, 50, 1, 1);
rotatedGrassGeometry.rotateX(-Math.PI / 2);
const parkGrassColor = new Color(0x58d68d);

const ParkGrassA = () => {
    return (
        <group>
            <mesh position={[100, .025, 0]}>
                <primitive object={rotatedGrassGeometry.clone()} />
                <meshBasicMaterial color={parkGrassColor} />
            </mesh>
        </group>
    )
};

const rotatedGrassGeometry1 = new PlaneGeometry(125, 125, 1, 1);
rotatedGrassGeometry1.rotateX(-Math.PI / 2);

const ParkGrassB = () => {
    return (
        <group>
            <mesh position={[-100, .25, 100]}>
                <primitive object={rotatedGrassGeometry1} />
                <meshBasicMaterial color={parkGrassColor} />
            </mesh>
        </group>
    )
};

const rotatedGrassGeometry2 = new PlaneGeometry(125, 125, 1, 1);
rotatedGrassGeometry2.rotateX(-Math.PI / 2);

const ParkGrassC = () => {
    return (
        <group>
            <mesh position={[-100, .25, -100]}>
                <primitive object={rotatedGrassGeometry2} />
                <meshBasicMaterial color={parkGrassColor} />
            </mesh>
        </group>
    )
};

export {
    ParkGrassA,
    ParkGrassB,
    ParkGrassC
};