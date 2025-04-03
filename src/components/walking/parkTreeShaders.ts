import { Color } from 'three';

const parkTreesColor = new Color(0x4f772d);
const parkTreeTrunkColor = new Color(0xa04000);
const parkTreeBColor = new Color(0x57cc99);
const parkTreeColorCold = new Color(0x005f73);
const parkTreeTrunkColorWarm = new Color(0xffba08);
const parkTreeBTrunkColor = new Color(0x5f0f40);
const parkTreeCColor = new Color(0xabc798);

const treeTrunkShaderA = {
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
        uniform vec3 uColor;
        uniform vec3 uWarmColor;
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
            vec4 whiteColor = vec4(1.0, 1.0, 1.0, 1.0);
            vec4 transparentColor = vec4(0.0, 0.0, 0.0, 0.0);
            vec4 baseColor = vec4(uColor, 1.0);
            vec4 baseWarmColor = vec4(uWarmColor, 1.0);
            vec4 finalColor = mix(baseColor, baseWarmColor, vPosition.y / 10.0);

            gl_FragColor = finalColor;
        }
    `,
    uniforms: {
        uColor: { value: parkTreeTrunkColor },
        uWarmColor: { value: parkTreeTrunkColorWarm }
    }
};    

const treeTrunkShaderB = {
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
        uniform vec3 uColor;
        uniform vec3 uWarmColor;
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
            vec4 whiteColor = vec4(1.0, 1.0, 1.0, 1.0);
            vec4 transparentColor = vec4(0.0, 0.0, 0.0, 0.0);
            vec4 baseColor = vec4(uColor, 1.0);
            vec4 baseWarmColor = vec4(uWarmColor, 1.0);
            vec4 finalColor = mix(baseColor, baseWarmColor, vPosition.y / 10.0);

            gl_FragColor = finalColor;
        }
    `,
    uniforms: {
        uColor: { value: parkTreeBTrunkColor },
        uWarmColor: { value: parkTreeTrunkColor }
    }
};    

const treeLeafShaderA = {
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
        uniform vec3 uColor;
        uniform vec3 uWarmColor;
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
            vec4 whiteColor = vec4(1.0, 1.0, 1.0, 1.0);
            vec4 transparentColor = vec4(0.0, 0.0, 0.0, 0.0);
            vec4 baseColor = vec4(uColor, 1.0);
            vec4 baseWarmColor = vec4(uWarmColor, 1.0);
            vec4 finalColor = mix(baseColor, baseWarmColor, vPosition.y / 40.0);

            gl_FragColor = finalColor;
            // gl_FragColor = vec4(vUv.x, vUv.y, 0.0, 1.0);
        }
    `,
    uniforms: {
        uColor: { value: parkTreesColor },
        uWarmColor: { value: parkTreeTrunkColorWarm }
    }
};    

const treeLeafShaderB = {
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
        uniform vec3 uColor;
        uniform vec3 uWarmColor;
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
            vec4 whiteColor = vec4(1.0, 1.0, 1.0, 1.0);
            vec4 transparentColor = vec4(0.0, 0.0, 0.0, 0.0);
            vec4 baseColor = vec4(uColor, 1.0);
            vec4 baseWarmColor = vec4(uWarmColor, 1.0);
            vec4 finalColor = mix(baseColor, baseWarmColor, vPosition.y / 20.0);

            gl_FragColor = finalColor;
            // gl_FragColor = vec4(vUv.x, vUv.y, 0.0, 1.0);
        }
    `,
    uniforms: {
        uColor: { value: parkTreeBColor },
        uWarmColor: { value: parkTreeColorCold }
    }
};

const treeLeafShaderC = {
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
        uniform vec3 uColor;
        uniform vec3 uWarmColor;
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
            vec4 whiteColor = vec4(1.0, 1.0, 1.0, 1.0);
            vec4 transparentColor = vec4(0.0, 0.0, 0.0, 0.0);
            vec4 baseColor = vec4(uColor, 1.0);
            vec4 baseWarmColor = vec4(uWarmColor, 1.0);
            vec4 finalColor = mix(baseColor, baseWarmColor, vPosition.y / 20.0);

            gl_FragColor = finalColor;
            // gl_FragColor = vec4(vUv.x, vUv.y, 0.0, 1.0);
        }
    `,
    uniforms: {
        uColor: { value: parkTreeColorCold },
        uWarmColor: { value: parkTreeCColor }
    }
};

export { 
    treeTrunkShaderA,
    treeLeafShaderA,
    treeTrunkShaderB,
    treeLeafShaderB,
    treeLeafShaderC,
};