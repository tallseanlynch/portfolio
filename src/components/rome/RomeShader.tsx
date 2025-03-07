import {
    blackColor,
    ambientLightColor
} from './romeColors';
import { 
    Canvas, 
    useFrame 
} from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { RomeArch } from './RomeArch';
import { RomeBushes } from './RomeBushes';
import { RomeDistanceRing } from './RomeDistanceRing';
import { RomeGround } from './RomeGround';
import { RomeLightningBolt } from './RomeLightningBolt';
import { RomeLights } from './RomeLights';
import { RomeRain } from './RomeRain';
import { RomeTrees } from './RomeTrees';
import { RomeWalls } from './RomeWalls';
import {
    Euler,
    Vector3
} from 'three';

const RomeShader: React.FC = (): JSX.Element => {
    useFrame(({camera }) => {
        if (camera.position.y < -1) camera.position.y = -1; // Enforce y > 0
    });

    return (
        <>
            <OrbitControls
                enableDamping={true}
                dampingFactor={0.05}
                screenSpacePanning={false}
                zoomSpeed={1}
                panSpeed={1}
                rotateSpeed={1}
                maxPolarAngle={Math.PI/1.8}
                maxDistance={2.25}
            />
            <group position={[0, -.5, 0]}>
                <ambientLight
                    color={ambientLightColor}
                    intensity={1.5}
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
                <RomeLightningBolt />
                <RomeDistanceRing />
            </group>
        </>
    )
};

const RomeShaderCanvas: React.FC = (): JSX.Element => {

    return (
        <Canvas
            scene={{ background: blackColor }}
            camera={{ position: new Vector3(0, .01, 2.5) }}
        >
            <RomeShader />
        </Canvas>
    )
};

export { RomeShader, RomeShaderCanvas };