import { 
    BufferGeometry,
    EllipseCurve,
    Line,
    LineBasicMaterial, 
    Vector3 
} from 'three';

const turningMaterialA = new LineBasicMaterial({
    color: 0xff0000
});
const straightMaterialA = new LineBasicMaterial({
    color: 0x00ffff
});

// const turningMaterialB = new LineBasicMaterial({
//     color: 0x00ff00
// });
// const straightMaterialB = new LineBasicMaterial({
//     color: 0xff00ff
// });

const xVisualModifier = new Vector3(0.2, 0, 0);
// const zVisualModifier = new Vector3(0, 0, 0.2);

const vehiclePath0Turning = {
    ellipseCenterX: -25,
    ellipseCenterY: 25,
    radiusX: 7.5,
    radiusY: 7.5,
    startAngle: 0,
    endAngle: -Math.PI * .5,
    clockWise: true,
    rotation: 0,
    directionalPointA: new Vector3(0, 0, 130),
    directionalPointB: new Vector3(-130, 0, 0),
    crossWalkPointA: new Vector3(0, 0, 15),
    crossWalkPointB: new Vector3(-15, 0, 0),
    visualModifier: xVisualModifier,
    material: turningMaterialA,
    laneA: 0,
    laneB: 23,
    trafficConditions: {
        northSouth: false,
        northSouthTurning: true,
        westTurning: true,
        noTraffic: false
    }
}

// const vehiclePath0Straight = {
//     start: new Vector3(-17.5, 0.1, 155),
//     crosswalkPointA: new Vector3(-17.5, 0.1, 40),
//     crosswalkPointB: new Vector3(-17.5, 0.1, -40),
//     end: new Vector3(-17.5, 0.1, -155),
//     material: straightMaterialA,
//     visualModifier: xVisualModifier,
//     laneA: 0,
//     laneB: 15,
//     trafficConditions: {
//         northSouth: true,
//         northSouthTurning: false,
//         westTurning: false,
//         noTraffic: false
//     }
// }

// const vehiclePath1Turning = {
//     ellipseCenterX: -25,
//     ellipseCenterY: 25,
//     radiusX: 12.5,
//     radiusY: 12.5,
//     startAngle: 0,
//     endAngle: -Math.PI * .5,
//     clockWise: true,
//     rotation: 0,
//     directionalPointA: new Vector3(0, 0, 130),
//     directionalPointB: new Vector3(-130, 0, 0),
//     crossWalkPointA: new Vector3(0, 0, 15),
//     crossWalkPointB: new Vector3(-15, 0, 0),
//     visualModifier: xVisualModifier,
//     material: turningMaterialA,
//     laneA: 1,
//     laneB: 22,
// }

const vehiclePath1Straight = {
    start: new Vector3(-12.5, 0.1, 155),
    crosswalkPointA: new Vector3(-12.5, 0.1, 40),
    crosswalkPointB: new Vector3(-12.5, 0.1, -40),
    end: new Vector3(-12.5, 0.1, -155),
    material: straightMaterialA,
    visualModifier: xVisualModifier,
    laneA: 1,
    laneB: 14,
    trafficConditions: {
        northSouth: true,
        northSouthTurning: false,
        westTurning: false,
        noTraffic: false
    }
}

const vehiclePath2Straight = {
    start: new Vector3(-7.5, 0.1, 155),
    crosswalkPointA: new Vector3(-7.5, 0.1, 40),
    crosswalkPointB: new Vector3(-7.5, 0.1, -40),
    end: new Vector3(-7.5, 0.1, -155),
    material: straightMaterialA,
    visualModifier: xVisualModifier,
    laneA: 2,
    laneB: 13,
    trafficConditions: {
        northSouth: true,
        northSouthTurning: false,
        westTurning: false,
        noTraffic: false
    }
}

const vehiclePath3Straight = {
    start: new Vector3(-2.5, 0.1, 155),
    crosswalkPointA: new Vector3(-2.5, 0.1, 40),
    crosswalkPointB: new Vector3(-2.5, 0.1, -40),
    end: new Vector3(-2.5, 0.1, -155),
    material: straightMaterialA,
    visualModifier: xVisualModifier,
    laneA: 3,
    laneB: 12,
    trafficConditions: {
        northSouth: true,
        northSouthTurning: false,
        westTurning: false,
        noTraffic: false
    }
}

const vehiclePath4Straight = {
    start: new Vector3(7.5, 0.1, -155),
    crosswalkPointA: new Vector3(7.5, 0.1, -40),
    crosswalkPointB: new Vector3(7.5, 0.1, 40),
    end: new Vector3(7.5, 0.1, 155),
    material: straightMaterialA,
    visualModifier: xVisualModifier,
    laneA: 10,
    laneB: 5,
    trafficConditions: {
        northSouth: true,
        northSouthTurning: false,
        westTurning: false,
        noTraffic: false
    }
}

const vehiclePath5Straight = {
    start: new Vector3(12.5, 0.1, -155),
    crosswalkPointA: new Vector3(12.5, 0.1, -40),
    crosswalkPointB: new Vector3(12.5, 0.1, 40),
    end: new Vector3(12.5, 0.1, 155),
    material: straightMaterialA,
    visualModifier: xVisualModifier,
    laneA: 9,
    laneB: 6,
    trafficConditions: {
        northSouth: true,
        northSouthTurning: false,
        westTurning: false,
        noTraffic: false
    }
}

const vehiclePath6Straight = {
    start: new Vector3(17.5, 0.1, -155),
    crosswalkPointA: new Vector3(17.5, 0.1, -40),
    crosswalkPointB: new Vector3(17.5, 0.1, 40),
    end: new Vector3(17.5, 0.1, 155),
    material: straightMaterialA,
    visualModifier: xVisualModifier,
    laneA: 8,
    laneB: 7,
    trafficConditions: {
        northSouth: true,
        northSouthTurning: false,
        westTurning: false,
        noTraffic: false
    }
}

const vehiclePath7Turning = {
    ellipseCenterX: -25,
    ellipseCenterY: -25,
    radiusX: 27.5,
    radiusY: 27.5,
    startAngle: 0,
    endAngle: Math.PI * .5,
    clockWise: false,
    rotation: 0,
    directionalPointA: new Vector3(0, 0, -130),
    directionalPointB: new Vector3(-130, 0, 0),
    crossWalkPointA: new Vector3(0, 0, -15),
    crossWalkPointB: new Vector3(-15, 0, 0),
    visualModifier: xVisualModifier,
    material: turningMaterialA,
    laneA: 11,
    laneB: 20,
    trafficConditions: {
        northSouth: false,
        northSouthTurning: true,
        westTurning: false,
        noTraffic: false
    }
}

const vehiclePath8Turning = {
    ellipseCenterX: -25,
    ellipseCenterY: -25,
    radiusX: 7.5,
    radiusY: 7.5,
    startAngle: Math.PI * .5,
    endAngle: 0,
    clockWise: true,
    rotation: 0,
    directionalPointA: new Vector3(-130, 0, 0),
    directionalPointB: new Vector3(0, 0, -130),
    crossWalkPointA: new Vector3(-15, 0, 0),
    crossWalkPointB: new Vector3(0, 0, -15),
    visualModifier: xVisualModifier,
    material: turningMaterialA,
    laneA: 16,
    laneB: 15,
    trafficConditions: {
        northSouth: false,
        northSouthTurning: false,
        westTurning: true,
        noTraffic: false
    }
}

const vehiclePath9Turning = {
    ellipseCenterX: -25,
    ellipseCenterY: -25,
    radiusX: 12.5,
    radiusY: 12.5,
    startAngle: Math.PI * .5,
    endAngle: 0,
    clockWise: true,
    rotation: 0,
    directionalPointA: new Vector3(-130, 0, 0),
    directionalPointB: new Vector3(0, 0, -130),
    crossWalkPointA: new Vector3(-15, 0, 0),
    crossWalkPointB: new Vector3(0, 0, -15),
    visualModifier: xVisualModifier,
    material: turningMaterialA,
    laneA: 17,
    laneB: 14,
    trafficConditions: {
        northSouth: false,
        northSouthTurning: false,
        westTurning: true,
        noTraffic: false
    }
}

const vehiclePath10Turning = {
    ellipseCenterX: -25,
    ellipseCenterY: 25,
    radiusX: 27.5,
    radiusY: 27.5,
    startAngle: -Math.PI * .5,
    endAngle: 0,
    clockWise: false,
    rotation: 0,
    directionalPointA: new Vector3(-130, 0, 0),
    directionalPointB: new Vector3(0, 0, 130),
    crossWalkPointA: new Vector3(-15, 0, 0),
    crossWalkPointB: new Vector3(0, 0, 15),
    visualModifier: xVisualModifier,
    material: turningMaterialA,
    laneA: 19,
    laneB: 4,
    trafficConditions: {
        northSouth: false,
        northSouthTurning: false,
        westTurning: true,
        noTraffic: false
    }
}

const vehiclePath11Turning = {
    ellipseCenterX: -25,
    ellipseCenterY: 25,
    radiusX: 32.5,
    radiusY: 32.5,
    startAngle: -Math.PI * .5,
    endAngle: 0,
    clockWise: false,
    rotation: 0,
    directionalPointA: new Vector3(-130, 0, 0),
    directionalPointB: new Vector3(0, 0, 130),
    crossWalkPointA: new Vector3(-15, 0, 0),
    crossWalkPointB: new Vector3(0, 0, 15),
    visualModifier: xVisualModifier,
    material: turningMaterialA,
    laneA: 19,
    laneB: 4,
    trafficConditions: {
        northSouth: false,
        northSouthTurning: false,
        westTurning: true,
        noTraffic: false
    }
}

const vehicleTurnPath = ({
    ellipseCenterX = 0,
    ellipseCenterY = 0,
    radiusX = 0,
    radiusY = 0,
    startAngle = 0,
    endAngle = 0,
    clockWise = false,
    rotation = 0,
    directionalPointA = new Vector3(),
    directionalPointB = new Vector3(),
    crossWalkPointA = new Vector3(),
    crossWalkPointB = new Vector3(),
    material = new LineBasicMaterial(),
    laneA = -1,
    laneB = -1,
    trafficConditions
}) => {
    const ellipse = new EllipseCurve(
        ellipseCenterX, ellipseCenterY, // center x, y
        radiusX, radiusY, // radius x, y
        startAngle, endAngle, // start angle, end angle
        clockWise, // clockwise
        rotation // rotation
    );

    const ellipsePoints = ellipse.getPoints(8);
    const ellipsePoints3D = ellipsePoints.map(ep => new Vector3(ep.x, 0.1, ep.y));

    const crosswalkPointA = ellipsePoints3D[0].clone();
    crosswalkPointA.add(crossWalkPointA);
    const directionalEndPointA = ellipsePoints3D[0].clone();
    directionalEndPointA.add(directionalPointA);

    const crosswalkPointB = ellipsePoints3D[ellipsePoints3D.length - 1].clone();
    crosswalkPointB.add(crossWalkPointB);
    const directionalEndPointB = ellipsePoints3D[ellipsePoints3D.length - 1].clone();
    directionalEndPointB.add(directionalPointB);

    const crosswalkPoints = [
        crosswalkPointA,
        crosswalkPointB
    ]
    
    const turningGeometryPoints = [ directionalEndPointA, crosswalkPointA, ...ellipsePoints3D, crosswalkPointB, directionalEndPointB ];
    let startingPointAIndex = -1;
    turningGeometryPoints.forEach((gp, gpIndex) => {
        if(gp.distanceTo(crosswalkPointA) < .01){
            startingPointAIndex = gpIndex;
        }
    })
    let startingPointBIndex = -1;
    turningGeometryPoints.forEach((gp, gpIndex) => {
        if(gp.distanceTo(crosswalkPointB) < .01){
            startingPointBIndex = gpIndex;
        }
    })
    const startingPointIndexes = [startingPointAIndex, startingPointBIndex];

    const geometry = new BufferGeometry().setFromPoints( turningGeometryPoints );
    const bufferArray = new Float32Array(turningGeometryPoints.length * 3);
    for(let bufferIndex = 0; bufferIndex < turningGeometryPoints.length; bufferIndex++) {
        const i3 = bufferIndex * 3;
        bufferArray[i3] = turningGeometryPoints[bufferIndex].x;
        bufferArray[i3 + 1] = turningGeometryPoints[bufferIndex].y;
        bufferArray[i3 + 2] = turningGeometryPoints[bufferIndex].z;
    }
    const line = new Line( geometry, material );

    return {
        geometry,
        line,
        crosswalkPoints,
        bufferArray,
        bufferLength: bufferArray.length,
        startingPointIndexes,
        lanes: [laneA, laneB],
        trafficConditions
    }
}

const vehicleStraightPath = ({
    start = new Vector3(),
    end = new Vector3(),
    crosswalkPointA = new Vector3(),
    crosswalkPointB = new Vector3(),
    material = new LineBasicMaterial(),
    visualModifier = new Vector3(),
    laneA = -1,
    laneB = -1,
    trafficConditions
}) => {

    const straightGeometryPoints = [
        start.add(visualModifier),
        crosswalkPointA.add(visualModifier),
        crosswalkPointB.add(visualModifier),
        end.add(visualModifier)
    ]

    const crosswalkPoints = [crosswalkPointA, crosswalkPointB];
    let startingPointAIndex = -1;
    straightGeometryPoints.forEach((gp, gpIndex) => {
        if(gp.distanceTo(crosswalkPointA) < .01){
            startingPointAIndex = gpIndex;
        }
    })
    let startingPointBIndex = -1;
    straightGeometryPoints.forEach((gp, gpIndex) => {
        if(gp.distanceTo(crosswalkPointB) < .01){
            startingPointBIndex = gpIndex;
        }
    })
    const startingPointIndexes = [startingPointAIndex, startingPointBIndex];

    const geometry = new BufferGeometry().setFromPoints( straightGeometryPoints );
    const line = new Line( geometry, material );
    const bufferArray = new Float32Array(straightGeometryPoints.length * 3);
    for(let bufferIndex = 0; bufferIndex < straightGeometryPoints.length; bufferIndex++) {
        const i3 = bufferIndex * 3;
        bufferArray[i3] = straightGeometryPoints[bufferIndex].x;
        bufferArray[i3 + 1] = straightGeometryPoints[bufferIndex].y;
        bufferArray[i3 + 2] = straightGeometryPoints[bufferIndex].z;
    }

    return {
        geometry,
        line,
        crosswalkPoints,
        bufferArray,
        bufferLength: bufferArray.length,
        startingPointIndexes,
        lanes: [laneA, laneB],
        trafficConditions
    }
}


const pathData = {
    vehiclePath0TurningData: vehicleTurnPath(vehiclePath0Turning),
    // vehiclePath0StraightData: vehicleStraightPath(vehiclePath0Straight),
    // vehiclePath1TurningData: vehicleTurnPath(vehiclePath1Turning),
    vehiclePath1StraightData: vehicleStraightPath(vehiclePath1Straight),
    vehiclePath2StraightData: vehicleStraightPath(vehiclePath2Straight),
    vehiclePath3StraightData: vehicleStraightPath(vehiclePath3Straight),
    vehiclePath4StraightData: vehicleStraightPath(vehiclePath4Straight),
    vehiclePath5StraightData: vehicleStraightPath(vehiclePath5Straight),
    vehiclePath6StraightData: vehicleStraightPath(vehiclePath6Straight),
    vehiclePath7TurningData: vehicleTurnPath(vehiclePath7Turning),
    vehiclePath8TurningData: vehicleTurnPath(vehiclePath8Turning),
    vehiclePath9TurningData: vehicleTurnPath(vehiclePath9Turning),
    vehiclePath10TurningData: vehicleTurnPath(vehiclePath10Turning),
    vehiclePath11TurningData: vehicleTurnPath(vehiclePath11Turning)
};

const pathDataKeys = Object.keys(pathData);

pathDataKeys.forEach((pdk, pdkIndex) => {
    pathData[pdk].number = pdkIndex;
});

const pathBufferIndexes = new Float32Array(pathDataKeys.length);
const pathBufferTotalLength = pathDataKeys.reduce(
    (acc, pdk, index) => {
        pathBufferIndexes[index] = acc;
        const length = acc + pathData[pdk].bufferLength
        return length;
    }, 
    0
);

const pathArray = pathDataKeys.reduce(
    (acc: number[], pdk) => {
        return [...acc, ...pathData[pdk].bufferArray];
    }, 
    []
)
const pathBuffer = new Float32Array(pathArray);
const pathBufferLengths = pathDataKeys.map(pdk => pathData[pdk].bufferLength);

let crosswalkPointsBufferLocal: number[] = [];
let crosswalkPointsBufferLanes: number[] = [];

pathDataKeys.forEach(
    (pdk) => {
        crosswalkPointsBufferLocal = [
            ...crosswalkPointsBufferLocal,
            ...pathData[pdk].startingPointIndexes
        ]
        crosswalkPointsBufferLanes = [
            ...crosswalkPointsBufferLanes,
            ...pathData[pdk].lanes
        ]
    }
);

let bufferFullOffset = 0;
let bufferLengthIndex = 0;
const crosswalkPointsBufferIndexes = crosswalkPointsBufferLocal.map((bufferPosition, bufferPositionIndex) => {
    const updatedValue = bufferPosition + bufferFullOffset;
    if(bufferPositionIndex % 2 === 1) {
        bufferFullOffset += pathBufferLengths[bufferLengthIndex] / 3;
        bufferLengthIndex += 1;
    }
    return updatedValue;
})

let trafficConditionsBuffer: number[] = [];
pathDataKeys.forEach(
    (pdk) => {
        const trafficConditionsKeys = Object.keys(pathData[pdk].trafficConditions);
        const trafficConditionsBooleanNumbers: number[] = [];

        trafficConditionsKeys.forEach(tck => {
            trafficConditionsBooleanNumbers.push(
                pathData[pdk].trafficConditions[tck] === true ? 1 : 0
            );
        })

        trafficConditionsBuffer = [
            ...trafficConditionsBuffer,
            ...trafficConditionsBooleanNumbers
        ];
    }
);


export { 
    pathData, 
    pathBuffer, 
    pathBufferLengths, 
    pathBufferIndexes, 
    pathBufferTotalLength,
    crosswalkPointsBufferIndexes,
    crosswalkPointsBufferLanes,
    crosswalkPointsBufferLocal,
    trafficConditionsBuffer
};