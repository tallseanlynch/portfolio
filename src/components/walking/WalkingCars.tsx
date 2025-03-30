import { pathData } from './pathData';
import { Line, Vector3 } from 'three';
import { useVehicleGPGPU } from './useVehicleGPGPU';
import { useEffect, useMemo, useRef } from 'react';
import { InstancedMesh, Object3D, ShaderMaterial } from 'three';
import { useFrame } from '@react-three/fiber';

const carSize = 2;
const instanceScale = .75;

const Cars = ({width = 1}) => {
    const { gpgpuRenderer, data } = useVehicleGPGPU(width);
    const instancedMeshRef = useRef<InstancedMesh>();
    const numCars = width * width;
    const matrixPositionObject =  new Object3D;

    useEffect(() => {
        if(instancedMeshRef.current) {
            for ( let i=0 ; i<numCars ; i++ ) {
                matrixPositionObject.scale.y = 2.0 + (Math.random() * instanceScale) - instanceScale / 2;
                matrixPositionObject.position.set(0, matrixPositionObject.scale.y / 2, 0);        
                matrixPositionObject.updateMatrix();
                instancedMeshRef.current.setMatrixAt( i, matrixPositionObject.matrix );
                instancedMeshRef.current.frustumCulled = false;
            }
        instancedMeshRef.current.instanceMatrix.needsUpdate = true;
        instancedMeshRef.current.frustumCulled = false;
        }

    }, [])


    const shaderMaterial = useMemo(() => new ShaderMaterial({
        uniforms: {
            gPositionMap: { value: data.position.texture},
            gDirectionMap: { value: data.direction.texture},
            gDestinationMap: { value: data.destination.texture },
            time: { value: 0 }
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

        void main() {
            vOriginalPosition = position;
            int index = gl_InstanceID;
            float floatIndex = float(index);
            float xCoor = mod(floatIndex, ${width}.0);
            float yCoor = mod(floatIndex / ${width}.0, ${width}.0);
            vec2 uv = vec2(xCoor / ${width}.0, yCoor / ${width}.0);
            vec4 gDirectionData = texture2D(gDirectionMap, uv);        
            vec4 gPositionData = texture2D(gPositionMap, uv);
            vec4 gDestinationData = texture2D(gDestinationMap, uv);
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

            gl_Position = projectionMatrix * modelViewMatrix * vPosition;
        }
        `,
        fragmentShader: `
        varying vec4 vgPosition;
        varying vec3 vOriginalPosition;
        varying vec4 vgDestination;
        varying vec4 vgDirection;

        void main() {
            vec4 positionColor = vgPosition;
            vec4 destinationColor = vgDestination;
            vec4 finalColor = positionColor;
            vec3 positionCalc = vec3(vgPosition.xyz);
            vec3 destinationCalc = vec3(vgDestination.xyz);
            vec3 directionCalc = vec3(vgDirection.xyz);

            if(vOriginalPosition.z > 0.0) {
            finalColor = vec4(1.0, 1.0, 1.0, 1.0);
            }

            if(distance(positionCalc, destinationCalc) < .25) {
            finalColor = vec4(.5, .5, .5, 1.0);
            }

            if(distance(positionCalc, destinationCalc) < 1.5 && vgDirection.w < .01) {
            finalColor = vec4(.5, .5, .5, 1.0);
            }

            gl_FragColor = finalColor;
        }
        `,
        // side: DoubleSide
    }), [
        width, 
        data.position.texture,
        data.direction.texture,
        data.destination.texture
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
            <boxGeometry args={[2.5, carSize, 5.0]} />
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
            <VehiclePath 
                pathLine={pathData.vehiclePath0TurningData.line} 
                crosswalkPoints={pathData.vehiclePath0TurningData.crosswalkPoints}
            />
            {/* <VehiclePath 
                pathLine={pathData.vehiclePath0StraightData.line} 
                crosswalkPoints={pathData.vehiclePath0StraightData.crosswalkPoints}
            /> */}
            {/* <VehiclePath 
                pathLine={pathData.vehiclePath1TurningData.line} 
                crosswalkPoints={pathData.vehiclePath1TurningData.crosswalkPoints}
            /> */}
            <VehiclePath 
                pathLine={pathData.vehiclePath1StraightData.line} 
                crosswalkPoints={pathData.vehiclePath1StraightData.crosswalkPoints}
            />
            <Cars width={6} />
        </>
    )
}

export { WalkingCars };