const WalkingBuildings = () => {
    return (
        <group>
            {/* bottom right */}
            <mesh position={[92.5, 20, 92.5]}>
                <boxGeometry args={[115, 40, 115]} />
                <meshBasicMaterial color={0xff0000} />
            </mesh>
            {/* bottom left */}
            <mesh position={[-92.5, 20, 92.5]}>
                <boxGeometry args={[115, 40, 115]} />
                <meshBasicMaterial color={0x00ff00} />
            </mesh>
            {/* top right */}
            <mesh position={[92.5, 20, -92.5]}>
                <boxGeometry args={[115, 40, 115]} />
                <meshBasicMaterial color={0x0000ff} />
            </mesh>
            {/* top left */}
            <mesh position={[-95.5, 20, -92.5]}>
                <boxGeometry args={[115, 40, 115]} />
                <meshBasicMaterial color={0x00ffff} />
            </mesh>
        </group>
    )
}

export { WalkingBuildings };