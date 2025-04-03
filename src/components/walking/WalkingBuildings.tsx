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
            float vUvYFract = fract(vUv.y * 10.0);
            if(vUvXFract > .5) {
                finalColor = baseColorA;
            } 
            if(vUvXFract < .5) {            
                finalColor = mix(whiteColor, baseColorB, vUv.y * .5);
                if(vPosition.y < -12.0) {
                    finalColor = mix(blackColor, baseColorB, .2);
                    // finalColor = darkGlassColor;//vec4(0.0, 0.0, 0.0, 1.0);
                    if(vUvXFract > 0.0 && vUvXFract < 0.05) {
                        finalColor = blackColor;
                    }
                    if(vUvXFract > 0.45 && vUvXFract < 0.5) {
                        finalColor = blackColor;
                    }
                }
            }
            if(vPosition.y > -12.0 && mod(vUvXFract, .1) > 0.05) {
                finalColor = whiteColor;
            }

            if(vPosition.y > -12.0 && vUvYFract > 0.5 && vUvYFract < 0.6) {
                finalColor = baseColorB;
            }

            if(vPosition.y > 18.0) {
                finalColor = baseColorB;
            }

            if(vPosition.y > 19.5) {
                finalColor = mix(blackColor, baseColorB, .8);
            }

            // gl_FragColor = mix(finalColor, baseGlassColor, .5);
            gl_FragColor = finalColor;
        }
    `,
    uniforms: {
        uColorA: { value: building0ColorA },
        uColorB: { value: building0ColorB },
        uGlassColor: { value: glassColor}
    }
} 

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

const building2Shader = {
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
            vec4 finalColor = whiteColor;//mix(baseColorA, baseColorB, vPosition.y / 20.0);
            // finalColor = vec4(vUv.x, vUv.y, 0.0, 1.0);
            float vUvXFract = fract(vUv.x * 10.0);

            if(vUvXFract > .2 && vUvXFract < .8) {
                finalColor = mix(baseColorA, baseGlassColor, vUv.y);
            } 

            if(vUvXFract > .48 && vUvXFract < .52) {
                finalColor = whiteColor;
            } 

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

            // horizontal stripes
            
            if(vPosition.y > 6.0 && vPosition.y < 6.5) {
                finalColor = whiteColor;
            }

            if(vPosition.y > 0.0 && vPosition.y < 0.5) {
                finalColor = whiteColor;
            }

            if(vPosition.y < -6.0 && vPosition.y > -6.5) {
                finalColor = whiteColor;
            }

            if(vPosition.y > -12.0 && vPosition.y < -11.5) {
                finalColor = whiteColor;
            }

            // roof

            if(vPosition.y > 18.0) {
                finalColor = whiteColor;
            }

            if(vPosition.y > 19.5) {
                finalColor = baseColorB;
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

const building3Shader = {
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
            vec4 finalColor = whiteColor;//mix(baseColorA, baseColorB, vPosition.y / 20.0);
            // finalColor = vec4(vUv.x, vUv.y, 0.0, 1.0);
            float vUvXFract = fract(vUv.x * 10.0);

            if(vUvXFract > .2 && vUvXFract < .8) {
                finalColor = mix(baseColorA, baseGlassColor, vUv.y);
            } 

            // horizontal stripes

            if(vPosition.y > 13.0 && vPosition.y < 15.0) {
                finalColor = whiteColor;
            }

            if(vPosition.y > 7.0 && vPosition.y < 9.0) {
                finalColor = whiteColor;
            }

            if(vPosition.y > 0.0 && vPosition.y < 2.0) {
                finalColor = whiteColor;
            }

            if(vPosition.y < -5.0 && vPosition.y > -10.0) {
                finalColor = whiteColor;
            }            

            if(vPosition.y < -10.0 && vUv.x < .4) {
                finalColor = whiteColor;
            }            

            // roof

            if(vPosition.y > 16.0) {
                // finalColor = baseGlassColor;
                finalColor = mix(blackColor, baseColorB, .75);
            }

            if(vPosition.y > 15.0 && vPosition.y < 16.0) {
                finalColor = baseColorB;
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

const building4Shader = {
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
            vec4 finalColor = whiteColor;//mix(baseColorA, baseColorB, vPosition.y / 20.0);
            // finalColor = vec4(vUv.x, vUv.y, 0.0, 1.0);
            float vUvXFract = fract(vUv.x * 10.0);
            float vUvYFract = fract(vUv.y * 10.0);

            // top brick

            if(vPosition.y > -16.0 && vUvYFract > 0.5 && vUvYFract < 0.75) {
                finalColor = mix(blackColor, baseColorB, .5);
            }

            if(vPosition.y > -20.0 && vUvYFract > 0.25 && vUvYFract < 0.5) {
                finalColor = mix(blackColor, baseColorB, .75);
                if(vUvXFract > 0.2 && vUvXFract < .8) {
                    finalColor = mix(blackColor, baseColorB, .2);                
                }
            }

            if(vPosition.y > 28.0) {
                finalColor = mix(blackColor, baseColorB, .2);
            }

            if(vPosition.y < -20.0) {
                finalColor = whiteColor;
                if(vUvXFract > 0.05 && vUvXFract < .95) {
                    finalColor = blackColor;
                }
            }

            gl_FragColor = finalColor;
        }
    `,
    uniforms: {
        uColorA: { value: new Color(0x000000) },
        uColorB: { value: building1ColorB },
        uGlassColor: { value: new Color(0x4f772d)}
    }
} 

const building5Shader = {
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
            vec4 finalColor = whiteColor;//mix(baseColorA, baseColorB, vPosition.y / 20.0);
            // finalColor = vec4(vUv.x, vUv.y, 0.0, 1.0);
            float vUvXFract = fract(vUv.x * 10.0);
            float vUvYFract = fract(vUv.y * 10.0);

            // top brick

            if(vPosition.y > -40.0 && vUvXFract > 0.5 && vUvXFract < 0.75) {
                finalColor = mix(blackColor, baseColorB, .5);
            }

            if(vPosition.y > -30.0 && vUvYFract > 0.25 && vUvYFract < 0.5) {
                finalColor = mix(blackColor, baseColorB, .75);
                if(vUvXFract > 0.2 && vUvXFract < .8) {
                    finalColor = mix(blackColor, baseColorB, .2);                
                }
            }

            if(vPosition.y > 48.0) {
                finalColor = mix(blackColor, baseColorB, .2);
            }

            if(vPosition.y < -40.0) {
                finalColor = whiteColor;
                if(vUvXFract > 0.05 && vUvXFract < .95) {
                    finalColor = blackColor;
                }
            }

            gl_FragColor = finalColor;
        }
    `,
    uniforms: {
        uColorA: { value: new Color(0x000000) },
        uColorB: { value: building1ColorB },
        uGlassColor: { value: new Color(0x4f772d)}
    }
} 

const building6Shader = {
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
            vec4 finalColor = blackColor;//mix(baseColorA, baseColorB, vPosition.y / 20.0);
            // finalColor = vec4(vUv.x, vUv.y, 0.0, 1.0);
            float vUvXFract = fract(vUv.x * 10.0);
            float vUvYFract = fract(vUv.y * 10.0);

            // top brick

            if(vPosition.y > -40.0 && vUvXFract > 0.5 && vUvXFract < 0.75) {
                // finalColor = mix(blackColor, baseColorB, .5);
                finalColor = whiteColor;
            }

            if(vPosition.y > -30.0 && vUvYFract > 0.25 && vUvYFract < 0.5) {
                finalColor = mix(blackColor, baseColorB, .75);
                if(vUvXFract > 0.2 && vUvXFract < .8) {
                    finalColor = mix(blackColor, baseColorB, .2);                
                }
            }

            if(vPosition.y > 20.0) {
                finalColor = mix(blackColor, baseColorB, .2);
            }

            if(vPosition.y < -15.0) {
                finalColor = blackColor;
                if(vUvXFract > 0.05 && vUvXFract < .95) {
                    finalColor = whiteColor;
                }
            }

            gl_FragColor = finalColor;
        }
    `,
    uniforms: {
        uColorA: { value: new Color(0x000000) },
        uColorB: { value: building1ColorB },
        uGlassColor: { value: new Color(0x4f772d)}
    }
} 

const building7Shader = {
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
            vec4 finalColor = blackColor;//mix(baseColorA, baseColorB, vPosition.y / 20.0);
            // finalColor = vec4(vUv.x, vUv.y, 0.0, 1.0);
            float vUvXFract = fract(vUv.x * 10.0);
            float vUvYFract = fract(vUv.y * 10.0);

            // top brick

            if(vPosition.y > -40.0 && vUvXFract > 0.5 && vUvXFract < 0.75) {
                // finalColor = mix(blackColor, baseColorB, .5);
                finalColor = whiteColor;
            }

            if(vPosition.y > -30.0 && vUvYFract > 0.1 && vUvYFract < 0.5) {
                // finalColor = mix(blackColor, baseColorB, .05);
                finalColor = whiteColor;
                // if(vUvXFract > 0.2 && vUvXFract < .8) {
                //     finalColor = mix(blackColor, baseColorB, .2);                
                // }
            }

            if(vPosition.y > 35.0) {
                finalColor = mix(blackColor, baseColorB, .2);
            }

            if(vPosition.y > 35.0 && vPosition.y < 38.0) {
                finalColor = whiteColor;
            }

            if(vPosition.y > 36.0 && vPosition.y < 37.0) {
                finalColor = mix(blackColor, baseColorB, .8);
            }

            // if(vPosition.y < -15.0) {
            //     finalColor = blackColor;
            //     if(vUvXFract > 0.05 && vUvXFract < .95) {
            //         finalColor = whiteColor;
            //     }
            // }

            gl_FragColor = finalColor;
        }
    `,
    uniforms: {
        uColorA: { value: new Color(0x000000) },
        uColorB: { value: building1ColorB },
        uGlassColor: { value: new Color(0x4f772d)}
    }
} 

const building8Shader = {
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
            vec4 finalColor = blackColor;//mix(baseColorA, baseColorB, vPosition.y / 20.0);
            // finalColor = vec4(vUv.x, vUv.y, 0.0, 1.0);
            float vUvXFract = fract(vUv.x * 10.0);
            float vUvYFract = fract(vUv.y * 10.0);

            // top brick

            // if(vPosition.y > -40.0 && vUvXFract > 0.1 && vUvXFract < 0.9) {
            //     // finalColor = mix(blackColor, baseColorB, .5);
            //     finalColor = whiteColor;
            // }

            if(vPosition.y > -30.0 && vUvYFract > 0.1 && vUvYFract < 0.9) {
                // finalColor = mix(blackColor, baseColorB, .05);
                finalColor = whiteColor;
                // if(vUvXFract > 0.2 && vUvXFract < .8) {
                //     finalColor = mix(blackColor, baseColorB, .2);                
                // }
            }

            if(vPosition.y > 18.0) {
                finalColor = mix(blackColor, baseColorB, .2);
            }

            // if(vPosition.y > 35.0 && vPosition.y < 38.0) {
            //     finalColor = whiteColor;
            // }

            // if(vPosition.y > 36.0 && vPosition.y < 37.0) {
            //     finalColor = mix(blackColor, baseColorB, .8);
            // }

            // if(vPosition.y < -15.0) {
            //     finalColor = blackColor;
            //     if(vUvXFract > 0.05 && vUvXFract < .95) {
            //         finalColor = whiteColor;
            //     }
            // }

            gl_FragColor = finalColor;
        }
    `,
    uniforms: {
        uColorA: { value: new Color(0x000000) },
        uColorB: { value: building1ColorB },
        uGlassColor: { value: new Color(0x4f772d)}
    }
} 

const building9Shader = {
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
            vec4 finalColor = whiteColor;//mix(baseColorA, baseColorB, vPosition.y / 20.0);
            // finalColor = vec4(vUv.x, vUv.y, 0.0, 1.0);
            float vUvXFract = fract(vUv.x * 10.0);
            float vUvYFract = fract(vUv.y * 10.0);

            // top brick

            // if(vPosition.y > -40.0 && vUvXFract > 0.1 && vUvXFract < 0.9) {
            //     // finalColor = mix(blackColor, baseColorB, .5);
            //     finalColor = whiteColor;
            // }

            if(vPosition.y > -30.0 && vUvYFract > 0.1 && vUvYFract < 0.9) {
                // finalColor = mix(blackColor, baseColorB, .05);
                finalColor = blackColor;
                // if(vUvXFract > 0.2 && vUvXFract < .8) {
                //     finalColor = mix(blackColor, baseColorB, .2);                
                // }
            }

            if(vPosition.y > 12.0) {
                finalColor = mix(blackColor, baseColorB, .2);
            }

            // if(vPosition.y > 35.0 && vPosition.y < 38.0) {
            //     finalColor = whiteColor;
            // }

            // if(vPosition.y > 36.0 && vPosition.y < 37.0) {
            //     finalColor = mix(blackColor, baseColorB, .8);
            // }

            // if(vPosition.y < -15.0) {
            //     finalColor = blackColor;
            //     if(vUvXFract > 0.05 && vUvXFract < .95) {
            //         finalColor = whiteColor;
            //     }
            // }

            gl_FragColor = finalColor;
        }
    `,
    uniforms: {
        uColorA: { value: new Color(0x000000) },
        uColorB: { value: building1ColorB },
        uGlassColor: { value: new Color(0x4f772d)}
    }
} 

const building10Shader = {
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

            if(vPosition.y > 7.5) {
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
                {/* <meshBasicMaterial color={0x00ffff} /> */}
            </mesh>
            <mesh position={[-115.5, 25, -70.5]}>
                <boxGeometry args={[40, 50, 40]} />
                <shaderMaterial {...building6Shader} />
                {/* <meshBasicMaterial color={0x00ff00} /> */}
            </mesh>
            <mesh position={[-80.5, 40, -115.5]}>
                <boxGeometry args={[20, 80, 40]} />
                <shaderMaterial {...building7Shader} />
                {/* <meshBasicMaterial color={0xff00ff} /> */}
            </mesh>
            <mesh position={[-57.5, 19, -125.5]}>
                <boxGeometry args={[20, 40, 30]} />
                <shaderMaterial {...building8Shader} />
                {/* <meshBasicMaterial color={0xff0000} /> */}
            </mesh>
            <mesh position={[-60.5, 14, -85.5]}>
                <boxGeometry args={[15, 30, 30]} />
                <shaderMaterial {...building9Shader} />
                {/* <meshBasicMaterial color={0xfff000} /> */}
            </mesh>
            <mesh position={[-55.5, 10, -60.5]}>
                <boxGeometry args={[15, 20, 15]} />
                <shaderMaterial {...building10Shader} />
                {/* <meshBasicMaterial color={0xffff00} /> */}
            </mesh>
            <mesh position={[-55.5, 19, -60.5]}>
                <boxGeometry args={[12, 20, 12]} />
                <shaderMaterial {...building10Shader} />
                {/* <meshBasicMaterial color={0xffff00} /> */}
            </mesh>
        </group>
    )
}

export { WalkingBuildings };