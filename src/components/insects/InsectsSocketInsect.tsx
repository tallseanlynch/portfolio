import {
    useState,
    useRef
} from 'react';
import {
    useFrame,
    Vector3 as Vector3Type,
    Euler as EulerType,
    useLoader
} from '@react-three/fiber';
import {
    Vector3,
    Euler,
    Mesh,
    Group,
    TextureLoader,
    DoubleSide,
    Quaternion
} from 'three';
import {
    skyColorLight,
    whiteColor
} from './insectsColors';
import { insectBodyShader, insectWingsShader } from './insectsShaders';


interface SocketInsectsProps {
    position: Vector3Type,
    rotation: EulerType
}
const lerpCalcVector3A = new Vector3();
const lerpCalcVector3B = new Vector3();
const lerpCalcVector3C = new Vector3();

const currentQuaternionA = new Quaternion();
const currentQuaternionB = new Quaternion();
const lerpEulerCalcA = new Euler();
const lerpEulerCalcB = new Euler();
const resultEuler = new Euler();

const InsectsSocketInsect: React.FC<SocketInsectsProps> = ({position, rotation}) => {
    const butterflyWingTextureLeft = useLoader(TextureLoader, './insects/butterfly-wings.png');
    const butterflyWingTextureRight = useLoader(TextureLoader, './insects/butterfly-wings-1.png');
    const groupRef = useRef(null);
    const backDirMeshRef = useRef<Mesh | null>(null);
    const insectGroupRef = useRef<Group | null>(null);
    const [insectWingRotation, setInsectWingRotation] = useState<number>(0);
    const [insectPosition, setInsectPosition] = useState<Vector3Type>(position);
    const [insectRotation, setInsectRotation] = useState<EulerType>(rotation);

    useFrame(({ clock }) => {
        setInsectPosition(current => {
            lerpCalcVector3A.set(current[0], current[1], current[2]);
            lerpCalcVector3B.set(position[0], position[1], position[2]);
            lerpCalcVector3C.lerpVectors(lerpCalcVector3A, lerpCalcVector3B, .1);
            return [lerpCalcVector3C.x, lerpCalcVector3C.y, lerpCalcVector3C.z]
        })

        setInsectRotation(current => {
            lerpEulerCalcA.set(current[0], current[1], current[2]);
            currentQuaternionA.setFromEuler(lerpEulerCalcA);
            lerpEulerCalcB.set(rotation[0], rotation[1], rotation[2]);
            currentQuaternionB.setFromEuler(lerpEulerCalcB);
            currentQuaternionA.slerp(currentQuaternionB, 0.1); 
            resultEuler.setFromQuaternion(currentQuaternionA);
            return [resultEuler.x, resultEuler.y, resultEuler.z];
        })

        setInsectWingRotation(Math.sin(clock.elapsedTime * 6) / (1.5));
    });

    const butterflyShaderLeftUniforms = {
        wingTexture: {
            value: butterflyWingTextureLeft
        },
        color: {
            value: whiteColor
        },
        skyColorLight: {
            value: skyColorLight
        }
    };

    const butterflyShaderRightUniforms = {
        wingTexture: {
            value: butterflyWingTextureRight
        },
        color: {
            value: whiteColor
        },
        skyColorLight: {
            value: skyColorLight
        }
    };

    const butterflyShaderBodyUniforms = {
        color: {
            value: whiteColor
        },
        skyColorLight: {
            value: skyColorLight
        }
    };

    return (
        <>
            <group
                ref={groupRef}
                rotation={insectRotation}
                position={insectPosition}
            >
                <group
                    ref={insectGroupRef}
                    rotation={[-.75, 0, 0]}
                >
                    <mesh
                        position={[-.05,.75,.175]}
                        rotation={[.5,0,.125]}
                    >
                        <cylinderGeometry args={[.02, .02, .75, 4, 1]} />
                        <meshBasicMaterial 
                            color={skyColorLight}
                        />
                    </mesh>
                    <mesh
                        position={[.05,.75,.175]}
                        rotation={[.5,0,-.125]}
                    >
                        <cylinderGeometry args={[.02, .02, .75, 4, 1]} />
                        <meshBasicMaterial 
                            color={skyColorLight}
                        />
                    </mesh>

                    <mesh>
                        <cylinderGeometry args={[.05, .05, .85, 8, 1]} />
                        <shaderMaterial
                            vertexShader={insectBodyShader.vertexShader}
                            fragmentShader={insectBodyShader.fragmentShader}
                            transparent={true}
                            depthWrite={false}
                            side={DoubleSide}
                            uniforms={butterflyShaderBodyUniforms}
                        />
                    </mesh>
                    <mesh 
                        rotation={[0, .5 + insectWingRotation, 0]}
                        position={[-0.05,0,0]}
                    >
                        <planeGeometry args={[1.5, 1.5, 1, 1]} />
                        <shaderMaterial
                            vertexShader={insectWingsShader.vertexShader}
                            fragmentShader={insectWingsShader.fragmentShader}
                            transparent={true}
                            depthWrite={false}
                            side={DoubleSide}
                            uniforms={butterflyShaderLeftUniforms}
                        />
                    </mesh>
                    <mesh 
                        rotation={[-0, -.5 - insectWingRotation, 0]}
                        position={[0.05,0,0]}
                    >
                        <planeGeometry args={[1.5, 1.5, 1, 1]} />
                        <shaderMaterial
                            vertexShader={insectWingsShader.vertexShader}
                            fragmentShader={insectWingsShader.fragmentShader}
                            transparent={true}
                            depthWrite={false}
                            side={DoubleSide}
                            uniforms={butterflyShaderRightUniforms}
                        />
                    </mesh>
                </group>
                <mesh
                    ref={backDirMeshRef}
                    position={[0, 0, 3]}
                >
                    <boxGeometry args={[.05, .05, .01, 1, 1]} />
                    <meshStandardMaterial color={0x00ff00} transparent={true} opacity={0} />
                </mesh>
            </group>
        </>
    );
};

export { InsectsSocketInsect };