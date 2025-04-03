// //commented out debug function to track gpu movements with a canvas texture

// import { 
//   useCallback,
//   useEffect, 
//   useRef, 
//   useMemo
// } from 'react';
// import { 
//   BoxGeometry,
//   Color,
//   CanvasTexture,
//   InstancedMesh,
//   MeshBasicMaterial,
//   NoToneMapping,
//   Object3D,
//   PlaneGeometry,
//   ShaderMaterial,
//   Vector3
// } from 'three';


// const planeSize = 100;
// const planeUnitResolution = 10;
// const trackingPlaneTextureResolution = planeSize * planeUnitResolution;
// const rotatedPlaneGeometry = new PlaneGeometry(planeSize, planeSize, 1, 1);
// rotatedPlaneGeometry.rotateX(Math.PI / 2);


// const trackingCheckMaterialRef = useRef<MeshBasicMaterial>();
//   const goundMaterialRef = useRef<MeshBasicMaterial>();


// checkVector3s = false,
//   renderDebugPlane = false,
//   consoleLogDebugBuffer = false      


// const canvas = useMemo(() => {
//     if(renderDebugPlane === true) {
//       const offscreenCanvas = new OffscreenCanvas(trackingPlaneTextureResolution, trackingPlaneTextureResolution);
//       const ctx = offscreenCanvas.getContext('2d');
  
//       if(ctx) {
//         ctx.fillStyle = 'white';
//         ctx.fillRect(0, 0, trackingPlaneTextureResolution, trackingPlaneTextureResolution);  
//       }
  
//       const texture = new CanvasTexture(offscreenCanvas);
//       texture.needsUpdate = true;
  
//       return {
//         texture, 
//         ctx
//       };  
//     } else {
//       return {}
//     }
//   }, []);

//     const buffer = useMemo(() => {
//       return new Float32Array(width * width * 4);
//     }, [width])
  
//     const renderTrackingPlane = useCallback((gl) => {
//       gl.readRenderTargetPixels(
//         gpgpuRenderer.getCurrentRenderTarget(data.position.variables.positionVariable),
//         0, 0, width, width,
//         buffer
//       );
  
//       if(canvas.ctx && trackingCheckMaterialRef.current && goundMaterialRef.current) {
  
//         const fillStyleArray = [
//           'red',
//           'green',
//           'blue'
//         ]
//         const oneThirdBufferArray = buffer.length / 3;
//         for (let i = 0; i < buffer.length; i += 4) {
  
//           canvas.ctx.fillStyle = fillStyleArray[Math.floor(i / oneThirdBufferArray)];
//           canvas.ctx.fillRect(500 + buffer[i] * 10, 500 + buffer[i + 2] * -10, 2, 2);
//         }
//         canvas.texture.needsUpdate = true;
//         trackingCheckMaterialRef.current.needsUpdate = true;
//         goundMaterialRef.current.needsUpdate = true;
//       }
  
//     }, [buffer, canvas.ctx, canvas.texture, data.position.variables.positionVariable, gpgpuRenderer, width])
  
//     const collisionVector3 = useMemo(() => {
//       const vec3Array: Vector3[] = [];
//       for(let v3 = 0; v3 < width * width; v3++) {
//         vec3Array.push(new Vector3())
//       }
//       return vec3Array;    
//     }, [width])
  
//     const debugBufferPosition = useMemo(() => {
//       return new Float32Array(width * width * 4);
//     }, [width])
//     const debugBufferDirection = useMemo(() => {
//       return new Float32Array(width * width * 4);
//     }, [width])
//     const debugBufferDestination = useMemo(() => {
//       return new Float32Array(width * width * 4);
//     }, [width])
  
//     const logDebugBuffer = useCallback((gl) => {
  
//       gl.readRenderTargetPixels(
//         gpgpuRenderer.getCurrentRenderTarget(data.position.variables.positionVariable),
//         0, 0, width, width,
//         debugBufferPosition
//       );
  
//       gl.readRenderTargetPixels(
//         gpgpuRenderer.getCurrentRenderTarget(data.direction.variables.directionVariable),
//         0, 0, width, width,
//         debugBufferDirection
//       );
  
//       gl.readRenderTargetPixels(
//         gpgpuRenderer.getCurrentRenderTarget(data.destination.variables.destinationVariable),
//         0, 0, width, width,
//         debugBufferDestination
//       );
  
//       for(let l = 0; l < width * width * 4; l += 4) {
//         if(checkVector3s === true) {
//           collisionVector3[l / 4].set(
//             debugBufferPosition[l],
//             debugBufferPosition[l + 1],
//             debugBufferPosition[l + 2]
//           );      
//         }
//         console.log(`bufferIndex: ${l / 4}`)
//         // console.log(`Pos: ${debugBufferPosition[l]}, ${debugBufferPosition[l + 1]}, ${debugBufferPosition[l + 2]}, ${debugBufferPosition[l + 3]}`);
//         // console.log(`Dir: ${debugBufferDirection[l]}, ${debugBufferDirection[l + 1]}, ${debugBufferDirection[l + 2]}, ${debugBufferDirection[l + 3]}`);
//         console.log(`Des: ${debugBufferDestination[l]}, ${debugBufferDestination[l + 1]}, ${debugBufferDestination[l + 2]}, ${debugBufferDestination[l + 3]}`);
//       }
  
//       if(checkVector3s === true) {
//         for(let checkVi = 0; checkVi < width; checkVi++) {
//           const vectorA = collisionVector3[checkVi];
//           for(let checkVj = 0; checkVj < width; checkVj++) {
//             const vectorB = collisionVector3[checkVj];
//             if(vectorA.distanceTo(vectorB) > .0001 && vectorA.distanceTo(vectorB) < 3.0) {
//               console.log('collision');
//             }
//           }
//         }  
//       }
  
//     }, [
//       debugBufferPosition, 
//       debugBufferDirection,
//       debugBufferDestination,
//       data.position.variables.positionVariable, 
//       data.direction.variables.directionVariable, 
//       data.destination.variables.destinationVariable, 
//       gpgpuRenderer, 
//       width,
//       collisionVector3,
//       checkVector3s
//     ])
    
//     //useFrame funcs
//     if(renderDebugPlane) {
//         renderTrackingPlane(gl);
//       }
  
//       if(consoleLogDebugBuffer && clock.elapsedTime < 200) {
//         console.log(clock.elapsedTime)
//         logDebugBuffer(gl);
//       }
  