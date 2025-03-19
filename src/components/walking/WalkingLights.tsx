import { BoxGeometry, Color, CylinderGeometry, Euler, SphereGeometry, Vector3 } from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { useEffect, useMemo, useState } from 'react';

const lightPostColor = new Color(0x777777);
const lightBulbRedColor = new Color(0xff0000);
const lightBulbYellowColor = new Color(0xffff00);
const lightBulbGreenColor = new Color(0x00ff00);
const roadSignColor = new Color(0xdddddd);
const walkSignalColor = new Color(0x999999);

const lightPoleGeometryHeight = 15;
const lightPoleGeometry = new CylinderGeometry(.5, 1, lightPoleGeometryHeight, 8);
const lightPoleHorizontalGeometry = new CylinderGeometry(.5, .5, 24, 8)
lightPoleHorizontalGeometry.rotateZ(Math.PI / 2);
lightPoleHorizontalGeometry.translate(11.55, 7.125, 0);

const lightBoxGeometry = new BoxGeometry(3, 1, 1)
const lightBoxTurnGeometry = new BoxGeometry(1, 1, 1)

const lightPostLightGeometry = new CylinderGeometry(3, 3, 1)
lightPostLightGeometry.translate(24, 7.125, 0)
lightPostLightGeometry.scale(1, 1, .25)

const lightBulbGeometry = new SphereGeometry(.25, 8, 8);

const arrowDepth = .125 / 2;
const rotatedArrowX = -.125;
const rotatedArrowY = .065;

const arrowSegment0 = new BoxGeometry(.3, arrowDepth, arrowDepth);
const arrowSegment1 = new BoxGeometry(.25, arrowDepth, arrowDepth);
arrowSegment1.rotateZ(Math.PI * .25);
arrowSegment1.translate(rotatedArrowX, rotatedArrowY, 0);
const arrowSegment2 = new BoxGeometry(.25, arrowDepth, arrowDepth);
arrowSegment2.rotateZ(-Math.PI * .25);
arrowSegment2.translate(rotatedArrowX, rotatedArrowY * -1, 0);
const arrowBulbGeometry = mergeGeometries([
    arrowSegment0,
    arrowSegment1,
    arrowSegment2
]);

const mergedLightPost = mergeGeometries([
    lightPoleGeometry, 
    lightPoleHorizontalGeometry, 
    lightPostLightGeometry
]);

const walkingSignalGeometry = new BoxGeometry(1, 1, .5);
const walkingSignalLightGeometry = walkingSignalGeometry.clone().scale(.8, .8, .8);

const Lights = ({position = new Vector3(), rotation = new Euler(), leftTurn, rightTurn, onlyTurns}) => {
    const bothTurns = leftTurn === true && rightTurn === true;
    const bothTurnsAdj = bothTurns ? .5 : 0;
    const onlyTurnsAdj = onlyTurns ? 1 : 0;

    const three = useMemo(() => {
        return {
            lightBoxGeometry0: lightBoxGeometry.clone().scale(.5, .5, .25),
            lightBoxGeometry1: lightBoxGeometry.clone(),
            lightBulbGeometry0: lightBulbGeometry.clone(),
            lightBulbGeometry1: lightBulbGeometry.clone(),
            lightBulbGeometry2: lightBulbGeometry.clone(),
            lightBoxTurnGeometryLeft: lightBoxTurnGeometry.clone(),
            arrowBulbGeometryLeft: arrowBulbGeometry.clone(),
            lightBoxTurnGeometryRight: lightBoxTurnGeometry.clone(),
            arrowBulbGeometryRight: arrowBulbGeometry.clone().rotateY(Math.PI)
        }
    }, [])

    return (
        <group position={position} rotation={rotation}>
            <mesh position={[1, .5, -.5]}>
                <primitive object={three.lightBoxGeometry0} />
                <meshBasicMaterial color={lightPostColor} />
            </mesh>
            
            { onlyTurns === false && (
                <>
                    <mesh position={[1, 0, -.5]}>
                        <primitive object={three.lightBoxGeometry1} />
                        <meshBasicMaterial color={lightPostColor} />
                    </mesh>
                    <mesh>
                        <primitive object={three.lightBulbGeometry0} />
                        <meshBasicMaterial color={lightBulbRedColor} />
                    </mesh>
                    <mesh position={[1, 0, 0]}>
                        <primitive object={three.lightBulbGeometry1} />
                        <meshBasicMaterial color={lightBulbYellowColor} />
                    </mesh>
                    <mesh position={[2, 0, 0]}>
                        <primitive object={three.lightBulbGeometry2} />
                        <meshBasicMaterial color={lightBulbGreenColor} />
                    </mesh>                
                </>
            )}

            {leftTurn && (
                <>
                    <mesh position={[0 + bothTurnsAdj, -1 + onlyTurnsAdj, -.5]}>
                        <primitive object={three.lightBoxTurnGeometryLeft} />
                        <meshBasicMaterial color={lightPostColor} />
                    </mesh>
                    <mesh position={[0 + bothTurnsAdj, -1 + onlyTurnsAdj, 0]}>
                        <primitive object={three.arrowBulbGeometryLeft} />
                        <meshBasicMaterial color={lightBulbRedColor} />
                    </mesh>                
                </>
            )}

            {rightTurn && (
                <>
                    <mesh position={[2 - bothTurnsAdj , -1 + onlyTurnsAdj, -.5]}>
                        <primitive object={three.lightBoxTurnGeometryRight} />
                        <meshBasicMaterial color={lightPostColor} />
                    </mesh>
                    <mesh position={[2 - bothTurnsAdj, -1 + onlyTurnsAdj, 0]}>
                        <primitive object={three.arrowBulbGeometryRight} />
                        <meshBasicMaterial color={lightBulbRedColor} />
                    </mesh>                
                </>
            )}

        </group>
    )
}

const WalkingSignal = () => {
    const three = useMemo(() => {
        return {
            walkingSignalGeometry0: walkingSignalGeometry.clone(),
            walkingSignalLightGeometry0: walkingSignalLightGeometry.clone(),
            walkingSignalGeometry1: walkingSignalGeometry.clone(),
            walkingSignalLightGeometry1: walkingSignalLightGeometry.clone()
        }
    }, [])

    return (
        <group>
            <group position={[0, -2, 1]}>
                <mesh>
                    <primitive object={three.walkingSignalGeometry0} />
                    <meshBasicMaterial color={walkSignalColor} />
                </mesh>
                <mesh position={[0, 0, .1]}>
                    <primitive object={three.walkingSignalLightGeometry0} />
                    <meshBasicMaterial color={lightBulbGreenColor} />
                </mesh>
            </group>
            <group position={[1, -2, 0]} rotation={[0, Math.PI / 2, 0]}>
                <mesh>
                    <primitive object={three.walkingSignalGeometry1} />
                    <meshBasicMaterial color={walkSignalColor} />
                </mesh>
                <mesh position={[0, 0, .1]}>
                    <primitive object={three.walkingSignalLightGeometry1} />
                    <meshBasicMaterial color={lightBulbRedColor} />
                </mesh>
            </group>
        </group>
    )
}

const LightPost = ({
    position = new Vector3(), 
    rotation = new Euler(),
    leftTurn = false,
    rightTurn = false,
    onlyTurns = false,
    onlyWalking = false,
    lightsTime = {currentTime: 0}
}) => {

    const three = useMemo(() => {
        return {
            lightBoxGeometry: lightBoxGeometry.clone().scale(1.75, 2, .3).translate(5, .5, .5),
            mergedLightPost0: mergedLightPost.clone(),
            mergedLightPost1: mergedLightPost.clone(),
            lightsPosition: new Vector3(10.5, 6, .5)
        }
    }, [])

    // useEffect(() => {
    //     console.log(lightsTime.currentTime)
    // }, [lightsTime])

    return (
        <group 
            position={position} 
            rotation={rotation}
        >
            <mesh position={[12.5, 6.5, .125]}>
                <primitive object={three.lightBoxGeometry} />
                <meshBasicMaterial color={roadSignColor} />
            </mesh>

            {onlyWalking === false ? (
                <>
                    <mesh>
                        <primitive object={three.mergedLightPost0} />
                        <meshBasicMaterial color={lightPostColor} />
                    </mesh>
                    <Lights 
                        position={three.lightsPosition}
                        leftTurn={leftTurn}
                        rightTurn={rightTurn}
                        onlyTurns={onlyTurns}
                    />
                </>
            ) : (
                <mesh>
                    <primitive object={three.mergedLightPost1} />
                    <meshBasicMaterial color={lightPostColor} />
                </mesh>
            )}
            <WalkingSignal />
        </group>
    )
}

const WalkingLights = () => {
    const [lightsTime, setLightsTime] = useState({
        currentTime: 0,
        activeLight: 'NorthSouth'
    });

    const three = useMemo(() => {
        return {
            lightPostNWPosition: new Vector3(-25, lightPoleGeometryHeight / 2, -25),
            lightPostSEPosition: new Vector3(25, lightPoleGeometryHeight / 2, 25),
            lightPostSERotation: new Euler(0, Math.PI, 0),
            lightPostNEPosition: new Vector3(25, lightPoleGeometryHeight / 2, -25), 
            lightPostNERotation: new Euler(0, -Math.PI / 2, 0),
            lightPostSWPosition: new Vector3(-25, lightPoleGeometryHeight / 2, 25),
            lightPostSWRotation: new Euler(0, Math.PI / 2, 0)
        }
    }, [])

    useEffect(() => {
        const lightsIntervalLength = 200;
        const lightsChangeLength = 1000 * 15;
        const lightsSequence = [
            'NorthSouth', 
            'NorthSouth', 
            'NorthSouthTurning', 
            'WestTurning',
            'WestTurning',
            'NoTraffic',
            'NoTraffic'
        ];

        const lightsInterval = setInterval(() => {
            setLightsTime(current => ({
                ...current, 
                currentTime: current.currentTime + 200,
                activeLight: lightsSequence[Math.floor(current.currentTime / lightsChangeLength) % lightsSequence.length]
            }));
        }, lightsIntervalLength)

        return () => clearInterval(lightsInterval);
    }, [])

    useEffect(() => {
        console.log(lightsTime.activeLight)
    }, [
        lightsTime
    ])

    return (
        <>
            {/* NorthWest */}
            <LightPost 
                position={three.lightPostNWPosition}
                leftTurn={true}
                lightsTime={lightsTime}
            />
            
            {/* SouthEast */}
            <LightPost 
                position={three.lightPostSEPosition} 
                rotation={three.lightPostSERotation}
                rightTurn={true}
                lightsTime={lightsTime}
            />        
            
            {/* NorthEast */}
            <LightPost 
                position={three.lightPostNEPosition} 
                rotation={three.lightPostNERotation}
                leftTurn={true}
                rightTurn={true}
                onlyTurns={true}
                lightsTime={lightsTime}
            />        

            {/* SouthWest */}
            <LightPost 
                position={three.lightPostSWPosition} 
                rotation={three.lightPostSWRotation}
                onlyWalking={true}
                lightsTime={lightsTime}
            />        
        </>
    )
}

export { WalkingLights };