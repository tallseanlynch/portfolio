import { BoxGeometry, Color, CylinderGeometry, Euler, SphereGeometry, Vector3 } from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

const lightPostColor = new Color(0x777777);
const lightBulbRedColor = new Color(0xff0000);
const lightBulbYellowColor = new Color(0xffff00);
const lightBulbGreenColor = new Color(0x00ff00);

const geometryHeight = 15;
const lightPoleGeometry = new CylinderGeometry(.5, 1, geometryHeight, 8);
const lightPoleHorizontalGeometry = new CylinderGeometry(.5, .5, 24, 8)
lightPoleHorizontalGeometry.rotateZ(Math.PI / 2);
lightPoleHorizontalGeometry.translate(11.55, 7.125, 0);

const lightBoxGeometry = new BoxGeometry(3, 1, 1)
const lightBoxTurnGeometry = new BoxGeometry(1, 1, 1)

// const lightPostLightGeometry = new BoxGeometry(3, 1.5, 3)
const lightPostLightGeometry = new CylinderGeometry(3, 3, 1)
lightPostLightGeometry.translate(24, 7.125, 0)
lightPostLightGeometry.scale(1, 1, .5)

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

const roadSignColor = new Color(0xdddddd);

const Lights = ({position = new Vector3(), rotation = new Euler(), leftTurn, rightTurn, onlyTurns}) => {
    const bothTurns = leftTurn === true && rightTurn === true;
    const bothTurnsAdj = bothTurns ? .5 : 0;
    const onlyTurnsAdj = onlyTurns ? 1 : 0;

    return (
        <group position={position} rotation={rotation}>
            <mesh position={[1, .5, -.5]}>
                <primitive object={lightBoxGeometry.clone().scale(.5, .5, .25)} />
                <meshBasicMaterial color={lightPostColor} />
            </mesh>
            
            { onlyTurns === false && (
                <>
                    <mesh position={[1, 0, -.5]}>
                        <primitive object={lightBoxGeometry.clone()} />
                        <meshBasicMaterial color={lightPostColor} />
                    </mesh>
                    <mesh>
                        <primitive object={lightBulbGeometry.clone()} />
                        <meshBasicMaterial color={lightBulbRedColor} />
                    </mesh>
                    <mesh position={[1, 0, 0]}>
                        <primitive object={lightBulbGeometry.clone()} />
                        <meshBasicMaterial color={lightBulbYellowColor} />
                    </mesh>
                    <mesh position={[2, 0, 0]}>
                        <primitive object={lightBulbGeometry.clone()} />
                        <meshBasicMaterial color={lightBulbGreenColor} />
                    </mesh>                
                </>
            )}

            {leftTurn && (
                <>
                    <mesh position={[0 + bothTurnsAdj, -1 + onlyTurnsAdj, -.5]}>
                        <primitive object={lightBoxTurnGeometry.clone()} />
                        <meshBasicMaterial color={lightPostColor} />
                    </mesh>
                    <mesh position={[0 + bothTurnsAdj, -1 + onlyTurnsAdj, 0]}>
                        <primitive object={arrowBulbGeometry.clone()} />
                        <meshBasicMaterial color={lightBulbRedColor} />
                    </mesh>                
                </>
            )}

            {rightTurn && (
                <>
                    <mesh position={[2 - bothTurnsAdj , -1 + onlyTurnsAdj, -.5]}>
                        <primitive object={lightBoxTurnGeometry.clone()} />
                        <meshBasicMaterial color={lightPostColor} />
                    </mesh>
                    <mesh position={[2 - bothTurnsAdj, -1 + onlyTurnsAdj, 0]}>
                        <primitive object={arrowBulbGeometry.clone().rotateY(Math.PI)} />
                        <meshBasicMaterial color={lightBulbRedColor} />
                    </mesh>                
                </>
            )}

        </group>
    )
}

const walkSignalColor = new Color(0x999999)
const walkingSignalGeometry = new BoxGeometry(1, 1, .5);
const walkingSignalLightGeometry = walkingSignalGeometry.clone().scale(.8, .8, .8);

const WalkingSignal = () => {
    return (
        <group>
            <group position={[0, -2, 1]}>
                <mesh>
                    <primitive object={walkingSignalGeometry.clone()} />
                    <meshBasicMaterial color={walkSignalColor} />
                </mesh>
                <mesh position={[0, 0, .1]}>
                    <primitive object={walkingSignalLightGeometry.clone()} />
                    <meshBasicMaterial color={lightBulbGreenColor} />
                </mesh>
            </group>
            <group position={[1, -2, 0]} rotation={[0, Math.PI / 2, 0]}>
                <mesh>
                    <primitive object={walkingSignalGeometry.clone()} />
                    <meshBasicMaterial color={walkSignalColor} />
                </mesh>
                <mesh position={[0, 0, .1]}>
                    <primitive object={walkingSignalLightGeometry.clone()} />
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
    onlyWalking = false
}) => {
    return (
        <group 
            position={position} 
            rotation={rotation}
        >
            <mesh position={[12.5, 6.5, .125]}>
                <primitive object={lightBoxGeometry.clone().scale(1.75, 2, .3).translate(5, .5, .5)} />
                <meshBasicMaterial color={roadSignColor} />
            </mesh>

            {onlyWalking === false ? (
                <>
                    <mesh>
                        <primitive object={mergedLightPost.clone()} />
                        <meshBasicMaterial color={lightPostColor} />
                    </mesh>
                    <Lights 
                        position={new Vector3(10.5, 6, .5)}
                        leftTurn={leftTurn}
                        rightTurn={rightTurn}
                        onlyTurns={onlyTurns}
                    />
                </>
            ) : (
                <mesh>
                    <primitive object={mergedLightPost.clone()} />
                    <meshBasicMaterial color={lightPostColor} />
                </mesh>
            )}
            <WalkingSignal />
        </group>
    )
}

const WalkingLights = () => {
    return (
        <>
            {/* NorthWest */}
            <LightPost 
                position={new Vector3(-25, geometryHeight / 2, -25)}
                leftTurn={true}
            />
            
            {/* SouthEast */}
            <LightPost 
                position={new Vector3(25, geometryHeight / 2, 25)} 
                rotation={new Euler(0, Math.PI, 0)}
                rightTurn={true}
            />        
            
            {/* NorthEast */}
            <LightPost 
                position={new Vector3(25, geometryHeight / 2, -25)} 
                rotation={new Euler(0, -Math.PI / 2, 0)}
                leftTurn={true}
                rightTurn={true}
                onlyTurns={true}
            />        

            {/* South */}
            <LightPost 
                position={new Vector3(-25, geometryHeight / 2, 25)} 
                rotation={new Euler(0, Math.PI / 2, 0)}
                onlyWalking={true}
            />        
        </>
    )
}

export { WalkingLights };