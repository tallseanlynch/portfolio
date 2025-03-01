import {
    pointLightColor,
    whiteColor
} from './romeColors';
import {  useLoader } from '@react-three/fiber';
import {
    DoubleSide,
    TextureLoader,
    Vector3
} from 'three';

const RomeLightMaterial: React.FC = (): JSX.Element => {
    const lightTexture0 = useLoader(TextureLoader, '/rome/light-post-0-50-compressed.png');

    return (
        <meshStandardMaterial
            color={whiteColor}
            map={lightTexture0}
            transparent={true}
            alphaTest={0.5}
            side={DoubleSide}
        />
    )
};

const RomeLight: React.FC<RomeLightProps> = ({
    position = new Vector3(0, 0, 0),
    backLight = false,
    castShadow = false
}): JSX.Element => {
    const lightPosition0 = new Vector3().copy(position).add(new Vector3(0, .5, .01));
    const lightPosition1 = new Vector3().copy(position).add(new Vector3(0, .5, -.01));

    return (
        <>
            <pointLight
                color={pointLightColor}
                position={lightPosition0}
                intensity={.2}
                castShadow={castShadow}
            />
            {
                backLight === true ?
                    <pointLight
                        color={pointLightColor}
                        position={lightPosition1}
                        intensity={.125}
                        castShadow={castShadow}
                    /> : ''
            }
            <mesh
                position={position}
            >
                <planeGeometry
                    args={[.125, 1, 1, 1]}
                />
                <RomeLightMaterial />
            </mesh>
        </>
    )
};

const RomeLights: React.FC = (): JSX.Element => {

    return (
        <>
            <RomeLight position={new Vector3(-1.75, .5, 1.5)} backLight={true} />
            <RomeLight position={new Vector3(1.75, .5, 1.5)} backLight={true} />
            <RomeLight position={new Vector3(-.75, .5, .5)} backLight={true} />
            <RomeLight position={new Vector3(.75, .5, .5)} backLight={true} />
            <RomeLight position={new Vector3(-.125, 0.25, -1)} backLight={true} />
            <RomeLight position={new Vector3(.125, 0.25, -1)} backLight={true} />
            <RomeLight position={new Vector3(-.125, 0.25, -2)} />
            <RomeLight position={new Vector3(.125, 0.25, -2)} />
            <RomeLight position={new Vector3(-.125, 0.25, -3)} />
            <RomeLight position={new Vector3(.125, 0.25, -3)} />
        </>
    )
};

export { RomeLights };