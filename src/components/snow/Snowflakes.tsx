import { BufferAttribute } from 'three';
import { useFrame } from '@react-three/fiber';
import React, {
    useMemo,
    useRef
} from 'react';
import { whiteColor } from './snowColors';

interface SnowflakesProps {
    count?: number;
    scale?: number;
};

const Snowflakes: React.FC<SnowflakesProps> = ({ count = 10000, scale = 100 }) => {
    const bufferRef = useRef<BufferAttribute>(null);
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() * scale) - (Math.random() * scale);
            pos[i * 3 + 1] = Math.random() * 20;
            pos[i * 3 + 2] = (Math.random() * scale) - (Math.random() * scale);
        }
        return pos;
    }, [count, scale]);

    useFrame(() => {
        if (bufferRef.current) {
            const positions = bufferRef.current.array;
            for (let snowI = 0; snowI < count; snowI++) {
                if (positions[(snowI * 3) + 1] < 0) {
                    positions[(snowI * 3) + 1] = 20;
                } else {
                    positions[(snowI * 3) + 1] -= 0.05;
                }
            }
            bufferRef.current.needsUpdate = true;
        }
    });

    return (
        <points>
            <bufferGeometry attach="geometry">
                <bufferAttribute
                    args={[positions, count]}
                    ref={bufferRef}
                    attach={'attributes-position'}
                    array={positions}
                    count={count}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                attach="material"
                color={whiteColor}
                size={0.25}
                sizeAttenuation={true}
            />
        </points>
    );
};

export { Snowflakes };