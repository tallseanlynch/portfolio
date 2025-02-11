import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';

let activeExperience = {};

const App = () => {
  const canvas = document.querySelector('#brand-canvas');
  const textureLoader = new THREE.TextureLoader();
  const clock = new THREE.Clock();
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });

  const opacityOutLogo = () => {
    document.querySelector('.brand').classList.remove('opacity-point95');
    document.querySelector('.brand').classList.add('opacity-0');
    document.querySelector('.brand-small').classList.remove('opacity-0');
    document.querySelector('.brand-small').classList.add('opacity-point95');
    document.removeEventListener('click', opacityOutLogo);
    document.removeEventListener('touchstart', opacityOutLogo);
    document.removeEventListener('touchmove', opacityOutLogo);
    window.removeEventListener('mousewheel', opacityOutLogo);
  };

  const isTouchDevice = () => {
    try {
      document.createEvent("TouchEvent");
      return true;
    } catch (e) {
      return false;
    }
  };

  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };
  
  const onMouseClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if(activeExperience.onMouseClick) {
      activeExperience.onMouseClick(event);
    }
  }
  
  const onMouseMove = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.buttons === 0) { return; }
    if(activeExperience.onMouseMove) {
      activeExperience.onMouseMove(event);
    }
  }
  
  const onTouchClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if(activeExperience.onTouchClick) {
      activeExperience.onTouchClick(event);
    }
  }

  const onWindowResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
  
    document.querySelector('canvas').width = width + 'px';
    document.querySelector('canvas').height = height + 'px';
  
    if(activeExperience.onWindowResize) {
      activeExperience.onWindowResize(width, height);
    }
    renderer.setSize(width, height);    
  }
    
  document.addEventListener('click', opacityOutLogo);
  document.addEventListener('touchstart', opacityOutLogo);
  document.addEventListener('touchmove', opacityOutLogo);
  window.addEventListener('mousewheel', opacityOutLogo, { passive: false });
  if (isMobileDevice() && isTouchDevice()) {
    document.body.addEventListener('touchstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      onTouchClick(e);
    }, false);
    window.addEventListener('touchmove', (e) => {
      e.preventDefault();
      e.stopPropagation();
      onTouchClick(e);
    }, false);
  } else {
    document.body.addEventListener('mousemove', onMouseMove, false);
    document.body.addEventListener('mousedown', onMouseClick, false);
  }
  window.addEventListener('resize', onWindowResize);

  window.runAnimation = true;

  const animate = () => {
    if(window.runAnimation === false) { return; }
    if(activeExperience.animate) {
      activeExperience.animate();
    }
    requestAnimationFrame(animate);
    if(activeExperience.controls) {
      activeExperience.controls.update();
    }
    if(activeExperience.scene && activeExperience.camera) {
      renderer.render(activeExperience.scene, activeExperience.camera);
    }
  }

  return {
    canvas,
    textureLoader,
    clock,
    raycaster,
    mouse,
    renderer,
    animate
  }
}

const Water = () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const loadedTexture1 = app.textureLoader.load('../assets/images/pattern-1-optimized.jpg');
  const loadedTexture2 = app.textureLoader.load('../assets/images/pattern-2-optimized.jpg');
  const numberOfWaves = 80;
  const eventDebounceTime = 200;
  const uniforms = {
    'numberOfWaves': { value: numberOfWaves },
    'texture1Resolution': { value: new THREE.Vector2(2034, 2106) },
    'texture2Resolution': { value: new THREE.Vector2(2034, 2106) },
    'time': { value: 1.0 },
    'timeDelta': { value: 0.0 },
    'texture1': { value: loadedTexture1 },
    'texture2': { value: loadedTexture2 },
    'clickMagnitudes': {
      value: []
    },
    'mouseClicks': { value: [] }
  };
  let mouseClicks = 0;
  let lastMouseClick = new Date().getTime();
  const randomRippleInterval = 125;
  const shader = {
    vertexShader: `
      uniform int numberOfWaves;
      uniform vec3 mouseClicks[80];
      uniform float clickMagnitudes[80];
      uniform float time;
      varying vec2 vUv;
      varying float positionDiff;
  
      void main() {
        vUv = uv;
        vec3 clickPositionModifier = vec3(0.0, 0.0, 0.0);
        positionDiff = 0.0;

        for (int i = 0; i < numberOfWaves; i++) {
          if(clickMagnitudes[i] >= 0.0) {
            float distanceFromMouseClick = distance(position, mouseClicks[i]);

            float waveWidth = 1.0;  // Width of a single wave crest
            float damping = 2.5;  // Damping factor to smooth out the ripples

            float normalizedDistance = (distanceFromMouseClick - clickMagnitudes[i]) / waveWidth;

            if(abs(normalizedDistance) <= waveWidth) {
              float waveAmplitude = (10.0 - clickMagnitudes[i]) * 0.125;
              float decay = exp(-damping * abs(normalizedDistance));
              clickPositionModifier.z += sin(3.141592 * normalizedDistance) * waveAmplitude * decay;
              positionDiff += clickPositionModifier.z;
            }
          }
        }
        vec3 finalPos = vec3(0.0, 0.0, 0.0);
        finalPos.x = sin(position.y * 0.5 + time) * .25;
        finalPos.y = sin(position.z * 0.5 + time) * .15;
        finalPos.z = sin(position.x * 0.5 + time) * .25;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position + finalPos + clickPositionModifier, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform sampler2D texture1;
      uniform sampler2D texture2;
      varying vec2 vUv;
      varying float positionDiff;
      void main() {
        float angleRadians = radians((positionDiff * .0125) * 360.0);
        vec2 uv = vUv - vec2(0.5, 0.5);
        mat2 rotation = mat2(
          cos(angleRadians), -sin(angleRadians),
          sin(angleRadians), cos(angleRadians)
        );
        uv = rotation * uv + vec2(0.5, 0.5);
        vec4 color1 = texture2D(texture1, uv);
        vec4 color2 = texture2D(texture2, uv);
        vec4 mixColor = mix(color2, color1, abs(sin(time/6.0)));
        
        float distanceColor = (distance(vUv, vec2( 0.5, 0.5)) * 2.0);
        if(distanceColor > .5) {
          mixColor = vec4( mixColor.rgb, ( (1.0 - distanceColor) - ((distanceColor - .95) * 10.0) ));
        }

        float saturation = 2.25;
        float avg = (mixColor.r + mixColor.g + mixColor.b) / 3.0;
        vec3 gray = vec3(avg, avg, avg);
        gl_FragColor = vec4(mix(gray, mixColor.rgb, saturation), mixColor.a);
      }
    `,
  };

  uniforms.texture1.value = loadedTexture1;
  uniforms.texture2.value = loadedTexture2;
  loadedTexture1.encoding = THREE.sRGBEncoding;
  loadedTexture1.color = 0xffffff;
  loadedTexture2.encoding = THREE.sRGBEncoding;
  loadedTexture2.color = 0xffffff;
  uniforms.numberOfWaves.value = numberOfWaves;

  scene.background = new THREE.Color(0xffffff);

  camera.position.y = 15;
  camera.rotation.set(-1.5, -.15, -1.5);

  app.renderer.setPixelRatio(window.devicePixelRatio);
  app.renderer.setSize(window.innerWidth, window.innerHeight);    

  for (let i = 0; i < numberOfWaves; i++) {
    uniforms.mouseClicks.value.push(new THREE.Vector3(-100, -100, -100));
    uniforms.clickMagnitudes.value.push(0.0);
  }

  const planeGeometry = new THREE.PlaneGeometry(60, 60, 500, 500);
  const planeMaterial = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: uniforms,
    vertexShader: shader.vertexShader,
    fragmentShader: shader.fragmentShader,
    transparent: true,
    alphaTest: .5,
  });

  let planeScale = 1;

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = Math.PI * -.5;
  plane.rotation.z = Math.PI;
  scene.add(plane);
  plane.scale.set(planeScale, planeScale, planeScale);

  const raycastPlane = new THREE.Mesh(new THREE.PlaneGeometry(60, 60, 1, 1), new THREE.MeshStandardMaterial({ color: 0x000000 }));
  raycastPlane.visible = false;
  raycastPlane.rotation.copy(plane.rotation);
  raycastPlane.scale.copy(plane.scale);
  raycastPlane.position.copy(plane.position);
  scene.add(raycastPlane);

  const controls = new OrbitControls(camera, app.renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;
  controls.zoomSpeed = .1;
  controls.panSpeed = .1;
  controls.rotateSpeed = .1;    

  let endInterval;
  const createInterval = () => {
    const startInterval = setInterval(() => {
      uniforms.mouseClicks.value[mouseClicks % numberOfWaves] = new THREE.Vector3((Math.random() * 60) - 30, (Math.random() * 60) - 30, 0);
      uniforms.clickMagnitudes.value[mouseClicks % numberOfWaves] = 0.1;
      mouseClicks++;
    }, randomRippleInterval)

    endInterval = () => clearInterval(startInterval);  
  }
  
  createInterval();

  const animate = () => {
    uniforms.time.value = app.clock.getElapsedTime();
    uniforms.timeDelta.value = app.clock.getDelta();
    for (let clickMagnitudeIndex = 0; clickMagnitudeIndex < uniforms.clickMagnitudes.value.length; clickMagnitudeIndex++) {
      if (uniforms.clickMagnitudes.value[clickMagnitudeIndex] > 0.0) {
        uniforms.clickMagnitudes.value[clickMagnitudeIndex] += .05;
      }
      if (uniforms.clickMagnitudes.value[clickMagnitudeIndex] > 10.0) {
        uniforms.clickMagnitudes.value[clickMagnitudeIndex] = -10.0;
      }
    }    
  }

  const createRipple = (event) => {
    app.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    app.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    app.raycaster.setFromCamera(app.mouse, camera);
    const intersects = app.raycaster.intersectObject(raycastPlane);
  
    if (intersects.length > 0) {
      let intersect = intersects[0];
      uniforms.mouseClicks.value[mouseClicks % numberOfWaves] = intersect.object.worldToLocal(intersect.point);
      uniforms.clickMagnitudes.value[mouseClicks % numberOfWaves] = 0.1;
      mouseClicks++;
    }
  }
  
  const onMouseClick = (event) => {
    if (new Date().getTime() - lastMouseClick < activeExperience.eventDebounceTime) { return; }
    createRipple(event);
    lastMouseClick = new Date().getTime();
  }

  const onMouseMove = (event) => {
    if (new Date().getTime() - lastMouseClick < activeExperience.eventDebounceTime) { return; }
    createRipple(event);
    lastMouseClick = new Date().getTime();
  }

  const onTouchClick = (event) => {
    if (new Date().getTime() - lastMouseClick < activeExperience.eventDebounceTime) { return; }
    createRipple({ clientX: event.touches[0].clientX, clientY: event.touches[0].clientY });
    lastMouseClick = new Date().getTime();  
  }

  const onWindowResize = (width, height) => {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  return {
    onMouseClick,
    onMouseMove,
    onTouchClick,
    onWindowResize,
    animate,
    createInterval,
    endInterval,
    eventDebounceTime,
    controls,
    scene,
    camera
  }
}

const app = App();
const water = Water();
activeExperience = water;
app.animate();
