import { isTouchDevice } from '../../assets/js/util';
import {
    Canvas
} from '@react-three/fiber';
import { InsectsClouds } from './InsectsClouds';
import { whiteColor, skyColorLight } from './insectsColors';
import { InsectsGround } from './InsectsGround';
import { InsectsSkyDome } from './InsectsSkyDome';
import { InsectsWebSocketUI } from './InsectsWebSocketUI';
import {
    NoToneMapping,
    Vector3
} from 'three';

const InsectsShader: React.FC = (): JSX.Element => {
    return (
        <>
            <InsectsGround />
            <InsectsSkyDome />
            <InsectsClouds 
                whiteColor={whiteColor}
                skyColor={skyColorLight}
                instanceNumber={800}
                instanceOrigin={new Vector3(0,20,0)}
                placementScale={300}
                instanceScale={5}            
            />
            <perspectiveCamera />
            <InsectsWebSocketUI />
        </>
    )
};

const InsectsShaderCanvas: React.FC = () => {

    const touchDevice = isTouchDevice();

    return (
        <>
            <Canvas
                gl={{ antialias: true, toneMapping: NoToneMapping }}
                linear
            >
                <InsectsShader />
            </Canvas>
            {touchDevice === true && (
                <div className='mobile-control-circle'>
                    <img src='insects/mobile-control-circle-white.png' />
                </div>
            )}
        </>
    )
};

export { InsectsShader, InsectsShaderCanvas };