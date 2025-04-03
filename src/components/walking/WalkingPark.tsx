import {
    ParkGrassA,
    ParkGrassB,
    ParkGrassC
} from './ParkGrasses';
import {
    ParkPathA,
    ParkPathB
} from './ParkPaths';
import { 
    ParkTreesA,
    ParkTreesB,
    ParkTreesC
} from './ParkTrees';
import {
    treePositionsA0,
    treeRotationsA0,
    treePositionsA1,
    treeRotationsA1,
    treePositionsA2,
    treeRotationsA2,
    treePositionsA3,
    treeRotationsA3,
    treePositionsA4,
    treeRotationsA4,
    treePositionsA5,
    treeRotationsA5,
    treePositionsA6,
    treeRotationsA6,
    treePositionsB0,
    treeRotationsB0,
    treePositionsB1,
    treeRotationsB1,
    treePositionsB2,
    treeRotationsB2,
    treePositionsB3,
    treeRotationsB3,
    treePositionsB4,
    treeRotationsB4,
    treePositionsB5,
    treeRotationsB5,
    treePositionsB6,
    treeRotationsB6,
    treePositionsB7,
    treeRotationsB7,
    treePositionsC0,
    treeRotationsC0,
    treePositionsC1,
    treeRotationsC1,
    treePositionsC2,
    treeRotationsC2,
    treePositionsC3,
    treeRotationsC3,
    treePositionsC4,
    treeRotationsC4,
    treePositionsC5,
    treeRotationsC5
} from './parkTreesPlacements';
import {
    Vector3
} from 'three';

const WalkingPark = ({groupPosition = new Vector3(0,0,0)}) => {

    return (
        <group position={groupPosition}>
            <ParkGrassA />
            <ParkPathA />
            <ParkTreesA treePositions={treePositionsA0} treeRotations={treeRotationsA0}/>
            <ParkTreesA treePositions={treePositionsA1} treeRotations={treeRotationsA1}/>
            <ParkTreesB treePositions={treePositionsB0} treeRotations={treeRotationsB0}/>
            <ParkTreesB treePositions={treePositionsB1} treeRotations={treeRotationsB1}/>
            <ParkTreesC treePositions={treePositionsC0} treeRotations={treeRotationsC0}/>

            <ParkGrassB />
            <ParkPathB />
            <ParkTreesA treePositions={treePositionsA2} treeRotations={treeRotationsA2}/>
            <ParkTreesA treePositions={treePositionsA3} treeRotations={treeRotationsA3}/>
            <ParkTreesA treePositions={treePositionsA4} treeRotations={treeRotationsA4}/>
            <ParkTreesB treePositions={treePositionsB2} treeRotations={treeRotationsB2}/>
            <ParkTreesB treePositions={treePositionsB3} treeRotations={treeRotationsB3}/>
            <ParkTreesB treePositions={treePositionsB4} treeRotations={treeRotationsB4}/>
            <ParkTreesB treePositions={treePositionsB5} treeRotations={treeRotationsB5}/>
            <ParkTreesC treePositions={treePositionsC1} treeRotations={treeRotationsC1}/>
            <ParkTreesC treePositions={treePositionsC2} treeRotations={treeRotationsC2}/>
            <ParkTreesC treePositions={treePositionsC3} treeRotations={treeRotationsC3}/>

            <ParkGrassC />
            <ParkTreesA treePositions={treePositionsA5} treeRotations={treeRotationsA5}/>
            <ParkTreesA treePositions={treePositionsA6} treeRotations={treeRotationsA6}/>
            <ParkTreesB treePositions={treePositionsB6} treeRotations={treeRotationsB6}/>
            <ParkTreesB treePositions={treePositionsB7} treeRotations={treeRotationsB7}/>
            <ParkTreesC treePositions={treePositionsC4} treeRotations={treeRotationsC4}/>
            <ParkTreesC treePositions={treePositionsC5} treeRotations={treeRotationsC5}/>
        </group>
    )
};

export { WalkingPark };