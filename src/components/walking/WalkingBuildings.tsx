import {
    building0Shader,
    building1Shader,
    building2Shader,
    building3Shader,
    building4Shader,
    building5Shader,
    building6Shader,
    building7Shader,
    building8Shader,
    building9Shader,
    building10Shader
} from './buildingShaders';

const WalkingBuildings = () => {
    return (
        <group>
            {/* bottom right */}
            <mesh position={[92.5, 20, 92.5]}>
                <boxGeometry args={[115, 40, 115]} />
                <shaderMaterial {...building0Shader} />
            </mesh>

            <mesh position={[92.5, 45, 92.5]}>
                <boxGeometry args={[75, 40, 75]} />
                <shaderMaterial {...building0Shader} />
            </mesh>

            {/* top right */}
            <mesh position={[122.5, 25, -92.5]}>
                <boxGeometry args={[40, 50, 115]} />
                <shaderMaterial {...building1Shader} />
            </mesh>

            <mesh position={[67, 20, -52.5]}>
                <boxGeometry args={[60, 40, 30]} />
                <shaderMaterial {...building2Shader} />
            </mesh>

            <mesh position={[67, 17.5, -85.5]}>
                <boxGeometry args={[60, 35, 30]} />
                <shaderMaterial {...building3Shader} />
            </mesh>

            <mesh position={[67, 42.5, -85.5]}>
                <boxGeometry args={[30, 35, 20]} />
                <shaderMaterial {...building3Shader} />
            </mesh>

            <mesh position={[67, 30, -122.5]}>
                <boxGeometry args={[60, 60, 40]} />
                <shaderMaterial {...building4Shader} />
            </mesh>

            {/* top left */}
            <mesh position={[-115.5, 50, -115.5]}>
                <boxGeometry args={[40, 100, 40]} />
                <shaderMaterial {...building5Shader} />
            </mesh>
            <mesh position={[-115.5, 25, -70.5]}>
                <boxGeometry args={[40, 50, 40]} />
                <shaderMaterial {...building6Shader} />
            </mesh>
            <mesh position={[-80.5, 40, -115.5]}>
                <boxGeometry args={[20, 80, 40]} />
                <shaderMaterial {...building7Shader} />
            </mesh>
            <mesh position={[-57.5, 19, -125.5]}>
                <boxGeometry args={[20, 40, 30]} />
                <shaderMaterial {...building8Shader} />
            </mesh>
            <mesh position={[-60.5, 14, -85.5]}>
                <boxGeometry args={[15, 30, 30]} />
                <shaderMaterial {...building9Shader} />
            </mesh>
            <mesh position={[-55.5, 10, -60.5]}>
                <boxGeometry args={[15, 20, 15]} />
                <shaderMaterial {...building10Shader} />
            </mesh>
            <mesh position={[-55.5, 19, -60.5]}>
                <boxGeometry args={[12, 20, 12]} />
                <shaderMaterial {...building10Shader} />
            </mesh>
        </group>
    )
}

export { WalkingBuildings };