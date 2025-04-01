// import { pathData } from './pathData';
import { Color, Line, Vector3 } from 'three';
import { useVehicleGPGPU } from './useVehicleGPGPU';
import { useEffect, useMemo, useRef } from 'react';
import { InstancedMesh, Object3D, ShaderMaterial } from 'three';
import { useFrame } from '@react-three/fiber';

const carSize = 1.5;
// const instanceScale = .75;

const Cars = ({width = 1}) => {
    const { gpgpuRenderer, data } = useVehicleGPGPU(width);
    const instancedMeshRef = useRef<InstancedMesh>();
    const numCars = width * width;
    const matrixPositionObject =  new Object3D;

    useEffect(() => {
        if(instancedMeshRef.current) {
            for ( let i=0 ; i<numCars ; i++ ) {
                matrixPositionObject.scale.y = carSize + 1.0;//2.0 + (Math.random() * instanceScale) - instanceScale / 2;
//                matrixPositionObject.position.set(0, matrixPositionObject.scale.y / 2, 0);        
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
        "fbffff","605f5e","cacaca","ffffff","247ba0"
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
            float xCoor = mod(floatIndex, ${width}.0);
            float yCoor = mod(floatIndex / ${width}.0, ${width}.0);
            vec2 textureUv = vec2(xCoor / ${width}.0, yCoor / ${width}.0);
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
            // vVehicleConfig = 3.0;

            if(vVehicleConfig == 0.0) {
                if(vOriginalPosition.z > 1.0 && vOriginalPosition.y > .25) {
                    vPosition.y = 2.0;
                }

                if(vOriginalPosition.z < -1.5 && vOriginalPosition.y > .25) {
                    vPosition.y = 2.0;
                }            
            }

            if(vVehicleConfig == 1.0) {
                if(vOriginalPosition.z > 1.0 && vOriginalPosition.y > .25) {
                    vPosition.y = 2.0;
                }

                // if(vOriginalPosition.z < -1.5 && vOriginalPosition.y > .25) {
                //     vPosition.y = 2.0;
                // }            
            }

            // if(vVehicleConfig == 2.0) {
            //     // if(vOriginalPosition.z > 1.0 && vOriginalPosition.y > .25) {
            //     //     vPosition.y = 2.0;
            //     // }

            //     // if(vOriginalPosition.z < -1.5 && vOriginalPosition.y > .25) {
            //     //     vPosition.y = 2.0;
            //     // }            
            // }

            if(vVehicleConfig == 3.0) {
                if(vOriginalPosition.z < .5 && vOriginalPosition.y > .225) {
                    vPosition.y = 2.0;
                }
            }

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

            // if(vOriginalPosition.z > 0.0) {
            //     finalColor = vec4(1.0, 1.0, 1.0, 1.0);
            // }

            float modCarColor = mod(vInstanceId, carColorsLength);
            int modCarColorInt = int(modCarColor);

            vec4 white = vec4(1.0, 1.0, 1.0, 1.0);
            vec4 black = vec4(0.0, 0.0, 0.0, 1.0);
            vec4 vehicleColor = vec4(uCarColors[modCarColorInt] * 1.25, 1.0);
            vec4 mixVehicleColorBlack = mix(vehicleColor, black, .75);

            if(vVehicleConfig == 0.0) {
                // finalColor = vec4(vUv, 0.0, 1.0);                
                // finalColor = white;                
                // finalColor = vec4(uCarColors[modCarColorInt] * 1.5, 1.0);                
                // finalColor = vec4(uCarColors[modCarColorInt] * (1.25 + vInstanceId / 50.0), 1.0);                
                // finalColor = vec4(uCarColors[modCarColorInt] * 1.25, 1.0);                

                finalColor = vehicleColor;
                // finalColor = vec4(vUv, 0.0, 1.0);                

                if(
                    vOriginalPosition.y > 0.2 && vOriginalPosition.x < -1.245 && 
                    vUv.y > .5 && vUv.y < .95 && 
                    vUv.x - vUv.y * .2 > .025 && vUv.x < 0.4
                ) {
                    finalColor = mixVehicleColorBlack;
                }

                if(
                    vOriginalPosition.y > 0.2 && vOriginalPosition.x < -1.245 && 
                    vUv.y > .5 && vUv.y < .95 && 
                    vUv.x > .45 && vUv.x + vUv.y * .3 < .95
                ) {
                    finalColor = mixVehicleColorBlack;
                }


                if(
                    vOriginalPosition.y > 0.2 && vOriginalPosition.x > 1.245 && 
                    vUv.y > .5 && vUv.y < .95 && 
                    vUv.x - vUv.y * .3 > .05 && vUv.x < 0.55
                ) {
                    finalColor = mixVehicleColorBlack;
                }

                if(
                    vOriginalPosition.y > 0.2 && vOriginalPosition.x > 1.245 && 
                    vUv.y > .5 && vUv.y < .95 && 
                    vUv.x > .6 && vUv.x + vUv.y * .2 < .975
                ) {
                    finalColor = mixVehicleColorBlack;
                }

                if(
                    vOriginalPosition.y > 0.2 
                    && vOriginalPosition.z < -1.5
                    && vOriginalPosition.z > -2.0
                    && vOriginalPosition.x > -.975
                    && vOriginalPosition.x < .975
                    && vUv.x > .05
                    && vUv.x < .95
                ) {
                    finalColor = mixVehicleColorBlack;
                }

                if(
                    vOriginalPosition.y > 0.2
                    && vOriginalPosition.z > 1.0
                    && vOriginalPosition.z < 1.5
                    && vOriginalPosition.x > -.975
                    && vOriginalPosition.x < .975
                    // && vUv.x > .05
                    // && vUv.x < .95
                ) {
                    finalColor = mixVehicleColorBlack;
                }

                // wheels lol
                if(
                    vOriginalPosition.y < -0.35
                    && vOriginalPosition.x > 1.2
                    && vUv.x > .15
                    && vUv.x < .3
                ) {
                    finalColor = mixVehicleColorBlack;
                }

                if(
                    vOriginalPosition.y < -0.35
                    && vOriginalPosition.x > 1.2
                    && vUv.x > .75
                    && vUv.x < .9
                ) {
                    finalColor = mixVehicleColorBlack;
                }

                if(
                    vOriginalPosition.y < -0.35
                    && vOriginalPosition.x < -1.2
                    && vUv.x > .15
                    && vUv.x < .3
                ) {
                    finalColor = mixVehicleColorBlack;
                }

                if(
                    vOriginalPosition.y < -0.35
                    && vOriginalPosition.x < -1.2
                    && vUv.x > .75
                    && vUv.x < .9
                ) {
                    finalColor = mixVehicleColorBlack;
                }


            }

            if(vVehicleConfig == 1.0) {
                // finalColor = vec4(vUv, 0.0, 1.0);                
                // finalColor = white;                
                // finalColor = vec4(uCarColors[modCarColorInt] * 1.5, 1.0);                
                // finalColor = vec4(uCarColors[modCarColorInt] * (1.25 + vInstanceId / 50.0), 1.0);                
                // finalColor = vec4(uCarColors[modCarColorInt] * 1.25, 1.0);                

                finalColor = vehicleColor;
                // finalColor = vec4(vUv, 0.0, 1.0);                

                if(
                    vOriginalPosition.y > 0.2 && vOriginalPosition.x < -1.245 && 
                    vUv.y > .5 && vUv.y < .95 && 
                    vUv.x > .025 && vUv.x < 0.4
                ) {
                    finalColor = mixVehicleColorBlack;
                }

                if(
                    vOriginalPosition.y > 0.2 && vOriginalPosition.x < -1.245 && 
                    vUv.y > .5 && vUv.y < .95 && 
                    vUv.x > .45 && vUv.x + vUv.y * .3 < .95
                ) {
                    finalColor = mixVehicleColorBlack;
                }


                if(
                    vOriginalPosition.y > 0.2 && vOriginalPosition.x > 1.245 && 
                    vUv.y > .5 && vUv.y < .95 && 
                    vUv.x - vUv.y * .3 > .05 && vUv.x < 0.55
                ) {
                    finalColor = mixVehicleColorBlack;
                }

                if(
                    vOriginalPosition.y > 0.2 && vOriginalPosition.x > 1.245 && 
                    vUv.y > .5 && vUv.y < .95 && 
                    vUv.x > .6 && vUv.x < .975
                ) {
                    finalColor = mixVehicleColorBlack;
                }

                if(
                    vOriginalPosition.y > 0.2 
                    && vOriginalPosition.y < .65 
                    && vOriginalPosition.z < -2.49
                    // && vOriginalPosition.z > -2.0
                    && vOriginalPosition.x > -.975
                    && vOriginalPosition.x < .975
                    
                    // && vUv.x > .05
                    // && vUv.x < .95
                ) {
                    finalColor = mixVehicleColorBlack;
                }

                if(
                    vOriginalPosition.y > 0.2
                    && vOriginalPosition.z > 1.0
                    && vOriginalPosition.z < 1.5
                    && vOriginalPosition.x > -.975
                    && vOriginalPosition.x < .975
                    // && vUv.x > .05
                    // && vUv.x < .95
                ) {
                    finalColor = mixVehicleColorBlack;
                }

                // wheels lol
                if(
                    vOriginalPosition.y < -0.35
                    && vOriginalPosition.x > 1.2
                    && vUv.x > .15
                    && vUv.x < .3
                ) {
                    finalColor = mixVehicleColorBlack;
                }

                if(
                    vOriginalPosition.y < -0.35
                    && vOriginalPosition.x > 1.2
                    && vUv.x > .75
                    && vUv.x < .9
                ) {
                    finalColor = mixVehicleColorBlack;
                }

                if(
                    vOriginalPosition.y < -0.35
                    && vOriginalPosition.x < -1.2
                    && vUv.x > .15
                    && vUv.x < .3
                ) {
                    finalColor = mixVehicleColorBlack;
                }

                if(
                    vOriginalPosition.y < -0.35
                    && vOriginalPosition.x < -1.2
                    && vUv.x > .75
                    && vUv.x < .9
                ) {
                    finalColor = mixVehicleColorBlack;
                }

            }

            if(vVehicleConfig == 2.0) {
                // finalColor = vec4(vUv, 0.0, 1.0);                
                // finalColor = white;                
                // finalColor = vec4(uCarColors[modCarColorInt] * 1.5, 1.0);                
                // finalColor = vec4(uCarColors[modCarColorInt] * (1.25 + vInstanceId / 50.0), 1.0);                
                // finalColor = vec4(uCarColors[modCarColorInt] * 1.25, 1.0);                

                finalColor = vehicleColor;
                // finalColor = vec4(vUv, 0.0, 1.0);                

                if(
                    vOriginalPosition.y > 0.2 && vOriginalPosition.x < -1.245 && 
                    vUv.y > .5 && vUv.y < .95 && 
                    vUv.x > .025 && vUv.x < 0.4
                ) {
                    finalColor = mixVehicleColorBlack;
                }

                if(
                    vOriginalPosition.y > 0.2 && vOriginalPosition.x < -1.245 && 
                    vUv.y > .5 && vUv.y < .95 && 
                    vUv.x > .45 && vUv.x < .95
                ) {
                    finalColor = mixVehicleColorBlack;
                }


                if(
                    vOriginalPosition.y > 0.2 && vOriginalPosition.x > 1.245 && 
                    vUv.y > .5 && vUv.y < .95 && 
                    vUv.x > .05 && vUv.x < 0.55
                ) {
                    finalColor = mixVehicleColorBlack;
                }

                if(
                    vOriginalPosition.y > 0.2 && vOriginalPosition.x > 1.245 && 
                    vUv.y > .5 && vUv.y < .95 && 
                    vUv.x > .6 && vUv.x < .975
                ) {
                    finalColor = mixVehicleColorBlack;
                }

                if(
                    vOriginalPosition.y > 0.2 
                    && vOriginalPosition.y < .65 
                    && vOriginalPosition.z < -2.49
                    // && vOriginalPosition.z > -2.0
                    && vOriginalPosition.x > -.975
                    && vOriginalPosition.x < .975
                    
                    // && vUv.x > .05
                    // && vUv.x < .95
                ) {
                    finalColor = mixVehicleColorBlack;
                }

                if(
                    vOriginalPosition.y > 0.2 
                    && vOriginalPosition.y < .65 
                    && vOriginalPosition.z > 2.0
                    && vOriginalPosition.x > -.975
                    && vOriginalPosition.x < .975
                    
                    // && vUv.x > .05
                    // && vUv.x < .95
                ) {
                    finalColor = mixVehicleColorBlack;
                }

                if(
                    vOriginalPosition.y > 0.2
                    && vOriginalPosition.z > 1.0
                    && vOriginalPosition.z < 1.5
                    && vOriginalPosition.x > -.975
                    && vOriginalPosition.x < .975
                    // && vUv.x > .05
                    // && vUv.x < .95
                ) {
                    finalColor = mixVehicleColorBlack;
                }

                // wheels lol
                if(
                    vOriginalPosition.y < -0.35
                    && vOriginalPosition.x > 1.2
                    && vUv.x > .15
                    && vUv.x < .3
                ) {
                    finalColor = mixVehicleColorBlack;
                }

                if(
                    vOriginalPosition.y < -0.35
                    && vOriginalPosition.x > 1.2
                    && vUv.x > .75
                    && vUv.x < .9
                ) {
                    finalColor = mixVehicleColorBlack;
                }

                if(
                    vOriginalPosition.y < -0.35
                    && vOriginalPosition.x < -1.2
                    && vUv.x > .15
                    && vUv.x < .3
                ) {
                    finalColor = mixVehicleColorBlack;
                }

                if(
                    vOriginalPosition.y < -0.35
                    && vOriginalPosition.x < -1.2
                    && vUv.x > .75
                    && vUv.x < .9
                ) {
                    finalColor = mixVehicleColorBlack;
                }

            }

            if(vVehicleConfig == 3.0) {
                // finalColor = vec4(vUv, 0.0, 1.0);                
                // finalColor = white;                
                // finalColor = vec4(uCarColors[modCarColorInt] * 1.5, 1.0);                
                // finalColor = vec4(uCarColors[modCarColorInt] * (1.25 + vInstanceId / 50.0), 1.0);                
                // finalColor = vec4(uCarColors[modCarColorInt] * 1.25, 1.0);                

                finalColor = vehicleColor;
                // finalColor = vec4(vUv, 0.0, 1.0);                

                // if(
                //     vOriginalPosition.y > 0.2 && vOriginalPosition.x < -1.245 && 
                //     vUv.y > .5 && vUv.y < .95 && 
                //     vUv.x > .025 && vUv.x < 0.4
                // ) {
                //     finalColor = mixVehicleColorBlack;
                // }

                if(
                    vOriginalPosition.y > 0.2 && vOriginalPosition.x < -1.245 && 
                    vUv.y > .5 && vUv.y < .95 && 
                    vUv.x > .65 && vUv.x < .95
                ) {
                    finalColor = mixVehicleColorBlack;
                }


                if(
                    vOriginalPosition.y > 0.2 && vOriginalPosition.x > 1.245 && 
                    vUv.y > .5 && vUv.y < .95 && 
                    vUv.x > .05 && vUv.x < 0.35
                ) {
                    finalColor = mixVehicleColorBlack;
                }

                // if(
                //     vOriginalPosition.y > 0.2 && vOriginalPosition.x > 1.245 && 
                //     vUv.y > .5 && vUv.y < .95 && 
                //     vUv.x > .6 && vUv.x < .975
                // ) {
                //     finalColor = mixVehicleColorBlack;
                // }

                if(
                    vOriginalPosition.y > 0.2 
                    && vOriginalPosition.y < .65 
                    && vOriginalPosition.z < -2.49
                    && vOriginalPosition.x > -.975
                    && vOriginalPosition.x < .975
                ) {
                    finalColor = mixVehicleColorBlack;
                }

                if(
                    vOriginalPosition.y > 0.2 
                    && vOriginalPosition.y < .65 
                    && vOriginalPosition.z > 2.0
                    && vOriginalPosition.x > -.975
                    && vOriginalPosition.x < .975
                ) {
                    finalColor = mixVehicleColorBlack;
                }

                if(
                    vOriginalPosition.y > 0.2
                    && vOriginalPosition.z > 0.2
                    && vOriginalPosition.z < .45
                    && vOriginalPosition.x > -.975
                    && vOriginalPosition.x < .975
                ) {
                    finalColor = mixVehicleColorBlack;
                }

                // wheels lol
                if(
                    vOriginalPosition.y < -0.35
                    && vOriginalPosition.x > 1.2
                    && vUv.x > .15
                    && vUv.x < .3
                ) {
                    finalColor = mixVehicleColorBlack;
                }

                if(
                    vOriginalPosition.y < -0.35
                    && vOriginalPosition.x > 1.2
                    && vUv.x > .75
                    && vUv.x < .9
                ) {
                    finalColor = mixVehicleColorBlack;
                }

                if(
                    vOriginalPosition.y < -0.35
                    && vOriginalPosition.x < -1.2
                    && vUv.x > .15
                    && vUv.x < .3
                ) {
                    finalColor = mixVehicleColorBlack;
                }

                if(
                    vOriginalPosition.y < -0.35
                    && vOriginalPosition.x < -1.2
                    && vUv.x > .75
                    && vUv.x < .9
                ) {
                    finalColor = mixVehicleColorBlack;
                }

            }


            // if(distance(positionCalc, destinationCalc) < .25) {
            // finalColor = vec4(.5, .5, .5, 1.0);
            // }

            // if(distance(positionCalc, destinationCalc) < 1.5 && vgDirection.w < .01) {
            // finalColor = vec4(.5, .5, .5, 1.0);
            // }

            float saturation = 2.25;
            float avg = (finalColor.r + finalColor.g + finalColor.b) / 3.0;
            vec3 gray = vec3(avg, avg, avg);
            // gl_FragColor = vec4(mix(gray, finalColor.rgb, saturation), finalColor.a) * (1.0 + vInstanceId/200.0);
            gl_FragColor = vec4(mix(gray, finalColor.rgb, saturation), finalColor.a);


            // gl_FragColor = finalColor;
        }
        `,
        // side: DoubleSide
    }), [
        width, 
        data.position.texture,
        data.direction.texture,
        data.destination.texture,
        carColors
    ]);

    useFrame(({
        clock,
        // gl
    }) => {

        // computer renderer
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
        // console.log(clock.elapsedTime)
        // data.direction.variables.directionVariable.material.uniforms.uActiveLightNumber.value = lightsTime.activeLightNumber;
        // data.direction.variables.directionVariable.material.uniforms.uActiveLightTimeLeft.value = lightsTime.activeLightTimeLeft;

        // destination
        shaderMaterial.uniforms.gDestinationMap.value = gpgpuRenderer
            .getCurrentRenderTarget(data.destination.variables.destinationVariable).texture;
        data.destination.variables.destinationVariable.material.uniforms.uTime.value = clock.elapsedTime;
        data.destination.variables.destinationVariable.material.uniforms.uDeltaTime.value = clock.getDelta();
    });

    return (
        <instancedMesh 
            ref={instancedMeshRef} 
            args={[null as any, null as any, numCars]} 
            material={shaderMaterial}
        >
            <boxGeometry args={[2.5, carSize, 5.0, 10, 10, 10]} />
            {/* <boxGeometry args={[1, 1, .5, 1, 1, 1]} /> */}
        </instancedMesh>
    )
}

type PointsProps = {
    points: Vector3[]
}

// debug mesh for cross walk points
const CrosswalkPoints: React.FC<PointsProps> = ({points = []}) => {
    return (
        points.map((cwp, cwpindex) => {
            return (
                <mesh key={cwpindex} position={cwp}>
                    <boxGeometry args={[.5, .5, .5]} />
                    <meshBasicMaterial color={0x0000ff} />
                </mesh>
            )            
        })
    )
}



type VehiclePath = {
    pathLine: Line;
    crosswalkPoints?: Vector3[]
}

const VehiclePath: React.FC<VehiclePath> = ({
    pathLine,
    crosswalkPoints = undefined
}) => {
    return (
        <>
            <primitive object={pathLine} />
            {crosswalkPoints && <CrosswalkPoints points={crosswalkPoints}/>}
        </>
    )
}

// const vehiclePath0Turning = vehicleTurnPath(pathData.vehiclePath0Turning);
// const vehcilePath0Straight = vehicleStraightPath(pathData.vehiclePath0Straight);
// const vehiclePath1Turning = vehicleTurnPath(pathData.vehiclePath1Turning);
// const vehcilePath1Straight = vehicleStraightPath(pathData.vehiclePath1Straight);

const WalkingCars = () => {
    return (
        <>
            {/* <VehiclePath 
                pathLine={pathData.vehiclePath0TurningData.line} 
                crosswalkPoints={pathData.vehiclePath0TurningData.crosswalkPoints}
            />
            <VehiclePath 
                pathLine={pathData.vehiclePath1StraightData.line} 
                crosswalkPoints={pathData.vehiclePath1StraightData.crosswalkPoints}
            />
            <VehiclePath 
                pathLine={pathData.vehiclePath2StraightData.line} 
                crosswalkPoints={pathData.vehiclePath2StraightData.crosswalkPoints}
            />
            <VehiclePath 
                pathLine={pathData.vehiclePath3StraightData.line} 
                crosswalkPoints={pathData.vehiclePath3StraightData.crosswalkPoints}
            />
            <VehiclePath 
                pathLine={pathData.vehiclePath4StraightData.line} 
                crosswalkPoints={pathData.vehiclePath4StraightData.crosswalkPoints}
            />
            <VehiclePath 
                pathLine={pathData.vehiclePath5StraightData.line} 
                crosswalkPoints={pathData.vehiclePath5StraightData.crosswalkPoints}
            />
            <VehiclePath 
                pathLine={pathData.vehiclePath6StraightData.line} 
                crosswalkPoints={pathData.vehiclePath6StraightData.crosswalkPoints}
            />
            <VehiclePath 
                pathLine={pathData.vehiclePath7TurningData.line} 
                crosswalkPoints={pathData.vehiclePath7TurningData.crosswalkPoints}
            />
            <VehiclePath 
                pathLine={pathData.vehiclePath8TurningData.line} 
                crosswalkPoints={pathData.vehiclePath8TurningData.crosswalkPoints}
            />
            <VehiclePath 
                pathLine={pathData.vehiclePath9TurningData.line} 
                crosswalkPoints={pathData.vehiclePath9TurningData.crosswalkPoints}
            />
            <VehiclePath 
                pathLine={pathData.vehiclePath10TurningData.line} 
                crosswalkPoints={pathData.vehiclePath10TurningData.crosswalkPoints}
            />
            <VehiclePath 
                pathLine={pathData.vehiclePath11TurningData.line} 
                crosswalkPoints={pathData.vehiclePath11TurningData.crosswalkPoints}
            /> */}
            <Cars width={11} />
        </>
    )
}

export { WalkingCars };