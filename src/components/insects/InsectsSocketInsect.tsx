import {
    useFrame,
    Vector3 as Vector3Type,
    Euler as EulerType
} from '@react-three/fiber';
import { InsectsButterfly } from './InsectsButterfly';
import {
    useState,
    useRef
} from 'react';
import {
    Vector3,
    Euler,
    Quaternion
} from 'three';

const lerpCalcVector3A = new Vector3();
const lerpCalcVector3B = new Vector3();
const lerpCalcVector3C = new Vector3();
const currentQuaternionA = new Quaternion();
const currentQuaternionB = new Quaternion();
const lerpEulerCalcA = new Euler();
const lerpEulerCalcB = new Euler();
const resultEuler = new Euler();

const InsectsSocketInsect: React.FC<InsectsSocketInsectsProps> = ({
    position, 
    rotation, 
    color, 
    patternSpots
}): JSX.Element => {
    const groupRef = useRef(null);
    const insectGroupRef = useRef(null);
    const [insectPosition, setInsectPosition] = useState<Vector3Type>(position);
    const [insectRotation, setInsectRotation] = useState<EulerType>(rotation);

    useFrame(() => {
        setInsectPosition(current => {
            lerpCalcVector3A.set(current[0], current[1], current[2]);
            lerpCalcVector3B.set(position[0], position[1], position[2]);
            lerpCalcVector3C.lerpVectors(lerpCalcVector3A, lerpCalcVector3B, .1);
            return [lerpCalcVector3C.x, lerpCalcVector3C.y, lerpCalcVector3C.z];
        });

        setInsectRotation(current => {
            lerpEulerCalcA.set(current[0], current[1], current[2]);
            currentQuaternionA.setFromEuler(lerpEulerCalcA);
            lerpEulerCalcB.set(rotation[0], rotation[1], rotation[2]);
            currentQuaternionB.setFromEuler(lerpEulerCalcB);
            currentQuaternionA.slerp(currentQuaternionB, 0.1); 
            resultEuler.setFromQuaternion(currentQuaternionA);
            return [resultEuler.x, resultEuler.y, resultEuler.z];
        });
    });

    return (
        <>
            <group
                ref={groupRef}
                rotation={insectRotation}
                position={insectPosition}
            >
                <InsectsButterfly 
                    color={color}
                    patternSpots={patternSpots}
                    insectGroupRef={insectGroupRef}
                />
            </group>
        </>
    );
};

export { InsectsSocketInsect };