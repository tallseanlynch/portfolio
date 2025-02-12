import {
    Vector3,
    Euler
} from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import {
    blackColor,
    ambientLightColor
} from './romeColors';
import { RomeWalls } from './RomeWalls';
import { RomeArch } from './RomeArch';
import { RomeGround } from './RomeGround';
import { RomeTrees } from './RomeTrees';
import { RomeBushes } from './RomeBushes';
import { RomeLights } from './RomeLights';
import { RomeRain } from './RomeRain';

const RomeShader: React.FC = (): JSX.Element => {

    return (
        <group position={[0, -.5, 0]}>
            <ambientLight
                color={ambientLightColor}
                intensity={1}
            />
            <RomeRain />
            <RomeArch />
            <RomeWalls />
            <RomeGround />
            <RomeTrees />
            <RomeBushes groupPosition={new Vector3(0, 0.25, -1)} />
            <RomeBushes
                groupPosition={new Vector3(-1, 0.25, .1)}
                groupRotation={new Euler(0, Math.PI * .35, 0)}
            />
            <RomeBushes
                groupPosition={new Vector3(1, 0.25, .1)}
                groupRotation={new Euler(0, Math.PI * -.35, 0)}
            />
            <RomeLights />
        </group>
    )
};

interface RomeShaderCanvasProps {
    classNames?: string
};

const RomeShaderCanvas: React.FC<RomeShaderCanvasProps> = ({
    classNames = ''
}) => {
    return (
        <Canvas
            scene={{ background: blackColor }}
            shadows
            camera={{ position: new Vector3(0, .01, 2.5) }}
            className={classNames}
        >
            <RomeShader />
            <OrbitControls
                enableDamping={true}
                dampingFactor={0.05}
                screenSpacePanning={false}
                zoomSpeed={1}
                panSpeed={1}
                rotateSpeed={1}
            />
        </Canvas>
    )
};

export { RomeShader, RomeShaderCanvas };