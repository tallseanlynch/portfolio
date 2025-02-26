import { useState } from 'react';
import {
    useFrame,
    useLoader
} from '@react-three/fiber';
import {
    TextureLoader,
    DoubleSide
} from 'three';
import { skyColorLight } from './insectsColors';
import { insectBodyShader, insectWingsShader } from './insectsShaders';

const InsectsButterfly = ({color, patternSpots, insectGroupRef}) => {
    const butterflyWingTextureLeft = useLoader(TextureLoader, './insects/butterfly-wings-alpha.png');
    const [insectWingRotation, setInsectWingRotation] = useState<number>(0);
    const [butterWingFlapInitial] = useState(Math.random() * 100);

    const butterflyShaderLeftUniforms = {
        wingTexture: {
            value: butterflyWingTextureLeft
        },
        color: {
            value: color
        },
        skyColorLight: {
            value: skyColorLight
        },
        flipX: {
            value: false
        },
        clientPatternSpots: { value: patternSpots }
    };

    const butterflyShaderRightUniforms = {
        wingTexture: {
            value: butterflyWingTextureLeft
        },
        color: {
            value: color
        },
        skyColorLight: {
            value: skyColorLight
        },
        flipX: {
            value: true
        },
        clientPatternSpots: { value: patternSpots }
    };

    const butterflyShaderBodyUniforms = {
        color: {
            value: color
        },
        skyColorLight: {
            value: skyColorLight
        }
    };

    useFrame(({clock}) => {
        setInsectWingRotation(Math.sin((clock.elapsedTime + butterWingFlapInitial) * 6) / (1.5));
    })

    return (
        <group
            rotation={[-.75, 0, 0]}
            ref={insectGroupRef}
        >
            <mesh
                position={[-.05,.75,.175]}
                rotation={[.5,0,.125]}
            >
                <cylinderGeometry args={[.02, .02, .75, 4, 1]} />
                <meshBasicMaterial 
                    color={color}
                />
            </mesh>
            <mesh
                position={[.05,.75,.175]}
                rotation={[.5,0,-.125]}
            >
                <cylinderGeometry args={[.02, .02, .75, 4, 1]} />
                <meshBasicMaterial 
                    color={color}
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
            </mesh>
            <mesh 
                rotation={[0, .5 + insectWingRotation, 0]}
                position={[-0.045,0,0]}
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
                position={[0.045,0,0]}
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
    )
}

export { InsectsButterfly }