import { isMobileDevice } from '../../assets/js/util';
import { OrbitControls } from '@react-three/drei';
import { 
  Canvas, 
  useFrame,
  useLoader
} from '@react-three/fiber';
import {
  useCallback,
  useEffect,
  useMemo 
} from 'react';
import { 
  Color,
  DoubleSide,
  Mesh,
  ShaderMaterial,
  Vector3
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const isMobile = isMobileDevice();

const Mix = () => {  
  const pointsShaderMaterial = useMemo(() => new ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      mouse: { value: new Vector3()}
    },
    side: DoubleSide,
    transparent: true,
    vertexShader:`
      uniform vec3 mouse;
      uniform float time;
      attribute vec4 color;
      varying vec4 vColor;
      #include <common>
      #include <color_pars_vertex>
      #include <fog_pars_vertex>
      #include <morphtarget_pars_vertex>
      #include <logdepthbuf_pars_vertex>
      #include <clipping_planes_pars_vertex>
      #ifdef USE_POINTS_UV
        varying vec2 vUv;
        uniform mat3 uvTransform;
      #endif
      void main() {
        vColor = color;
        #ifdef USE_POINTS_UV
          vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
        #endif
        #include <color_vertex>
        #include <morphinstance_vertex>
        #include <morphcolor_vertex>
        #include <begin_vertex>
        vec3 mouseCalc = mouse;
        mouseCalc.z *= -1.0;
        float distanceToMouse = distance(transformed, mouseCalc);
        float checkMouseDistance = 2.0;
        if(distanceToMouse < checkMouseDistance) {
          vec3 mouseDir = normalize(vec3(transformed - mouse));
          transformed += mouseDir * (checkMouseDistance - distanceToMouse) * .5;
        }
        #include <morphtarget_vertex>
        #include <project_vertex>
        gl_PointSize = 4.0;
        #ifdef USE_SIZEATTENUATION
          bool isPerspective = isPerspectiveMatrix( projectionMatrix );
          if ( isPerspective ) gl_PointSize *= ( 1.0 / - mvPosition.z );
        #endif
        #include <logdepthbuf_vertex>
        #include <clipping_planes_vertex>
        #include <worldpos_vertex>
        #include <fog_vertex>
      }
    `,
    fragmentShader: `
      varying vec4 vColor;
      #include <common>
      #include <color_pars_fragment>
      #include <map_particle_pars_fragment>
      #include <alphatest_pars_fragment>
      #include <alphahash_pars_fragment>
      #include <fog_pars_fragment>
      #include <logdepthbuf_pars_fragment>
      #include <clipping_planes_pars_fragment>
      void main() {
        float saturation = 2.25;
        float avg = (vColor.r + vColor.g + vColor.b) / 3.0;
        vec3 gray = vec3(avg, avg, avg);
        vec4 diffuseColor = vec4(mix(gray, vColor.rgb, saturation), 1.0);
        #include <clipping_planes_fragment>
        vec3 outgoingLight = vec3( 0.0 );
        #include <logdepthbuf_fragment>
        #include <map_particle_fragment>
        #include <color_fragment>
        #include <alphatest_fragment>
        #include <alphahash_fragment>
        outgoingLight = diffuseColor.rgb;
        #include <opaque_fragment>
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <fog_fragment>
        #include <premultiplied_alpha_fragment>
      }
    `
  }), [])

  const natureColor = useLoader(GLTFLoader, '/mix/grass_autumn_update.glb');
  const nature = useLoader(GLTFLoader, '/mix/nature-centered-1.glb');
  (window as any).nature = nature;
  (window as any).natureColor = natureColor;

  useEffect(() => {
    (window as any).Vector3 = Vector3;
    console.log(nature.scene.children[0].localToWorld(new Vector3(0, 0, 0)));
    console.log(nature.materials['Scene_-_Root']);
    nature.materials['Scene_-_Root'] = pointsShaderMaterial;
    const trueIndexMap = [9, 10, 11, 12, 13, 14, 15, 16, 0, 1, 2, 3, 4, 5, 6, 7, 8, ]
    for(let i = 0; i < nature.scene.children[0].children[0].children.length; i++) {
      (nature.scene.children[0].children[0].children[i] as Mesh).material = pointsShaderMaterial;
      (nature.scene.children[0].children[0].children[trueIndexMap[i]] as Mesh).geometry.attributes.color = (natureColor.scene.children[0].children[0].children[i] as Mesh).geometry.attributes.color;
      nature.scene.children[0].children[0].children[i].frustumCulled = false;
    }
    nature.scene.children[0].frustumCulled = false;
  }, [nature, pointsShaderMaterial, natureColor.scene.children]);

  const handleRaycastPlaneMouseMove = useCallback((event) => {
    pointsShaderMaterial.uniforms.mouse.value.copy(event.point);
    pointsShaderMaterial.needsUpdate = true;
  }, [pointsShaderMaterial])

  useFrame(({ clock }) => {
    pointsShaderMaterial.uniforms.time.value = clock.elapsedTime;
  });

  return (
    <>
      {/* <gridHelper 
        args={[100, 100, 0xaaaaaa, 0xaaaaaa]} 
        position={[0, 0.01, 0]}
      /> */}
      <primitive object={nature.scene} />
      <mesh 
        rotation={[ Math.PI / 2, 0, 0 ]}
        onPointerMove={
          (event) => {
            handleRaycastPlaneMouseMove(event);
          }
        }
      >
        <planeGeometry args={[100, 100, 1, 1]}/>
        <meshBasicMaterial 
          color={0xffffff} 
          visible={false}
          side={DoubleSide}
        />
      </mesh>
    </>
  );
};

const MixShaderCanvas = () => {
  const cameraPos = isMobile ? 4.0 : 4.25;
  return (
    <Canvas
      camera={{position: [0, cameraPos - 2.0, cameraPos + 3.0]}}
      // scene={{background: new Color(0xffffff)}}
      scene={{background: new Color(0x000000)}}
    >
      <ambientLight intensity={1.5} />
      <pointLight position={[5, 5, 5]} />
      <Mix />
      <OrbitControls
        enableDamping={true}
        dampingFactor={0.5}
        screenSpacePanning={false}
        autoRotate={true}
        autoRotateSpeed={.5}
        zoomSpeed={.5}
        panSpeed={.5}
        rotateSpeed={.25}
        enableRotate={isMobile ? false : true}  
      />
    </Canvas>
  );
}

export { MixShaderCanvas, Mix };
