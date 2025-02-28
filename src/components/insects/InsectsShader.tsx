import {
    Canvas
} from '@react-three/fiber';
import {
    NoToneMapping,
    Vector3
} from 'three';
import { isTouchDevice } from '../../assets/js/util';
import { InsectsSkyDome } from './InsectsSkyDome';
import { InsectsGround } from './InsectsGround';
import { InsectsWebSocketUI } from './InsectsWebSocketUI';
import { InsectsClouds } from './InsectsClouds';
import { whiteColor, skyColorLight } from './insectsColors';

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

interface InsectShaderCanvasProps {
    classNames?: string;
};

const InsectsShaderCanvas: React.FC<InsectShaderCanvasProps> = ({
    classNames = ''
}) => {

    const touchDevice = isTouchDevice();

    return (
        <>
            <Canvas
                gl={{ antialias: true, toneMapping: NoToneMapping }}
                linear
                className={classNames}
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