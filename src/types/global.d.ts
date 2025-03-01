import {
    Euler as EulerType,
    Vector3 as Vector3Type
} from '@react-three/fiber';
import {
    Color,
    Fog,
    Group,
    Texture,
    Vector3
} from 'three';

declare global {

    interface BrandHeaderProps {
        brandHasBeenClicked?: boolean; 
    };    

    interface BrandLandingProps {
        brandHasBeenClicked?: boolean; 
    };    

    type calculateSceneIndexType = {
        startingSceneIndex: number;
        sceneCounter: number;
    };

    interface InsectsButterflyProps {
        color: Color;
        patternSpots: Vector3[];
        insectGroupRef: React.Ref<Group>;
    };

    interface InsectsCloudsProps {
        whiteColor: Color;
        skyColor: Color;
        instanceNumber: number;
        instanceOrigin: Vector3;
        placementScale: number;
        instanceScale: number;
    };

    interface InsectsControlsProps {
        sendUpdate: (payload) => void;
        clientColor: Color;
        clientPatternSpots: Vector3[];
    };    

    interface InsectsGrassProps {
        baseColor: Color;
        skyColor: Color;
        instanceNumber: number; 
        instanceOrigin: Vector3;
        planeGeometryArgs: number[];
        placementScale: number;
        instanceScale: number;  
    };

    interface InsectsSmalFlowersProps {
        baseColor: Color;
        skyColor: Color;
        instanceNumber: number;
        instanceOrigin: Vector3;
        circleGeometryArgs: number[];
        placementScale: number;
        instanceScale: number;
    };

    interface InsectsSocketInsectsProps {
        position: Vector3Type;
        rotation: EulerType;
        color: Color;
        patternSpots: Vector3[];
    };

    type PlaneGeometryArgs = [number, number, number?, number?];

    interface RomeBushProps {
        position?: Vector3,
        planeArgs?: PlaneGeometryArgs,
        rotation?: Euler
    };
    
    interface RomeBushesProps {
        groupPosition?: Vector3,
        groupRotation?: Euler
    };

    interface RomeLightProps {
        position?: Vector3,
        backLight?: boolean,
        castShadow?: boolean
    };

    interface RomeTreeRingProps {
        texture: Texture,
        distance: number
    };

    interface SceneCounterState {
        sceneCounter: {
          value: number
        }
    };
    
    interface SnowSnowflakesProps {
        count?: number;
        scale?: number;
    };
    
    interface SnowShaderCanvasProps {
        backgroundColor?: Color
        sceneFog?: Fog,
    };
      
};

export {};