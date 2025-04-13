import { Color } from 'three';
import { useVehicleGPGPU } from './useVehicleGPGPU';
import { useEffect, useMemo, useRef } from 'react';
import { InstancedMesh, Object3D, ShaderMaterial } from 'three';
import { useFrame } from '@react-three/fiber';

const carSize = 1.5;

const Cars = ({width = 1}) => {
    const { 
        gpgpuRenderer, 
        data, 
        // startingPositionsDebugVector3 
    } = useVehicleGPGPU(width);
    const instancedMeshRef = useRef<InstancedMesh>();
    const numCars = width * width;
    const matrixPositionObject =  new Object3D;

    useEffect(() => {
        if(instancedMeshRef.current) {
            for ( let i=0 ; i<numCars ; i++ ) {
                matrixPositionObject.scale.y = carSize + 1.0;
                matrixPositionObject.position.set(0, carSize + .2, 0);        
                matrixPositionObject.updateMatrix();
                instancedMeshRef.current.setMatrixAt( i, matrixPositionObject.matrix );
                instancedMeshRef.current.frustumCulled = false;
            }
        instancedMeshRef.current.instanceMatrix.needsUpdate = true;
        instancedMeshRef.current.frustumCulled = false;
        }

    }, [])

    const carColorsRaw = [
        "555555","854d27","dd7230","f4c95d","e7e393",
        "4281a4","48a9a6","e4dfda","d4b483","c1666b",
        "fbf5f3","e28413","aaaaaa","de3c4b","c42847",
        "fbffff","605f5e","cacaca","ffffff","aed6f1"
    ];
    const carColors = carColorsRaw.map(c => new Color(`#${c}`));

    const shaderMaterial = useMemo(() => new ShaderMaterial({
        uniforms: {
            gPositionMap: { value: data.position.texture},
            gDirectionMap: { value: data.direction.texture},
            gDestinationMap: { value: data.destination.texture },
            time: { value: 0 },
            uCarColors: { value: carColors}
        },
        vertexShader: `
        uniform sampler2D gDirectionMap;
        uniform sampler2D gPositionMap;
        uniform sampler2D gDestinationMap;
        uniform float time;

        varying vec4 vPosition;
        varying vec3 vOriginalPosition;
        varying vec4 vgPosition;
        varying vec4 vgDestination;
        varying vec4 vgDirection;
        varying float vVehicleConfig;
        varying vec2 vUv;
        varying float vInstanceId;

        void main() {
            vOriginalPosition = position;
            int index = gl_InstanceID;
            vInstanceId = float(index);
            float floatIndex = float(index);

            float uvModUnit = (1.0 / ${width}.0) / 100.0;
            // float xCoor = mod(floatIndex, ${width}.0) + uvModUnit;
            // float yCoor = mod(floatIndex / ${width}.0, ${width}.0) + uvModUnit;
            // vec2 textureUv = vec2(xCoor / ${width}.0, yCoor / ${width}.0);

            float uvUnit = 1.0 / ${width}.0;
            float uvInstancedId = vInstanceId / ${width}.0;

            float uvX = fract(uvInstancedId) + uvModUnit;
            float uvY = (floor(uvInstancedId) * uvUnit) + uvModUnit;
            float xCoor = uvX;
            float yCoor = uvY;
            vec2 textureUv = vec2(uvX, uvY);

            vUv = uv;
            vec4 gDirectionData = texture2D(gDirectionMap, textureUv);        
            vec4 gPositionData = texture2D(gPositionMap, textureUv);
            vec4 gDestinationData = texture2D(gDestinationMap, textureUv);
            vgDirection = gDirectionData;
            vgPosition = gPositionData;
            vgDestination = gDestinationData;
            vec4 mvPosition = vec4( position, 1.0 );

            #ifdef USE_INSTANCING
                mvPosition = instanceMatrix * mvPosition;
                vPosition = mvPosition;
            #endif

            float angle = atan(gDirectionData.x, gDirectionData.z);
            mat4 rotationMatrix = mat4(
                cos(angle), 0.0, -sin(angle), 0.0,
                0.0, 1.0, 0.0, 0.0,
                sin(angle), 0.0, cos(angle), 0.0,
                0.0, 0.0, 0.0, 1.0
            );

            vPosition = rotationMatrix * vPosition;
            vPosition.x = vPosition.x + gPositionData.x;
            vPosition.y = vPosition.y + gPositionData.y;
            vPosition.z = vPosition.z + gPositionData.z;

            vVehicleConfig = mod(vInstanceId + xCoor * 11.5, 4.0);
            vVehicleConfig = vVehicleConfig - fract(vVehicleConfig);
            int config = int(vVehicleConfig);

            // config == 0
            float stepVehicleConfig0 = step(vVehicleConfig, .9);
            float stepVehicleConfig1 = step(.9, vVehicleConfig) * step(vVehicleConfig, 1.9);
            float stepVehicleConfig3 = step(2.9, vVehicleConfig) * step(vVehicleConfig, 3.9);

            float step0a = step(1.0, vOriginalPosition.z);
            float step0b = step(.25, vOriginalPosition.y);
            float condition0a = stepVehicleConfig0 * step0a * step0b;
            vPosition.y = mix(vPosition.y, 2.0, condition0a);

            float step0c = step(vOriginalPosition.z, -1.5);
            float step0d = step(.25, vOriginalPosition.y);
            float condition0b = stepVehicleConfig0 * step0c * step0d;
            vPosition.y = mix(vPosition.y, 2.0, condition0b);

            // config == 1
            float step1a = step(1.0, vOriginalPosition.z);
            float step1b = step(.25, vOriginalPosition.y);
            float condition1a = stepVehicleConfig1 * step1a * step1b;
            vPosition.y = mix(vPosition.y, 2.0, condition1a);

            // config == 3
            float step3a = step(vOriginalPosition.z, .5);
            float step3b = step(.225, vOriginalPosition.y);
            float condition3a = stepVehicleConfig3 * step3a * step3b;
            vPosition.y = mix(vPosition.y, 2.0, condition3a);

            gl_Position = projectionMatrix * modelViewMatrix * vPosition;
        }
        `,
        fragmentShader: `
        uniform vec3 uCarColors[${carColors.length}];

        varying vec4 vgPosition;
        varying vec3 vOriginalPosition;
        varying vec4 vgDestination;
        varying vec4 vgDirection;
        varying float vVehicleConfig;
        varying vec2 vUv;
        varying float vInstanceId;

        void main() {
            float carColorsLength = ${carColors.length}.0;
            vec4 positionColor = vgPosition;
            vec4 destinationColor = vgDestination;
            vec4 finalColor = positionColor;
            vec3 positionCalc = vec3(vgPosition.xyz);
            vec3 destinationCalc = vec3(vgDestination.xyz);
            vec3 directionCalc = vec3(vgDirection.xyz);

            float numCars = ${width * width}.0;
            int numCarsInt = int(numCars);

            // float modCarColor = mod(vInstanceId, carColorsLength);
            float modCarColor = (vInstanceId / numCars) * carColorsLength + .001;
            int modCarColorInt = int(modCarColor);
            

            vec4 white = vec4(1.0, 1.0, 1.0, 1.0);
            vec4 black = vec4(0.0, 0.0, 0.0, 1.0);
            vec4 vehicleColor = vec4(uCarColors[modCarColorInt] * 1.25, 1.0);
            vec4 mixVehicleColorBlack = mix(vehicleColor, black, .75 + vgPosition.y);
            // finalColor = vec4(uCarColors[4], 1.0);
            finalColor = vehicleColor;

            float colorFill = 0.0;
            int config = int(vVehicleConfig);

            float stepVehicleConfig0 = step(vVehicleConfig, .9);
            float stepVehicleConfig1 = step(.9, vVehicleConfig) * step(vVehicleConfig, 1.9);
            float stepVehicleConfig2 = step(1.9, vVehicleConfig) * step(vVehicleConfig, 2.9);
            float stepVehicleConfig3 = step(2.9, vVehicleConfig) * step(vVehicleConfig, 3.9);

            // if(config == 0) {

            float step0a = step(0.2, vOriginalPosition.y);
            float step0b = step(vOriginalPosition.x, -1.245);
            float step0c = step(.5, vUv.y);
            float step0d = step(vUv.y, .95);
            float step0e = step(.025, vUv.x - vUv.y * .2);
            float step0f = step(vUv.x, 0.4);
            float condition0a = stepVehicleConfig0 * step0a * step0b * step0c * step0d * step0e * step0f;
            colorFill += condition0a;

            float step0g = step(0.2, vOriginalPosition.y);
            float step0h = step(vOriginalPosition.x, -1.245);
            float step0i = step(.5, vUv.y);
            float step0j = step(vUv.y, .95);
            float step0k = step(.45, vUv.x);
            float step0l = step(vUv.x + vUv.y * .3, .95);
            float condition0b = stepVehicleConfig0 * step0g * step0h * step0i * step0j * step0k * step0l;
            colorFill += condition0b;

            float step0m = step(.2, vOriginalPosition.y);
            float step0n = step(1.245, vOriginalPosition.x);
            float step0o = step(.5, vUv.y);
            float step0p = step(vUv.y, .95);
            float step0q = step(.05, vUv.x - vUv.y * .3);
            float step0r = step(vUv.x, .55);
            float condition0c = stepVehicleConfig0 * step0m * step0n * step0o * step0p * step0q * step0r;
            colorFill += condition0c;

            float step0s = step(.2, vOriginalPosition.y);
            float step0t = step(1.245, vOriginalPosition.x);
            float step0u = step(.5, vUv.y);
            float step0v = step(vUv.y, .95);
            float step0w = step(.6, vUv.x);
            float step0x = step(vUv.x + vUv.y * .2, .975);
            float condition0d = stepVehicleConfig0 * step0s * step0t * step0u * step0v * step0w * step0x;
            colorFill += condition0d;

            float step0y = step(0.2, vOriginalPosition.y);
            float step0z = step(vOriginalPosition.z, -1.1);
            float step0aa = step(-1.5, vOriginalPosition.z);
            float step0ab = step(-.975, vOriginalPosition.x);
            float step0ac = step(vOriginalPosition.x, .975);
            float step0ad = step(.05, vUv.x);
            float step0ae = step(vUv.x, .95);
            float condition0e = stepVehicleConfig0 * step0y * step0z * step0aa * step0ab * step0ac * step0ad * step0ae;
            colorFill += condition0e;

            float step0af = step(0.2, vOriginalPosition.y);
            float step0ag = step(.6, vOriginalPosition.z);
            float step0ah = step(vOriginalPosition.z, 1.0);
            float step0ai = step(-.975, vOriginalPosition.x);
            float step0aj = step(vOriginalPosition.x, .975);
            float condition0f = stepVehicleConfig0 * step0af * step0ag * step0ah * step0ai * step0aj;
            colorFill += condition0f;
                    

            // config == 1

            float step1a = step(.2, vOriginalPosition.y);
            float step1b = step(vOriginalPosition.x, -1.245);
            float step1c = step(.5, vUv.y);
            float step1d = step(vUv.y, .95);
            float step1e = step(.025, vUv.x);
            float step1f = step(vUv.x, .4);
            float condition1a = stepVehicleConfig1 * step1a * step1b * step1c * step1d * step1e * step1f;
            colorFill += condition1a;

            float step1g = step(.2, vOriginalPosition.y);
            float step1h = step(vOriginalPosition.x, -1.245);
            float step1i = step(.5, vUv.y);
            float step1j = step(vUv.y, .95);
            float step1k = step(.45, vUv.x);
            float step1l = step(vUv.x + vUv.y * .3, .95);
            float condition1b = stepVehicleConfig1 * step1g * step1h * step1i * step1j * step1k * step1l;
            colorFill += condition1b;

            float step1m = step(.2, vOriginalPosition.y);
            float step1n = step(1.245, vOriginalPosition.x);
            float step1o = step(.5, vUv.y);
            float step1p = step(vUv.y, .95);
            float step1q = step(.05, vUv.x - vUv.y * .3);
            float step1r = step(vUv.x, .55);
            float condition1c = stepVehicleConfig1 * step1m * step1n * step1o * step1p * step1q * step1r;
            colorFill += condition1c;

            float step1s = step(.2, vOriginalPosition.y);
            float step1t = step(1.245, vOriginalPosition.x);
            float step1u = step(.5, vUv.y);
            float step1v = step(vUv.y, .95);
            float step1w = step(.6, vUv.x);
            float step1x = step(vUv.x, .975);
            float condition1d = stepVehicleConfig1 * step1s * step1t * step1u * step1v * step1w * step1x;
            colorFill += condition1d;

            float step1y = step(.2, vOriginalPosition.y);
            float step1z = step(vOriginalPosition.y, .65);
            float step1aa = step(vOriginalPosition.z, -2.49);
            float step1ab = step(-.975, vOriginalPosition.x);
            float step1ac = step(vOriginalPosition.x, .975);
            float condition1e = stepVehicleConfig1 * step1y * step1z * step1aa * step1ab * step1ac;
            colorFill += condition1e;

            float step1ad = step(.2, vOriginalPosition.y);
            float step1ae = step(.6, vOriginalPosition.z);
            float step1af = step(vOriginalPosition.z, 1.0);
            float step1ag = step(-.975, vOriginalPosition.x);
            float step1ah = step(vOriginalPosition.x, .975);
            float condition1f = stepVehicleConfig1 * step1ad * step1ae * step1af * step1ag * step1ah;
            colorFill += condition1f;


            // config == 2

            float step2a = step(.2, vOriginalPosition.y);
            float step2b = step(vOriginalPosition.x, -1.245);
            float step2c = step(.5, vUv.y);
            float step2d = step(vUv.y, .95);
            float step2e = step(.025, vUv.x);
            float step2f = step(vUv.x, .4);
            float condition2a = stepVehicleConfig2 * step2a * step2b * step2c * step2d * step2e * step2f;
            colorFill += condition2a;

            float step2g = step(.2, vOriginalPosition.y);
            float step2h = step(vOriginalPosition.x, -1.245);
            float step2i = step(.5, vUv.y);
            float step2j = step(vUv.y, .95);
            float step2k = step(.45, vUv.x);
            float step2l = step(vUv.x, .95);
            float condition2b = stepVehicleConfig2 * step2g * step2h * step2i * step2j * step2k * step2l;
            colorFill += condition2b;

            float step2m = step(.2, vOriginalPosition.y);
            float step2n = step(1.245, vOriginalPosition.x);
            float step2o = step(.5, vUv.y);
            float step2p = step(vUv.y, .95);
            float step2q = step(.05, vUv.x);
            float step2r = step(vUv.x, .55);
            float condition2c = stepVehicleConfig2 * step2m * step2n * step2o * step2p * step2q * step2r;
            colorFill += condition2c;

            float step2s = step(.2, vOriginalPosition.y);
            float step2t = step(1.245, vOriginalPosition.x);
            float step2u = step(.5, vUv.y);
            float step2v = step(vUv.y, .95);
            float step2w = step(.6, vUv.x);
            float step2x = step(vUv.x, .975);
            float condition2d = stepVehicleConfig2 * step2s * step2t * step2u * step2v * step2w * step2x;
            colorFill += condition2d;

            float step2y = step(.2, vOriginalPosition.y);
            float step2z = step(vOriginalPosition.y, .65);
            float step2aa = step(vOriginalPosition.z, -2.49);
            float step2ab = step(-.975, vOriginalPosition.x);
            float step2ac = step(vOriginalPosition.x, .975);
            float condition2e = stepVehicleConfig2 * step2y * step2z * step2aa * step2ab * step2ac;
            colorFill += condition2e;

            float step2ad = step(.2, vOriginalPosition.y);
            float step2ae = step(vOriginalPosition.y, .65);
            float step2af = step(2.0, vOriginalPosition.z);
            float step2ag = step(-.975, vOriginalPosition.x);
            float step2ah = step(vOriginalPosition.x, .975);
            float condition2f = stepVehicleConfig2 * step2ad * step2ae * step2af * step2ag * step2ah;
            colorFill += condition2f;

            float step2ai = step(.2, vOriginalPosition.y);
            float step2aj = step(1.0, vOriginalPosition.z);
            float step2ak = step(vOriginalPosition.z, 1.5);
            float step2al = step(-.975, vOriginalPosition.x);
            float step2am = step(vOriginalPosition.x, .975);
            float condition2g = stepVehicleConfig2 * step2ai * step2aj * step2ak * step2al * step2am;
            colorFill += condition2g;


            // config == 3

            float step3a = step(.2, vOriginalPosition.y);
            float step3b = step(vOriginalPosition.x, -1.245);
            float step3c = step(.5, vUv.y);
            float step3d = step(vUv.y, .95);
            float step3e = step(.65, vUv.x);
            float step3f = step(vUv.x, .95);
            float condition3a = stepVehicleConfig3 * step3a * step3b * step3c * step3d * step3e * step3f;
            colorFill += condition3a;

            float step3g = step(.2, vOriginalPosition.y);
            float step3h = step(1.245, vOriginalPosition.x);
            float step3i = step(.5, vUv.y);
            float step3j = step(vUv.y, .95);
            float step3k = step(.05, vUv.x);
            float step3l = step(vUv.x, .35);
            float condition3b = stepVehicleConfig3 * step3g * step3h * step3i * step3j * step3k * step3l;
            colorFill += condition3b;

            float step3r = step(.2, vOriginalPosition.y);
            float step3s = step(vOriginalPosition.y, .65);
            float step3t = step(2.0, vOriginalPosition.z);
            float step3u = step(-.975, vOriginalPosition.x);
            float step3v = step(vOriginalPosition.x, .975);
            float condition3d = stepVehicleConfig3 * step3r * step3s * step3t * step3u * step3v;
            colorFill += condition3d;

            float step3w = step(.2, vOriginalPosition.y);
            float step3x = step(.5, vOriginalPosition.z);
            float step3y = step(vOriginalPosition.z, .9);
            float step3z = step(-.975, vOriginalPosition.x);
            float step3aa = step(vOriginalPosition.x, .975);
            float condition3e = stepVehicleConfig3 * step3w * step3x * step3y * step3z * step3aa;
            colorFill += condition3e;


            // all vehicles
            // wheels

            float stepWa = step(vOriginalPosition.y, -.35);
            float stepWb = step(1.2, vOriginalPosition.x);
            float stepWc = step(.15, vUv.x);
            float stepWd = step(vUv.x, .3);
            float conditionW0 = stepWa * stepWb * stepWc * stepWd;
            colorFill += conditionW0;

            float stepWe = step(vOriginalPosition.y, -0.35);
            float stepWf = step(1.2, vOriginalPosition.x);
            float stepWg = step(.75, vUv.x);
            float stepWh = step(vUv.x, .9);
            float conditionW1 = stepWe * stepWf * stepWg * stepWh;
            colorFill += conditionW1;

            float stepWi = step(vOriginalPosition.y, -0.35);
            float stepWj = step(vOriginalPosition.x, -1.2);
            float stepWk = step(.15, vUv.x);
            float stepWl = step(vUv.x, .3);
            float conditionW2 = stepWi * stepWj * stepWk * stepWl;
            colorFill += conditionW2;

            float stepWm = step(vOriginalPosition.y, -.35);
            float stepWn = step(vOriginalPosition.x, -1.2);
            float stepWo = step(.75, vUv.x);
            float stepWp = step(vUv.x, .9);
            float conditionW3 = stepWm * stepWn * stepWo * stepWp;
            colorFill += conditionW3;


            float colorCondition = step(0.9, colorFill);
            finalColor = mix(vehicleColor, mixVehicleColorBlack, colorCondition);

            // finalColor = vec4(0.0, 0.0, 0.0, 1.0);
            // finalColor = vehicleColor;

            // vec3 finalColorDest = vec3(vgDestination.y, vgDestination.y, vgDestination.y) / 23.0;
            // finalColor = vec4(finalColorDest, 1.0);

            // gl_FragColor = finalColor;

            float saturation = 2.25;
            float avg = (finalColor.r + finalColor.g + finalColor.b) / 3.0;
            vec3 gray = vec3(avg, avg, avg);
            gl_FragColor = vec4(mix(gray, finalColor.rgb, saturation), finalColor.a);
        }
        `,
    }), [
        width, 
        data.position.texture,
        data.direction.texture,
        data.destination.texture,
        carColors
    ]);

    useFrame(({
        clock
    }) => {
        gpgpuRenderer.compute();

        shaderMaterial.uniforms.time.value = clock.elapsedTime;

        // positions
        shaderMaterial.uniforms.gPositionMap.value = gpgpuRenderer
            .getCurrentRenderTarget(data.position.variables.positionVariable).texture;
        data.position.variables.positionVariable.material.uniforms.uTime.value = clock.elapsedTime;
        data.position.variables.positionVariable.material.uniforms.uDeltaTime.value = clock.getDelta();

        // direction
        shaderMaterial.uniforms.gDirectionMap.value = gpgpuRenderer
            .getCurrentRenderTarget(data.direction.variables.directionVariable).texture;
        data.direction.variables.directionVariable.material.uniforms.uTime.value = clock.elapsedTime; // seconds as float -- not miliseconds
        data.direction.variables.directionVariable.material.uniforms.uDeltaTime.value = clock.getDelta();

        // destination
        shaderMaterial.uniforms.gDestinationMap.value = gpgpuRenderer
            .getCurrentRenderTarget(data.destination.variables.destinationVariable).texture;
        data.destination.variables.destinationVariable.material.uniforms.uTime.value = clock.elapsedTime;
        data.destination.variables.destinationVariable.material.uniforms.uDeltaTime.value = clock.getDelta();

    });

    return (
        <>
            <instancedMesh 
                ref={instancedMeshRef} 
                args={[null as any, null as any, numCars]} 
                material={shaderMaterial}
            >
                <boxGeometry args={[2.5, carSize, 5.0, 10, 10, 10]} />
            </instancedMesh>
            {/* {startingPositionsDebugVector3.map((v, vi) => (
                <mesh position={v} key={vi}>
                    <boxGeometry args={[.5, .5, .5]} />
                    <meshBasicMaterial color={0xff0000}/>
                </mesh>
            ))} */}
        </>
    )
}

const WalkingCars = () => {
    return (
        <Cars width={10} />
    )
}

export { WalkingCars };