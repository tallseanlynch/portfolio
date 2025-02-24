import {
    useState,
    useEffect,
    useRef
} from 'react';
import {
    useThree,
    useFrame,
    Vector3 as Vector3Type,
    Euler as EulerType,
    Vector2 as Vector2Type,
    useLoader
} from '@react-three/fiber';
import {
    Vector3,
    Euler,
    Mesh,
    Vector2,
    Group,
    TextureLoader,
    DoubleSide,
    Color
} from 'three';
import {
    skyColorLight,
    // whiteColor
} from './insectsColors';
import { isTouchDevice } from '../../assets/js/util';
import { insectBodyShader, insectWingsShader } from './insectsShaders';

const positionCalc = new Vector3(0, 5, 0);
const rotationCalc = new Euler(0, 0, 0);
const cameraPositionCalc = new Vector3(0, 0, 0);
const cameraPositionCalcWorld = new Vector3(0, 0, 0);
const backDirCalc = new Vector3(0, 0, 0);
const backDirDiff = new Vector3(0, 0, 5);
const insectPositionWorldCalc = new Vector3(0, 0, 0);
const insectPositionLocalCopy = new Vector3(0, 0, 0);
const backDirToPlayerDirection = new Vector3(0, 0, 0);
const mouseCoorCalc = new Vector2(0, 0);
const normalizeMouseCoorCalc = new Vector2(0, 0);
const deadZoneNormalizeMouseCoorCalc = new Vector2(0,0,);
const normalizeMouseCoorScaled = new Vector2(0, 0);
const movementRate = .0125;


interface InsectsControlsProps {
    sendUpdate: (payload) => void;
    clientColor: Color;
    clientPatternSpots: Vector3[]
}

const InsectsControls: React.FC<InsectsControlsProps> = ({
    sendUpdate,
    clientColor,
    clientPatternSpots
}) => {
    const butterflyWingTextureLeft = useLoader(TextureLoader, './insects/butterfly-wings.png');
    const [mouseCoors, setMouseCoors] = useState<Vector2Type>([0, 0])
    const groupRef = useRef(null);
    const backDirMeshRef = useRef<Mesh | null>(null);
    const cameraPositionMeshRef = useRef<Mesh | null>(null);
    const insectGroupRef = useRef<Group | null>(null);
    const { camera } = useThree();
    const [insectWingRotation, setInsectWingRotation] = useState<number>(0)
    const [insectPosition, setInsectPosition] = useState<Vector3Type>([positionCalc.x, positionCalc.y, positionCalc.z]);
    const [insectRotation, setInsectRotation] = useState<EulerType>([rotationCalc.x, rotationCalc.y, rotationCalc.z]);
    const [cameraRotation, setCameraRotation] = useState<EulerType>([rotationCalc.x, rotationCalc.y, rotationCalc.z]);
    const [controlsState, setControlsState] = useState({
        a: false,
        w: false,
        s: false,
        d: false
    });
    const touchEvents = isTouchDevice();
    const [frameCount, setFrameCount] = useState<number>(0)

    useEffect(() => {
        // send updates to server
        if(frameCount % 10 === 0) {
           if(frameCount < 510) {
                sendUpdate({
                    insectPosition,
                    insectRotation,
                    insectColor: clientColor,
                    insectPatternSpots: clientPatternSpots
                })    
            } else {
                sendUpdate({
                    insectPosition,
                    insectRotation
                })    
            }
        }
    }, [frameCount]);

    useEffect(() => {
        const handleKeyDown = (keyboardEvent) => {
            const key = keyboardEvent.key.toLowerCase();
            if (controlsState[key] !== undefined) {
                setControlsState(prevState => ({ ...prevState, [key]: true }));
            }
        };

        const handleKeyUp = (keyboardEvent) => {
            const key = keyboardEvent.key.toLowerCase();
            if (controlsState[key] !== undefined) {
                setControlsState(prevState => ({ ...prevState, [key]: false }));
            }
        };

        const handleMouseMove = (mouseEvent) => {
            if(mouseEvent.buttons > 0) {
                const leftMouseState = mouseEvent.clientX - (window.innerWidth / 2) < 0 && Math.abs(mouseEvent.clientX - (window.innerWidth / 2)) > 50;
                const rightMouseState = mouseEvent.clientX - (window.innerWidth / 2) > 0 && Math.abs(mouseEvent.clientX - (window.innerWidth / 2)) > 50;
    
                if(controlsState.w === false) {
                    setControlsState(prevState => ({
                        ...prevState, 
                        a: false,
                        d: false
                    }));    
                } else {
                    setControlsState(prevState => ({
                        ...prevState, 
                        a: leftMouseState,
                        d: rightMouseState
                    }));    
                }
            }
            setMouseCoors([mouseEvent.clientX, mouseEvent.clientY]);
        }

        const handleTouchMove = (touchEvent) => {
            setMouseCoors([touchEvent.touches[0].clientX, touchEvent.touches[0].clientY]);

            const leftTouchState = (touchEvent.touches[0].clientX - (window.innerWidth / 2) < 0) && (Math.abs(touchEvent.touches[0].clientX - (window.innerWidth / 2)) > 50);
            const rightTouchState = (touchEvent.touches[0].clientX - (window.innerWidth / 2) > 0) && (Math.abs(touchEvent.touches[0].clientX - (window.innerWidth / 2)) > 50);

            setControlsState(prevState => ({
                ...prevState, 
                w: true,
                a: leftTouchState,
                d: rightTouchState
            }));

            touchEvent.preventDefault();
        }

        const handleMouseDown = (mouseEvent) => {
            const leftMouseState = mouseEvent.clientX - (window.innerWidth / 2) < 0 && Math.abs(mouseEvent.clientX - (window.innerWidth / 2)) > 50;
            const rightMouseState = mouseEvent.clientX - (window.innerWidth / 2) > 0 && Math.abs(mouseEvent.clientX - (window.innerWidth / 2)) > 50;

            setControlsState(prevState => ({
                ...prevState, 
                w: true,
                a: leftMouseState,
                d: rightMouseState
            }));
        }

        const handleMouseUp = () => {
            setControlsState(prevState => ({
                ...prevState, 
                w: false,
                a: false,
                d: false
            }));
        }

        const handleTouchEnd = (touchEvent) => {
            setControlsState({
                a: false,
                w: false,
                s: false,
                d: false
            });
            touchEvent.preventDefault();
        }

        const eventElement = document.querySelector('.container-100');
        if(eventElement !== null) {
            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('keyup', handleKeyUp);
            eventElement.addEventListener('mousemove', handleMouseMove);
            eventElement.addEventListener('touchmove', handleTouchMove, {passive: false});
            eventElement.addEventListener('touchend', handleTouchEnd, {passive: false});
            if(touchEvents === false) {
                eventElement.addEventListener('mousedown', handleMouseDown);
                eventElement.addEventListener('mouseup', handleMouseUp);    
            }
    
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
                document.removeEventListener('keyup', handleKeyUp);
                eventElement.removeEventListener('mousemove', handleMouseMove);
                eventElement.removeEventListener('touchmove', handleTouchMove);
                eventElement.removeEventListener('touchend', handleTouchEnd);
                if(touchEvents === false) {
                    eventElement.removeEventListener('mousedown', handleMouseDown);
                    eventElement.removeEventListener('mouseup', handleMouseUp);    
                }
            };    
        }
    }, [controlsState, touchEvents]);

    const mouseCoorHeightModifier = touchEvents === true ? (window.innerHeight - 125) : (window.innerHeight / 2);
    const deadZone = 0.1;

    useFrame(({ clock }) => {
        // numberOfFrames = numberOfFrames + 1;
        setFrameCount(current => current + 1);

        // normalize coors
        mouseCoorCalc.set(mouseCoors[0], mouseCoors[1]);
        normalizeMouseCoorCalc.set(
            (mouseCoors[0] - window.innerWidth / 2) / (window.innerWidth / 2),
            (mouseCoors[1] - mouseCoorHeightModifier) / mouseCoorHeightModifier
        );

        // handle deadzone in middle
        deadZoneNormalizeMouseCoorCalc.copy(normalizeMouseCoorCalc);
        const absXCoor = Math.abs(normalizeMouseCoorCalc.x);
        if(absXCoor < deadZone) {
            deadZoneNormalizeMouseCoorCalc.x = 0;        
        } else {
            if(normalizeMouseCoorCalc.x > 0) {
                deadZoneNormalizeMouseCoorCalc.x = normalizeMouseCoorCalc.x - deadZone;
            } else {
                deadZoneNormalizeMouseCoorCalc.x = normalizeMouseCoorCalc.x + deadZone;
            }
        }
        const absYCoor = Math.abs(normalizeMouseCoorCalc.y);
        if(absYCoor < deadZone) {
            deadZoneNormalizeMouseCoorCalc.y = 0;        
        } else {
            if(normalizeMouseCoorCalc.y > 0) {
                deadZoneNormalizeMouseCoorCalc.y = normalizeMouseCoorCalc.y - deadZone;
            } else {
                deadZoneNormalizeMouseCoorCalc.y = normalizeMouseCoorCalc.y + deadZone;
            }
        }

        // scale the mouth coor
        normalizeMouseCoorScaled.copy(deadZoneNormalizeMouseCoorCalc).multiplyScalar(.25);

        // apply all transformations using refs
        if (
            cameraPositionMeshRef && cameraPositionMeshRef.current &&
            backDirMeshRef && backDirMeshRef.current &&
            insectGroupRef && insectGroupRef.current
        ) {
            // get position of camera reference mesh
            cameraPositionCalc.copy(cameraPositionMeshRef.current.position);
            cameraPositionCalcWorld.copy(
                cameraPositionMeshRef.current.localToWorld(cameraPositionCalc)
            );

            // get position of back of insect for direction of movement
            backDirDiff.copy(backDirMeshRef.current.position);
            backDirCalc.copy(
                backDirMeshRef.current.localToWorld(backDirDiff)
            );

            // place camera at camera reference mesh
            camera.position.copy(cameraPositionCalcWorld);
            if (camera.position.y < .1) {
                camera.position.y = .1;
            }

            // get insect position and have camera look at it
            insectPositionLocalCopy.copy(insectGroupRef.current.position);
            insectPositionWorldCalc.copy(
                insectGroupRef.current.localToWorld(insectPositionLocalCopy)
            );
            camera.lookAt(insectPositionWorldCalc);

            // create direction for insect to move
            backDirToPlayerDirection.copy(insectPositionWorldCalc).sub(backDirCalc).normalize().multiplyScalar(movementRate);
        }

        // add player control transformations using controlsState
        const touchDeviceDownDirectionModifier = (normalizeMouseCoorScaled.y > 0 && touchEvents === true) ? 5 : 1;
        if (controlsState.w) {
            positionCalc.add(backDirToPlayerDirection.multiplyScalar(5));
            positionCalc.y += normalizeMouseCoorScaled.y * -1 * touchDeviceDownDirectionModifier;
        }
        if (controlsState.s) {
            positionCalc.sub(backDirToPlayerDirection.multiplyScalar(2));
            positionCalc.y += normalizeMouseCoorScaled.y * touchDeviceDownDirectionModifier;
        }
        if (controlsState.a) {
            rotationCalc.y += movementRate;
        }
        if (controlsState.d) {
            rotationCalc.y -= movementRate;
        }

        // add camera rotation based upon mouse / touch location
        const cameraTouchDeviceModifier = touchEvents === false ? 1 : -1;
        setCameraRotation([
            normalizeMouseCoorScaled.y * cameraTouchDeviceModifier,
            normalizeMouseCoorScaled.x,
            0
        ]);

        // make sure insect is not beneath .1 of y
        if (positionCalc.y < .1) {
            positionCalc.y = .1;
        }

        setInsectPosition([
            positionCalc.x,
            positionCalc.y,
            positionCalc.z
        ]);

        setInsectRotation([
            rotationCalc.x + normalizeMouseCoorScaled.y,
            rotationCalc.y + normalizeMouseCoorScaled.x,
            rotationCalc.z
        ]);    

        // flap insect wings
        setInsectWingRotation(Math.sin(clock.elapsedTime * 6) / (1.5));
    });


    const butterflyShaderLeftUniforms = {
        wingTexture: { value: butterflyWingTextureLeft },
        color: { value: clientColor },
        skyColorLight: { value: skyColorLight },
        flipX: { value: false },
        clientPatternSpots: { value: clientPatternSpots }
    };

    const butterflyShaderRightUniforms = {
        wingTexture: { value: butterflyWingTextureLeft },
        color: { value: clientColor },
        skyColorLight: { value: skyColorLight },
        flipX: { value: true },
        clientPatternSpots: { value: clientPatternSpots }
    };

    const butterflyShaderBodyUniforms = {
        color: { value: clientColor },
        skyColorLight: { value: skyColorLight }
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
                            color={clientColor}
                        />
                    </mesh>
                    <mesh
                        position={[.05,.75,.175]}
                        rotation={[.5,0,-.125]}
                    >
                        <cylinderGeometry args={[.02, .02, .75, 4, 1]} />
                        <meshBasicMaterial 
                            color={clientColor}
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
                        {/* <meshBasicMaterial 
                            color={whiteColor}
                        /> */}
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
                <group rotation={cameraRotation}>
                    <mesh
                        ref={cameraPositionMeshRef}
                        position={[0, 0, 3]}
                    >
                        <boxGeometry args={[.05, .05, .05, 1, 1]} />
                        <meshStandardMaterial color={0x00ff00} transparent={true} opacity={0} />
                    </mesh>
                </group>
            </group>
        </>
    );
};

export { InsectsControls };