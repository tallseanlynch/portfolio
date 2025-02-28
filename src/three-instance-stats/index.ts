import * as three from 'three';

function isClass(func) {
    return typeof func === 'function' && /^class\s/.test(func.toString());
};

const threeKeys = Object.keys(three);
const threeClasses = threeKeys.filter(threeKey => {
    return isClass(three[threeKey]);
});

type Constructor<T = {[key: string]: any}> = new (...args: any[]) => T;

function withInstanceCount<T extends Constructor>(BaseClass: T): T {
    const handler: ProxyHandler<T> = {
        construct(target: T, args: any[], newTarget: Function): object {
            target['instanceCount'] = (target['instanceCount'] || 0) + 1;
            return Reflect.construct(target, args, newTarget);
        }
    };
    return new Proxy(BaseClass, handler);
};

const extendedThree: {[key: string]: any} = {...three};
threeClasses.forEach(threeClass => {
    extendedThree[threeClass] = withInstanceCount(three[threeClass]);
});

const instances = () => {
    const instanceStats = {}; 
    threeClasses.forEach(instanceStat => {
        instanceStats[instanceStat] = extendedThree[instanceStat].instanceCount || 0;
    })
    return instanceStats;
}

export { instances };
export const { AmbientLight, AnimationAction, AnimationClip, AnimationLoader, AnimationMixer, AnimationObjectGroup, ArcCurve, ArrayCamera, ArrowHelper, Audio, AudioAnalyser, AudioContext, AudioListener, AudioLoader, AxesHelper, BatchedMesh, Bone, BooleanKeyframeTrack, Box2, Box3, Box3Helper, BoxGeometry, BoxHelper, BufferAttribute, BufferGeometry, BufferGeometryLoader, Camera, CameraHelper, CanvasTexture, CapsuleGeometry, CatmullRomCurve3, CircleGeometry, Clock, Color, ColorKeyframeTrack, CompressedArrayTexture, CompressedCubeTexture, CompressedTexture, CompressedTextureLoader, ConeGeometry, Controls, CubeCamera, CubeTexture, CubeTextureLoader, CubicBezierCurve, CubicBezierCurve3, CubicInterpolant, Curve, CurvePath, CylinderGeometry, Cylindrical, Data3DTexture, DataArrayTexture, DataTexture, DataTextureLoader, DepthTexture, DirectionalLight, DirectionalLightHelper, DiscreteInterpolant, DodecahedronGeometry, EdgesGeometry, EllipseCurve, Euler, EventDispatcher, ExtrudeGeometry, FileLoader, Float16BufferAttribute, Float32BufferAttribute, Fog, FogExp2, FramebufferTexture, Frustum, GLBufferAttribute, GridHelper, Group, HemisphereLight, HemisphereLightHelper, IcosahedronGeometry, ImageBitmapLoader, ImageLoader, ImageUtils, InstancedBufferAttribute, InstancedBufferGeometry, InstancedInterleavedBuffer, InstancedMesh, Int16BufferAttribute, Int32BufferAttribute, Int8BufferAttribute, InterleavedBuffer, InterleavedBufferAttribute, Interpolant, KeyframeTrack, LOD, LatheGeometry, Layers, Light, LightProbe, Line, Line3, LineBasicMaterial, LineCurve, LineCurve3, LineDashedMaterial, LineLoop, LineSegments, LinearInterpolant, Loader, LoaderUtils, LoadingManager, Material, MaterialLoader, Matrix2, Matrix3, Matrix4, Mesh, MeshBasicMaterial, MeshDepthMaterial, MeshDistanceMaterial, MeshLambertMaterial, MeshMatcapMaterial, MeshNormalMaterial, MeshPhongMaterial, MeshPhysicalMaterial, MeshStandardMaterial, MeshToonMaterial, NumberKeyframeTrack, Object3D, ObjectLoader, OctahedronGeometry, OrthographicCamera, PMREMGenerator, Path, PerspectiveCamera, Plane, PlaneGeometry, PlaneHelper, PointLight, PointLightHelper, Points, PointsMaterial, PolarGridHelper, PolyhedronGeometry, PositionalAudio, PropertyBinding, PropertyMixer, QuadraticBezierCurve, QuadraticBezierCurve3, Quaternion, QuaternionKeyframeTrack, QuaternionLinearInterpolant, RawShaderMaterial, Ray, Raycaster, RectAreaLight, RenderTarget, RenderTarget3D, RenderTargetArray, RingGeometry, Scene, ShaderMaterial, ShadowMaterial, Shape, ShapeGeometry, ShapePath, ShapeUtils, Skeleton, SkeletonHelper, SkinnedMesh, Source, Sphere, SphereGeometry, Spherical, SphericalHarmonics3, SplineCurve, SpotLight, SpotLightHelper, Sprite, SpriteMaterial, StereoCamera, StringKeyframeTrack, TetrahedronGeometry, Texture, TextureLoader, TorusGeometry, TorusKnotGeometry, Triangle, TubeGeometry, Uint16BufferAttribute, Uint32BufferAttribute, Uint8BufferAttribute, Uint8ClampedBufferAttribute, Uniform, UniformsGroup, Vector2, Vector3, Vector4, VectorKeyframeTrack, VideoFrameTexture, VideoTexture, WebGL3DRenderTarget, WebGLArrayRenderTarget, WebGLCubeRenderTarget, WebGLRenderTarget, WebGLRenderer, WebXRController, WireframeGeometry } = extendedThree;
