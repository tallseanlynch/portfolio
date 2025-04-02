import { Color } from 'three';

const building0ColorA = new Color(0xffffff);
const building0ColorB = new Color(0xededed);
const glassColor = new Color(0xb5e2fa);

const building0Shader = {
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform vec3 uGlassColor;
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
            vec4 whiteColor = vec4(1.0, 1.0, 1.0, 1.0);
            vec4 blackColor = vec4(0.0, 0.0, 0.0, 1.0);
            vec4 transparentColor = vec4(0.0, 0.0, 0.0, 0.0);
            vec4 baseColorA = vec4(uColorA, 1.0);
            vec4 baseColorB = vec4(uColorB, 1.0);
            vec4 baseGlassColor = vec4(uGlassColor, 1.0);
            vec4 darkGlassColor = mix(blackColor, baseGlassColor, .5);
            vec4 lighterGlassColor = mix(baseGlassColor, whiteColor, .5);
            vec4 finalColor = mix(baseColorA, baseColorB, vPosition.y / 10.0);
            finalColor = vec4(vUv.x, vUv.y, 0.0, 1.0);
            float vUvXFract = fract(vUv.x * 10.0);
            if(vUvXFract > .5) {
                finalColor = baseColorA;
            } 
            if(vUvXFract < .5) {            
                finalColor = mix(whiteColor, baseColorB, vUv.y * .5);
                if(vPosition.y < -12.0) {
                    finalColor = darkGlassColor;//vec4(0.0, 0.0, 0.0, 1.0);
                    if(vUvXFract > 0.0 && vUvXFract < 0.05) {
                        finalColor = blackColor;
                    }
                    if(vUvXFract > 0.45 && vUvXFract < 0.5) {
                        finalColor = blackColor;
                    }
                }
            }
            if(vPosition.y > -12.0 && mod(vUvXFract, .1) > 0.05) {
                finalColor = whiteColor;//vec4(0.0, 0.0, 0.0, 1.0);
            }

            if(vPosition.y > 18.0) {
                finalColor = baseColorB;
            }

            if(vPosition.y > 19.5) {
                finalColor = mix(blackColor, baseColorB, .8);
            }

            gl_FragColor = finalColor;
        }
    `,
    uniforms: {
        uColorA: { value: building0ColorA },
        uColorB: { value: building0ColorB },
        uGlassColor: { value: glassColor}
    }
} 

const WalkingBuildings = () => {
    return (
        <group>
            {/* bottom right */}
            <mesh position={[92.5, 20, 92.5]}>
                <boxGeometry args={[115, 40, 115]} />
                <shaderMaterial {...building0Shader} />
                {/* <meshBasicMaterial color={0xff0000} /> */}
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