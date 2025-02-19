import {
    useState,
    useEffect,
    useRef
} from 'react';
import {
    Canvas,
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
    NoToneMapping,
    Color,
    ShaderMaterial,
    InstancedMesh,
    PlaneGeometry,
    Object3D,
    CircleGeometry
} from 'three';
import { isTouchDevice } from '../../assets/js/util';
import { ClientData, EventData } from './websocket-types';

interface InsectsShaderProps {
    position: Vector3Type
}

const InsectsShader: React.FC<InsectsShaderProps> = ({ position }): JSX.Element => {
    return (
        <>
            <gridHelper args={[10, 10, 0x000000, 0x000000]} position={[0, -.5, 0]} />
            <mesh position={position}>
                <boxGeometry args={[1, 1, 1, 1]} />
                <meshNormalMaterial />
            </mesh>
        </>
    )
};

interface InsectShaderCanvasProps {
    classNames?: string
};

const grassBaseColor = new Color(0x00ff00);
const dryTallGrassColor = new Color(0xf6ff33);
const skyColorLight = new Color(0x89dffe);

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

const insectWingsShader = {
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 color;
        uniform vec3 skyColorLight;
        uniform sampler2D wingTexture;

        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
            vec2 uv = vUv - vec2(0.5, 0.5);
            vec4 finalColor = texture2D(wingTexture, vUv);
            if(finalColor.a > 0.001) {
                finalColor = vec4(mix(color, skyColorLight, 1.0 - abs(uv.x) * 2.0), 1.0);
            }
            gl_FragColor = finalColor;
        }
    `,
}

const insectBodyShader = {
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 color;
        uniform vec3 skyColorLight;

        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
            vec2 uv = vUv - vec2(0.5, 0.5);
            vec4 finalColor = vec4(mix(color, skyColorLight, abs(vPosition.y)), 1.0);
            gl_FragColor = finalColor;
        }
    `,
}

interface InsectControls {
    sendUpdate: (payload) => void;
}

const InsectControls: React.FC<InsectControls> = ({sendUpdate}) => {
    const butterflyWingTextureLeft = useLoader(TextureLoader, './insects/butterfly-wings.png');
    const butterflyWingTextureRight = useLoader(TextureLoader, './insects/butterfly-wings-1.png');
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
        if(frameCount % 25 === 0) {
            sendUpdate({
                payload: {
                    insectPosition,
                    insectRotation
                }
            })
            console.log('useEffect insectPosition, insectRotation');
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

        const handleMouseMove = (mouseEvent: MouseEvent) => {
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

        const handleTouchMove = (touchEvent: TouchEvent) => {
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

        const handleTouchEnd = (touchEvent: TouchEvent) => {
            setControlsState({
                a: false,
                w: false,
                s: false,
                d: false
            });
            touchEvent.preventDefault();
        }

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('touchmove', handleTouchMove, {passive: false});
        document.addEventListener('touchend', handleTouchEnd, {passive: false});
        if(touchEvents === false) {
            document.addEventListener('mousedown', handleMouseDown);
            document.addEventListener('mouseup', handleMouseUp);    
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
            if(touchEvents === false) {
                document.removeEventListener('mousedown', handleMouseDown);
                document.removeEventListener('mouseup', handleMouseUp);    
            }
        };
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

    const whiteColor = new Color(0xffffff);

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
                        position={[-.03,.75,0]}
                        rotation={[0,0,.125]}
                    >
                        <cylinderGeometry args={[.02, .02, .75, 4, 1]} />
                        <meshBasicMaterial 
                            color={skyColorLight}
                        />
                    </mesh>
                    <mesh
                        position={[.03,.75,0]}
                        rotation={[0,0,-.125]}
                    >
                        <cylinderGeometry args={[.02, .02, .75, 4, 1]} />
                        <meshBasicMaterial 
                            color={skyColorLight}
                        />
                    </mesh>

                    <mesh>
                        <cylinderGeometry args={[.05, .05, .75, 8, 1]} />
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





interface SocketInsectProps {
    position: Vector3Type,
    rotation: EulerType
}

const SocketInsect: React.FC<SocketInsectProps> = ({position, rotation}) => {
    const butterflyWingTextureLeft = useLoader(TextureLoader, './insects/butterfly-wings.png');
    const butterflyWingTextureRight = useLoader(TextureLoader, './insects/butterfly-wings-1.png');
    const groupRef = useRef(null);
    const backDirMeshRef = useRef<Mesh | null>(null);
    // const cameraPositionMeshRef = useRef<Mesh | null>(null);
    const insectGroupRef = useRef<Group | null>(null);
    const [insectWingRotation, setInsectWingRotation] = useState<number>(0)
    // const [insectPosition, setInsectPosition] = useState<Vector3Type>([positionCalc.x, positionCalc.y, positionCalc.z]);
    // const [insectRotation, setInsectRotation] = useState<EulerType>([rotationCalc.x, rotationCalc.y, rotationCalc.z]);
    // const [frameCount, setFrameCount] = useState<number>(0)

    useFrame(({ clock }) => {
        // flap insect wings
        setInsectWingRotation(Math.sin(clock.elapsedTime * 6) / (1.5));
    });

    const whiteColor = new Color(0xffffff);

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
                rotation={rotation}
                position={position}
            >
                <group
                    ref={insectGroupRef}
                    rotation={[-.75, 0, 0]}
                >
                    <mesh
                        position={[-.03,.75,0]}
                        rotation={[0,0,.125]}
                    >
                        <cylinderGeometry args={[.02, .02, .75, 4, 1]} />
                        <meshBasicMaterial 
                            color={skyColorLight}
                        />
                    </mesh>
                    <mesh
                        position={[.03,.75,0]}
                        rotation={[0,0,-.125]}
                    >
                        <cylinderGeometry args={[.02, .02, .75, 4, 1]} />
                        <meshBasicMaterial 
                            color={skyColorLight}
                        />
                    </mesh>

                    <mesh>
                        <cylinderGeometry args={[.05, .05, .75, 8, 1]} />
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
            </group>
        </>
    );
};








const skyDomeShader = {
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 skyColorLight;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
            vec3 skyColorMixWhite = mix(vec3(1.0, 1.0, 1.0), skyColorLight, vPosition.y * 2.0);
            gl_FragColor = vec4(skyColorMixWhite, 1.0);
        }
    `,
};

const SkyDome = () => {
    return (
        <mesh scale={[100, 100, 100]}>
            <sphereGeometry />
            <shaderMaterial
                vertexShader={skyDomeShader.vertexShader}
                fragmentShader={skyDomeShader.fragmentShader}
                uniforms={{
                    skyColorLight: {value: skyColorLight}
                }}
                side={DoubleSide}
            />
        </mesh>
    )
};

const groundShader = {
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 skyColorLight;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
            float distanceFromCenter = distance(vPosition, vec3(0.0,0.0,0.0)) / 100.0;
            vec3 uvModColor = vec3(vPosition) * .25;
            vec3 groundColor = vec3(0.0, 1.0, 0.0);
            vec3 groundColorUvModColorMix = mix(groundColor, uvModColor, .05);
            vec3 groundColorSkyMix = mix(groundColor, vec3(1.0, 1.0, 1.0), distanceFromCenter);
            gl_FragColor = vec4(groundColorSkyMix, 1.0);
        }
    `,
};

// huge thank you to felixmariotto and the three.js discord
// modified shader from: https://discourse.threejs.org/t/simple-instanced-grass-example/26694
const grassShader = {
    vertexShader: `
    varying vec2 vUv;
    uniform float time;
    varying vec3 vPosition;
    
      void main() {
        vUv = uv;      
        vec4 mvPosition = vec4( position, 1.0 );
        #ifdef USE_INSTANCING
            mvPosition = instanceMatrix * mvPosition;
            vPosition = vec3(mvPosition.x, mvPosition.y, mvPosition.z);
        #endif
        float dispPower = 1.0 - cos( uv.y * 3.1416 / 2.0 );
        float displacement = sin( mvPosition.z + time * 7.0 ) * ( 0.1 * dispPower );
        mvPosition.z += displacement;            
        vec4 modelViewPosition = modelViewMatrix * mvPosition;
        gl_Position = projectionMatrix * modelViewPosition;
      }
  `,
  fragmentShader: `
    varying vec3 vPosition;
    varying vec2 vUv;
    uniform vec3 skyColorLight;
    uniform vec3 baseColor;
    void main() {
        float clarity = ( vUv.y * 0.5 ) + 0.5;
        vec3 mixSkyColorLight = mix(skyColorLight, baseColor, clarity);
        mixSkyColorLight = mix(mixSkyColorLight, vPosition / 10.0, .125);
        gl_FragColor = vec4( mixSkyColorLight, 1 );
    }
  `
};

interface GrassProps {
    baseColor: Color,
    skyColor: Color,
    instanceNumber: number, 
    instanceOrigin: Vector3,
    planeGeometryArgs: number[],
    placementScale: number,
    instanceScale: number    
};

const Grass: React.FC<GrassProps> = ({
    baseColor,
    skyColor,
    instanceNumber, 
    instanceOrigin,
    planeGeometryArgs,
    placementScale,
    instanceScale
}) => {  
  const uniforms = {
    time: {
        value: 0
    },
    skyColorLight: {
        value: skyColor
    },
    baseColor: {
        value: baseColor
    }
  };
  
  const leavesMaterial = new ShaderMaterial({
    vertexShader: grassShader.vertexShader,
    fragmentShader: grassShader.fragmentShader,
    uniforms,
    side: DoubleSide
  });
    
  const matrixPositionObject = new Object3D();  
  const geometry = new PlaneGeometry(planeGeometryArgs[0], planeGeometryArgs[1], planeGeometryArgs[2], planeGeometryArgs[3])
  const instancedMesh = new InstancedMesh( geometry, leavesMaterial, instanceNumber );
    for ( let i=0 ; i<instanceNumber ; i++ ) {
        // Calculate random angle and radius
        const angle = Math.random() * Math.PI * 2; // Random angle between 0 and 2π
        const radius = Math.sqrt(Math.random()) * placementScale; // Square root of random number times the radius of the circle

        // Convert polar coordinates (radius, angle) to Cartesian coordinates (x, z)
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);

        // Set the position
        matrixPositionObject.position.set(x, 0, z);        
        matrixPositionObject.scale.setScalar( 0.5 + Math.random() * instanceScale );
        matrixPositionObject.rotation.y = Math.random() * Math.PI;
        matrixPositionObject.updateMatrix();
        instancedMesh.setMatrixAt( i, matrixPositionObject.matrix );
    }

    instancedMesh.position.copy(instanceOrigin);

    useFrame(({clock}) => {
        leavesMaterial.uniforms.time.value = clock.getElapsedTime();
        leavesMaterial.uniformsNeedUpdate = true;
    });

    return (
        <primitive object={instancedMesh}/>
    )
};

const SmallFlowers = ({
    baseColor,
    skyColor,
    instanceNumber, 
    instanceOrigin,
    circleGeometryArgs,
    placementScale,
    instanceScale
}) => {  
    const uniforms = {
        time: {
          value: 0
      },
      skyColorLight: {
          value: skyColor
      },
      baseColor: {
        value: baseColor
      }
    };

    const leavesMaterial = new ShaderMaterial({
      vertexShader: grassShader.vertexShader,
      fragmentShader: grassShader.fragmentShader,
      uniforms,
      side: DoubleSide
    });
      
    const matrixPositionObject = new Object3D();
    const geometry = new CircleGeometry(circleGeometryArgs[0], circleGeometryArgs[1]);    
    const instancedMesh = new InstancedMesh( geometry, leavesMaterial, instanceNumber );
      for ( let i=0 ; i<instanceNumber ; i++ ) {
          // Calculate random angle and radius
          const angle = Math.random() * Math.PI * 2; // Random angle between 0 and 2π
          const radius = Math.sqrt(Math.random()) * placementScale; // Square root of random number times the radius of the circle
  
          // Convert polar coordinates (radius, angle) to Cartesian coordinates (x, z)
          const x = radius * Math.cos(angle);
          const z = radius * Math.sin(angle);
  
          // Set the position
          matrixPositionObject.position.set(x, Math.random() / 5, z);    
          matrixPositionObject.scale.setScalar( 0.1 + Math.random() * instanceScale );
          matrixPositionObject.rotation.set(Math.PI / Math.random() * 2, Math.random() / 10, Math.random() / 10);
          matrixPositionObject.updateMatrix();
          instancedMesh.setMatrixAt( i, matrixPositionObject.matrix );
      }
      instancedMesh.position.copy(instanceOrigin);
  
    //   useFrame(({clock}) => {
    //       leavesMaterial.uniforms.time.value = clock.getElapsedTime();
    //       leavesMaterial.uniformsNeedUpdate = true;
    //   });
  
    return (
        <primitive object={instancedMesh}/>
    )
};

const Ground = () => {
    return (
        <>
            <SmallFlowers 
                baseColor={grassBaseColor}
                skyColor={skyColorLight}
                instanceNumber={500}
                instanceOrigin={new Vector3(0,0,-20)}
                circleGeometryArgs={[0.5, 8]}
                placementScale={16}
                instanceScale={2}            
            />
            <SmallFlowers 
                baseColor={grassBaseColor}
                skyColor={skyColorLight}
                instanceNumber={1500}
                instanceOrigin={new Vector3(0,0,0)}
                circleGeometryArgs={[0.5, 8]}
                placementScale={30}
                instanceScale={1}            
            />
            <SmallFlowers 
                baseColor={dryTallGrassColor}
                skyColor={skyColorLight}
                instanceNumber={500}
                instanceOrigin={new Vector3(0,0,0)}
                circleGeometryArgs={[0.5, 8]}
                placementScale={20}
                instanceScale={1}            
            />
            <Grass 
                baseColor={dryTallGrassColor}
                skyColor={skyColorLight}
                instanceNumber={500}
                instanceOrigin={new Vector3(-5,0,-5)}
                planeGeometryArgs={[0.05, 2, 1, 4]}
                placementScale={10}
                instanceScale={1}
            />
            <Grass 
                baseColor={dryTallGrassColor}
                skyColor={dryTallGrassColor}
                instanceNumber={500}
                instanceOrigin={new Vector3(5,0,3)}
                planeGeometryArgs={[0.05, 2, 1, 4]}
                placementScale={10}
                instanceScale={2}
            />
            <Grass 
                baseColor={grassBaseColor}
                skyColor={skyColorLight}
                instanceNumber={5000}
                instanceOrigin={new Vector3(0,0,0)}
                planeGeometryArgs={[0.15, 1, 1, 4]}
                placementScale={40}
                instanceScale={1.5}
            />
            <Grass 
                baseColor={dryTallGrassColor}
                skyColor={skyColorLight}
                instanceNumber={2500}
                instanceOrigin={new Vector3(0,0,0)}
                planeGeometryArgs={[0.15, 1, 1, 4]}
                placementScale={50}
                instanceScale={1.5}
            />
            <Grass 
                baseColor={grassBaseColor}
                skyColor={skyColorLight}
                instanceNumber={2500}
                instanceOrigin={new Vector3(0,0,0)}
                planeGeometryArgs={[0.15, 1, 1, 4]}
                placementScale={60}
                instanceScale={.5}
            />
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -.5, 0]}>
                <planeGeometry args={[1000, 1000, 1, 1]} />
                <shaderMaterial
                    vertexShader={groundShader.vertexShader}
                    fragmentShader={groundShader.fragmentShader}
                    uniforms={{
                        skyColorLight: {value: skyColorLight}
                    }}
                    side={DoubleSide}
                />
            </mesh>
        </>
    )
};

const localhostAddress = 'ws://localhost:8080';
const gcpAddress = 'wss://websocket-service-943494934642.us-central1.run.app';
const wssAddress = window.location.href.includes('localhost') ? localhostAddress : gcpAddress;

const WebSocketUI = () => {
    const [clientData, setClientData] = useState<ClientData>({ uuid: '', status: 'unconnected', memory: {} });
    const ws = useRef<WebSocket | null>(null);

    (window as any).clientData = clientData;

    useEffect(() => {
        ws.current = new WebSocket(wssAddress);
        ws.current.onopen = () => {
            console.log('WebSocket connection established');
            sendMessage({
                messageType: 'connectedFromClient',
                uuid: clientData.uuid,
                timeStamp: new Date().getTime(),
                payload: {}
            });
        };
        ws.current.onmessage = (event) => {
            const eventData: EventData = JSON.parse(event.data);
            handleIncomingMessage(eventData);
        };
        ws.current.onclose = () => {
            console.log('WebSocket connection closed');
        };
        ws.current.onerror = (error) => {
            console.log('WebSocket Error: ', error);
        };

        return () => {
            ws.current?.close();
        };
    }, []);

    const handleIncomingMessage = (eventData: EventData) => {
        console.log('incomingMessageReducer', eventData);
        switch (eventData.messageType) {
            case 'connectedFromServer':
                setClientData((prevData) => ({ ...prevData, uuid: eventData.payload.uuid }));
                break;
            case 'disconnectedFromServer':
                setClientData((prevData) => ({ ...prevData, status: eventData.messageType }));
                break;
            case 'broadcastUpdateFromServer': {
                const { uuid, updatePayload } = eventData.payload;
                setClientData((prevData) => ({
                    ...prevData,
                    memory: {
                        ...prevData.memory,
                        [uuid]: { ...prevData.memory[uuid], ...updatePayload.payload }
                    }
                }));
            }
                break;
            case 'broadcastDisconnectedFromServer': {
                const uuidToDelete = eventData.payload.uuid;
                setClientData((prevData) => {
                    const updatedMemory = { ...prevData.memory };
                    delete updatedMemory[uuidToDelete];
                    return { ...prevData, memory: updatedMemory };
                });
                break;
            }
        }
    };

    const sendMessage = (message: EventData) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(message));
        }
    };

    // Handlers for button clicks
    // const connectWebSocket = () => {
    //     if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
    //         ws.current = new WebSocket(wssAddress);
    //     }
    // };

    // const disconnectWebSocket = () => {
    //     if (ws.current) {
    //         ws.current.close();
    //     }
    // };

    interface PayloadProps {
        [key: string]: any
    }

    const sendUpdate = (payload: PayloadProps) => {
        sendMessage({
            messageType: 'updateFromClient',
            uuid: clientData.uuid,
            payload,
            timeStamp: new Date().getTime()
        });
    };

    return (
        <>
            <InsectControls sendUpdate={sendUpdate}/>
            {Object.keys(clientData.memory).map((socketInsectKey) => {
                <SocketInsect
                    position={clientData.memory[socketInsectKey].insectPosition}
                    rotation={clientData.memory[socketInsectKey].insectRotation}
                />
            })}
        </>

        // <div className='ws-client-container'>
        //     <button onClick={connectWebSocket}>Connect</button>
        //     <button onClick={disconnectWebSocket}>Disconnect</button>
        //     <button onClick={sendUpdate}>Send Update</button>
        // </div>
    );
};

const InsectsShaderCanvas: React.FC<InsectShaderCanvasProps> = ({
    classNames = ''
}) => {

    const touchDevice = isTouchDevice();

    return (
        <>
            <Canvas
                gl={{ antialias: true, toneMapping: NoToneMapping }}
                linear
                className={classNames}
            >
                <Ground />
                <SkyDome />
                <perspectiveCamera />
                <WebSocketUI />
            </Canvas>
            {touchDevice === true && (
                <div className='mobile-control-circle'>
                    <img src='insects/mobile-control-circle-white.png' />
                </div>
            )}
        </>
    )
};

export { InsectsShader, InsectsShaderCanvas };