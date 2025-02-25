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
                finalColor = mix(finalColor, vec4(skyColorLight, 1.0), vUvCopy.y);

                float spotColor = 0.0;
                float spotColorWhite = 0.0;
                for(int i = 0; i < 5; i++) {
                    vec3 patternSpot = clientPatternSpots[i];
                    if(flipX) {
                        patternSpot.x = patternSpot.x * -1.0;
                    }

                    float distanceFromSpot = distance(patternSpot, vPosition);
                    if(distanceFromSpot < .6) {
                        spotColor += .2 * (.6 / distanceFromSpot);
                    }
                    if(distanceFromSpot < .15) {
                        spotColorWhite +=.5 * (.15 / distanceFromSpot);
                    }
                    if(distanceFromSpot < .1) {
                        spotColorWhite += 1.0;
                    }
                }
                
                float spotColorj = 0.0;
                float spotColorWhitej = 0.0;
                for(int j = 0; j < 5; j++) {
                    vec3 patternSpotj = clientPatternSpots[j];
                    if(flipX) {
                        patternSpotj.x = patternSpotj.x * -1.0;
                    }
                    patternSpotj * 1.5;

                    float distanceFromSpotj = distance(patternSpotj, vPosition);
                    if(distanceFromSpotj < .6) {
                        spotColorj += .2 * (.6 / distanceFromSpotj);
                    }
                    // if(distanceFromSpotj < .15) {
                    //     spotColorWhitej +=.5 * (.15 / distanceFromSpotj);
                    // }
                    if(distanceFromSpotj < .05) {
                        spotColorWhitej += 1.0;
                    }
                }
                finalColor = mix(finalColor, vec4(skyColorLight, 1.0), spotColorj);                
                
                finalColor = mix(finalColor, vec4(color, 1.0), spotColor);                
                finalColor = mix(finalColor, vec4(whiteColor, 1.0), spotColorWhite);                
                finalColor = mix(finalColor, vec4(vec3(0.0, 0.0, 0.0), 1.0), spotColorWhitej);                
            }

            float saturation = 1.5;
            float avg = (finalColor.r + finalColor.g + finalColor.b) / 3.0;
            vec3 gray = vec3(avg, avg, avg);
            gl_FragColor = vec4(mix(gray, finalColor.rgb, saturation), finalColor.a);

//            gl_FragColor = finalColor;
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