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

        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
            vec2 uv = vUv - vec2(0.5, 0.5);
            vec4 finalColor = texture2D(wingTexture, vUv);
            if(finalColor.a > 0.001) {
                finalColor = vec4(mix(color, skyColorLight, 1.0 - abs(uv.x) * 2.0), 1.0);
            }
            gl_FragColor = finalColor;
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
            vec4 finalColor = vec4(mix(color, skyColorLight, abs(vPosition.y)), 1.0);
            gl_FragColor = finalColor;
        }
    `,
}

export { insectBodyShader, insectWingsShader };