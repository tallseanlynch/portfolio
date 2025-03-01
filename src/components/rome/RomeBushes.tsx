import { whiteColor } from './romeColors';
import { useLoader } from '@react-three/fiber';
import {
    DoubleSide,
    Euler,
    TextureLoader,
    Vector3
} from 'three';

const RomeBushMaterial: React.FC = (): JSX.Element => {
    const bushTexture0 = useLoader(TextureLoader, '/rome/bush-0-50-compressed.png')
    
    return (
        <meshStandardMaterial
            color={whiteColor}
            map={bushTexture0}
            transparent={true}
            alphaTest={0.5}
            side={DoubleSide}
        />
    )
};

const RomeBush: React.FC<RomeBushProps> = ({
    position = new Vector3(0, 0, 0),
    planeArgs = [1, 1, 1, 1],
    rotation = new Euler(0, 0, 0)
}) => {

    return (
        <mesh
            position={position}
            rotation={rotation}
        >
            <planeGeometry
                args={planeArgs}
            />
            <RomeBushMaterial />
        </mesh>
    )
};

const RomeBushes: React.FC<RomeBushesProps> = ({
    groupPosition = new Vector3(0, 0, 0),
    groupRotation = new Euler(0, 0, 0)
}): JSX.Element => {

    return (
        <group
            position={groupPosition}
            rotation={groupRotation}
        >
            <RomeBush
                position={new Vector3(-.75, -.125, 0.2)}
                planeArgs={[1, .35, 1, 1]}
            />
            <RomeBush
                position={new Vector3(-1.25, 0, -0.2)}
                planeArgs={[1.25, .75, 1, 1]}
                rotation={new Euler(0, Math.PI, 0)}
            />
            <RomeBush
                position={new Vector3(.75, -.125, 0.2)}
                planeArgs={[1, .35, 1, 1]}
            />
            <RomeBush
                position={new Vector3(1.25, 0, -0.2)}
                planeArgs={[1.25, .75, 1, 1]}
                rotation={new Euler(0, Math.PI, 0)}
            />
        </group>
    )
};

export { RomeBushes };