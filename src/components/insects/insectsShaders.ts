const insectWingsShader = {
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 color;
        uniform vec3 skyColorLight;
        uniform sampler2D wingTexture;
        uniform bool flipX;
        uniform vec3 clientPatternSpots[5];

        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
            vec2 vUvCopy = vUv;
            if(flipX) {
                vUvCopy.x = 1.0 - vUvCopy.x;
            }
            vec4 finalColor = texture2D(wingTexture, vUvCopy);
            vec3 whiteColor = vec3(1.0, 1.0, 1.0);
            if(finalColor.a > 0.001) {
                // finalColor = vec4(mix(color, skyColorLight, abs(vUvCopy.x) * 2.0), 1.0);
                finalColor = vec4(mix(color, whiteColor, abs(vUvCopy.x) * 2.0), 1.0);
//                vec4 skyColorMix = 
                finalColor = mix(finalColor, vec4(skyColorLight, 1.0), vUvCopy.y);
                float spotColor = 0.0;
                for(int i = 0; i < 5; i++) {
                    vec3 patternSpot = clientPatternSpots[i];
                    if(flipX) {
                        patternSpot.x = patternSpot.x * -1.0;
                    }
                    patternSpot.y -= .1;

                    float distanceFromSpot = distance(patternSpot, vPosition);
                    if(distanceFromSpot < .6) {
                        spotColor += .2;
                    }
                    if(distanceFromSpot < .1) {
                        spotColor += 1.0;
                    }

                }
                finalColor = mix(finalColor, vec4(whiteColor, 1.0), spotColor);                
            }
            gl_FragColor = finalColor;
            // gl_FragColor = vec4(vPosition, 1.0);
        }
    `,
}

const insectBodyShader = {
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 color;
        uniform vec3 skyColorLight;

        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
            vec2 uv = vUv - vec2(0.5, 0.5);
            vec3 whiteColor = vec3(1.0, 1.0, 1.0);
            vec4 finalColor = vec4(mix(color, whiteColor, abs(vPosition.y)), 1.0);
            // vec4 finalColor = vec4(mix(color, skyColorLight, abs(vPosition.y)), 1.0);
            gl_FragColor = finalColor;
        }
    `,
}

export { insectBodyShader, insectWingsShader };