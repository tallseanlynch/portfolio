import { DoubleSide, Euler, Vector3 } from "three";

const WalkingBoundry = ({groupPosition, groupRotation}) => {
    return (
        <group position={groupPosition} rotation={groupRotation}>
            <mesh rotation={[0, Math.PI * .5, 0]} frustumCulled={false}>
                <planeGeometry args={[320, 100, 1, 1]} />
                <meshBasicMaterial color={0xffffff} transparent={true} opacity={.1} side={DoubleSide} />
            </mesh>
            <mesh position={[-5, 0, 0]} rotation={[0, Math.PI * .5, 0]} frustumCulled={false}>
                <planeGeometry args={[320, 100, 1, 1]} />
                <meshBasicMaterial color={0xffffff} transparent={true} opacity={.2} side={DoubleSide}  />
            </mesh>
            <mesh position={[-10, 0, 0]} rotation={[0, Math.PI * .5, 0]} frustumCulled={false}>
                <planeGeometry args={[320, 100, 1, 1]} />
                <meshBasicMaterial color={0xffffff} transparent={true} opacity={.5} side={DoubleSide}  />
            </mesh>
            <mesh position={[-15, 0, 0]} rotation={[0, Math.PI * .5, 0]} frustumCulled={false}>
                <planeGeometry args={[320, 100, 1, 1]} />
                <meshBasicMaterial color={0xffffff} transparent={true} opacity={.75} side={DoubleSide}  />
            </mesh>
            <mesh position={[-20, 0, 0]} rotation={[0, Math.PI * .5, 0]} frustumCulled={false}>
                <planeGeometry args={[320, 100, 1, 1]} />
                <meshBasicMaterial color={0xffffff} transparent={true} opacity={.85} side={DoubleSide}  />
            </mesh>
            <mesh position={[-25, 0, 0]} rotation={[0, Math.PI * .5, 0]} frustumCulled={false}>
                <planeGeometry args={[320, 100, 1, 1]} />
                <meshBasicMaterial color={0xffffff} transparent={true} opacity={.95} side={DoubleSide}  />
            </mesh>
        </group>
    )
};

const WalkingBoundries = () => {
    return (
        <>
            <WalkingBoundry groupPosition={new Vector3(-119, 0, 0)} groupRotation={new Euler(0, 0, 0)} />
            <WalkingBoundry groupPosition={new Vector3(119, 0, 0)} groupRotation={new Euler(0, Math.PI, 0)} />
            <WalkingBoundry groupPosition={new Vector3(0, 0, 119)} groupRotation={new Euler(0, Math.PI * .5, 0)} />
            <WalkingBoundry groupPosition={new Vector3(0, 0, -119)} groupRotation={new Euler(0, -Math.PI * .5, 0)} />
        </>
    )
};

export { WalkingBoundries };