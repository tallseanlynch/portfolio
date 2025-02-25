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
    Group,
    TextureLoader,
    DoubleSide,
    Quaternion,
    Color
} from 'three';
import {
    skyColorLight
} from './insectsColors';
import { insectBodyShader, insectWingsShader } from './insectsShaders';


interface SocketInsectsProps {
    position: Vector3Type,
    rotation: EulerType,
    color: Color,
    patternSpots: Vector3Type[]
}

const lerpCalcVector3A = new Vector3();
const lerpCalcVector3B = new Vector3();
const lerpCalcVector3C = new Vector3();

const currentQuaternionA = new Quaternion();
const currentQuaternionB = new Quaternion();
const lerpEulerCalcA = new Euler();
const lerpEulerCalcB = new Euler();
const resultEuler = new Euler();

const InsectsSocketInsect: React.FC<SocketInsectsProps> = ({position, rotation, color, patternSpots}) => {
    const butterflyWingTextureLeft = useLoader(TextureLoader, './insects/butterfly-wings.png');
    const groupRef = useRef(null);
    const insectGroupRef = useRef<Group | null>(null);
    const [insectWingRotation, setInsectWingRotation] = useState<number>(0);
    const [insectPosition, setInsectPosition] = useState<Vector3Type>(position);
    const [insectRotation, setInsectRotation] = useState<EulerType>(rotation);

    useFrame(({ clock }) => {
        setInsectPosition(current => {
            lerpCalcVector3A.set(current[0], current[1], current[2]);
            lerpCalcVector3B.set(position[0], position[1], position[2]);
            lerpCalcVector3C.lerpVectors(lerpCalcVector3A, lerpCalcVector3B, .1);
            return [lerpCalcVector3C.x, lerpCalcVector3C.y, lerpCalcVector3C.z];
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
            value: color
        },
        skyColorLight: {
            value: skyColorLight
        },
        flipX: {
            value: false
        },
        clientPatternSpots: { value: patternSpots }
    };

    const butterflyShaderRightUniforms = {
        wingTexture: {
            value: butterflyWingTextureLeft
        },
        color: {
            value: color
        },
        skyColorLight: {
            value: skyColorLight
        },
        flipX: {
            value: true
        },
        clientPatternSpots: { value: patternSpots }
    };

    const butterflyShaderBodyUniforms = {
        color: {
            value: color
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
                            color={color}
                        />
                    </mesh>
                    <mesh
                        position={[.05,.75,.175]}
                        rotation={[.5,0,-.125]}
                    >
                        <cylinderGeometry args={[.02, .02, .75, 4, 1]} />
                        <meshBasicMaterial 
                            color={color}
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
            </group>
        </>
    );
};

export { InsectsSocketInsect };