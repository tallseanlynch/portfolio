const WalkingBuildings = () => {
    return (
        <group>
            {/* bottom right */}
            <mesh position={[65, 20, 65]}>
                <boxGeometry args={[60, 40, 60]} />
                <meshStandardMaterial color={0xff0000} />
            </mesh>
            {/* bottom left */}
            <mesh position={[-65, 20, 65]}>
                <boxGeometry args={[60, 40, 60]} />
                <meshStandardMaterial color={0x00ff00} />
            </mesh>
            {/* top right */}
            <mesh position={[65, 20, -65]}>
                <boxGeometry args={[60, 40, 60]} />
                <meshStandardMaterial color={0x0000ff} />
            </mesh>
            {/* top left */}
            <mesh position={[-65, 20, -65]}>
                <boxGeometry args={[60, 40, 60]} />
                <meshStandardMaterial color={0x00ffff} />
            </mesh>
        </group>
    )
}

export { WalkingBuildings };