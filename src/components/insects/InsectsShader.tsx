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
    Object3D
} from 'three';
import { isTouchDevice } from '../../assets/js/util';

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

const insectShader = {
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
        uniform sampler2D wingTexture;

        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
            vec2 uv = vUv - vec2(0.5, 0.5);
            vec4 finalColor = texture2D(wingTexture, vUv);
            if(finalColor.a > 0.001) {
                finalColor = vec4(color, 1.0);
            }
            gl_FragColor = finalColor;
        }
    `,
}

const InsectControls: React.FC = () => {
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
        const touchDeviceDownDirectionModifier = (normalizeMouseCoorScaled.y > 0 && touchEvents === true) ? 5 : 2;
        if (controlsState.w) {
            positionCalc.add(backDirToPlayerDirection.multiplyScalar(2));
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

        // apply transformations
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
            value: butterflyWingTextureLeft,
        },
        color: {
            value: whiteColor
        }
    };

    const butterflyShaderRightUniforms = {
        wingTexture: {
            value: butterflyWingTextureRight,
        },
        color: {
            value: whiteColor
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
                    <mesh>
                        <cylinderGeometry args={[.05, .05, .75, 8, 1]} />
                        <meshBasicMaterial 
                            color={whiteColor}
                        />
                    </mesh>
                    <mesh 
                        rotation={[0, .5 + insectWingRotation, 0]}
                        position={[-0.05,0,0]}
                    >
                        <planeGeometry args={[1.5, 1.5, 1, 1]} />
                        <shaderMaterial
                            vertexShader={insectShader.vertexShader}
                            fragmentShader={insectShader.fragmentShader}
                            transparent={true}
                            depthWrite={false}
                            alphaTest={0.5}
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
                            vertexShader={insectShader.vertexShader}
                            fragmentShader={insectShader.fragmentShader}
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
            float distanceFromCenter = distance(vPosition, vec3(0.0,0.0,0.0)) / 50.0;
            // vec3 groundColorSkyMix = mix(vec3(0.0, 1.0, 0.0), skyColorLight, distanceFromCenter);
            vec3 groundColorSkyMix = mix(vec3(0.0, 1.0, 0.0), vec3(1.0, 1.0, 1.0), distanceFromCenter);
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
    
      void main() {
        vUv = uv;      
        vec4 mvPosition = vec4( position, 1.0 );
        #ifdef USE_INSTANCING
            mvPosition = instanceMatrix * mvPosition;
        #endif
        float dispPower = 1.0 - cos( uv.y * 3.1416 / 2.0 );
        float displacement = sin( mvPosition.z + time * 5.0 ) * ( 0.1 * dispPower );
        mvPosition.z += displacement;            
        vec4 modelViewPosition = modelViewMatrix * mvPosition;
        gl_Position = projectionMatrix * modelViewPosition;
      }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform vec3 skyColorLight;
    void main() {
        vec3 baseColor = vec3( 0.0, 1.0, 0.0 );
        float clarity = ( vUv.y * 0.5 ) + 0.5;
        vec3 mixSkyColorLight = mix(skyColorLight, baseColor, clarity);
        gl_FragColor = vec4( mixSkyColorLight, 1 );
    }
  `
};

const Grass = () => {  
  const uniforms = {
      time: {
        value: 0
    },
    skyColorLight: {
        value: skyColorLight
    }
  };
  
  const leavesMaterial = new ShaderMaterial({
    vertexShader: grassShader.vertexShader,
    fragmentShader: grassShader.fragmentShader,
    uniforms,
    side: DoubleSide
  });
    
  const instanceNumber = 5000;
  const matrixPositionObject = new Object3D();  
  const geometry = new PlaneGeometry( 0.1, 1, 1, 4 );
  geometry.translate( 0, 0.5, 0 );
  
  const instancedMesh = new InstancedMesh( geometry, leavesMaterial, instanceNumber );
    for ( let i=0 ; i<instanceNumber ; i++ ) {
        matrixPositionObject.position.set(
            ( Math.random() - 0.5 ) * 75,
            0,
            ( Math.random() - 0.5 ) * 75
        );
    
        matrixPositionObject.scale.setScalar( 0.5 + Math.random() * 2.5 );
        matrixPositionObject.rotation.y = Math.random() * Math.PI;
        matrixPositionObject.updateMatrix();
        instancedMesh.setMatrixAt( i, matrixPositionObject.matrix );
    }

    useFrame(({clock}) => {
        leavesMaterial.uniforms.time.value = clock.getElapsedTime();
        leavesMaterial.uniformsNeedUpdate = true;
    });

    return (
        <primitive object={instancedMesh}/>
    )
};

const Ground = () => {
    return (
        <>
            <Grass />
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
                <InsectControls />
                <perspectiveCamera />
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