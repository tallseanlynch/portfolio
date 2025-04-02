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

const building1ColorA = new Color(0x555555);
const building1ColorB = new Color(0xededed);

const building1Shader = {
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
            vec4 finalColor = mix(baseColorA, baseColorB, vPosition.y / 20.0);
            // finalColor = vec4(vUv.x, vUv.y, 0.0, 1.0);
            float vUvXFract = fract(vUv.x * 10.0);

            if(vUvXFract > .1 && vUvXFract < .9) {
                finalColor = mix(baseColorA, baseGlassColor, vUv.y);
            } 

            if(vUvXFract > .48 && vUvXFract < .52) {
                finalColor = whiteColor;
            } 

            // bottom brick

            // if(vPosition.y < -12.0 && mod(vUvXFract, .1) > 0.01 && mod(vUvXFract, .1) < 0.09) {
            //     finalColor = mix(blackColor, baseColorB, .5);
            //     // finalColor = whiteColor;
            // }

            // horizontal stripes

            if(vPosition.y < -12.0 && vUv.x > 0.4 && vUv.x < 0.6) {
                finalColor = baseColorA;
            }

            if(vPosition.y < -12.0 && vUv.x > 0.4 && vUv.x < 0.42) {
                finalColor = whiteColor;
            }

            if(vPosition.y < -12.0 && vUv.x > 0.58 && vUv.x < 0.6) {
                finalColor = whiteColor;
            }

            if(vPosition.y > 12.0 && vPosition.y < 12.5) {
                finalColor = whiteColor;
            }

            // bottom side doors

            if(vPosition.y > 6.0 && vPosition.y < 6.5) {
                finalColor = whiteColor;
            }

            if(vPosition.y > 0.0 && vPosition.y < 0.5) {
                finalColor = whiteColor;
            }

            if(vPosition.y > -12.0 && vPosition.y < -11.5) {
                finalColor = whiteColor;
            }

            // roof

            if(vPosition.y > 18.0) {
                finalColor = baseColorB;
            }

            if(vPosition.y > 19.5) {
                finalColor = mix(baseColorA, baseColorB, .2);
            }

            if(vPosition.y > 22.5) {
                finalColor = blackColor;
            }

            if(vPosition.y < -6.0 && vPosition.y > -6.5) {
                finalColor = whiteColor;
            }

            gl_FragColor = finalColor;
        }
    `,
    uniforms: {
        uColorA: { value: new Color(0x005f73) },
        uColorB: { value: building1ColorB },
        uGlassColor: { value: new Color(0x4f772d)}
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
            <mesh position={[122.5, 25, -92.5]}>
                <boxGeometry args={[40, 50, 115]} />
                <shaderMaterial {...building1Shader} />
                {/* <meshBasicMaterial color={0x0000ff} /> */}
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