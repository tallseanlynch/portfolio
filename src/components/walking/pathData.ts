import { LineBasicMaterial, Vector3 } from 'three';

const turningMaterialA = new LineBasicMaterial({
    color: 0xff0000
});
const straightMaterialA = new LineBasicMaterial({
    color: 0x00ffff
});

const turningMaterialB = new LineBasicMaterial({
    color: 0x00ff00
});
const straightMaterialB = new LineBasicMaterial({
    color: 0xff00ff
});

const xVisualModifier = new Vector3(0.2, 0, 0);
const zVisualModifier = new Vector3(0, 0, 0.2);

const vehiclePath0Turning = {
    ellipseCenterX: -25,
    ellipseCenterY: 25,
    radiusX: 7.5,
    radiusY: 7.5,
    startAngle: -Math.PI * .5,
    endAngle: 0,
    clockWise: false,
    rotation: 0,
    directionalPointA: new Vector3(-130, 0, 0),
    directionalPointB: new Vector3(0, 0, 130),
    crossWalkPointA: new Vector3(-15, 0, 0),
    crossWalkPointB: new Vector3(0, 0, 15),
    visualModifier: xVisualModifier,
    material: turningMaterialA
}

const vehiclePath0Straight = {
    start: new Vector3(-17.5, 0.1, 155),
    crosswalkPointA: new Vector3(-17.5, 0.1, 40),
    crosswalkPointB: new Vector3(-17.5, 0.1, -40),
    end: new Vector3(-17.5, 0.1, -155),
    material: straightMaterialA,
    visualModifier: xVisualModifier
}

const vehiclePath1Turning = {
    ellipseCenterX: -25,
    ellipseCenterY: 25,
    radiusX: 12.5,
    radiusY: 12.5,
    startAngle: -Math.PI * .5,
    endAngle: 0,
    clockWise: false,
    rotation: 0,
    directionalPointA: new Vector3(-130, 0, 0),
    directionalPointB: new Vector3(0, 0, 130),
    crossWalkPointA: new Vector3(-15, 0, 0),
    crossWalkPointB: new Vector3(0, 0, 15),
    visualModifier: xVisualModifier,
    material: turningMaterialA
}

const vehiclePath1Straight = {
    start: new Vector3(-12.5, 0.1, 155),
    crosswalkPointA: new Vector3(-12.5, 0.1, 40),
    crosswalkPointB: new Vector3(-12.5, 0.1, -40),
    end: new Vector3(-12.5, 0.1, -155),
    material: straightMaterialA,
    visualModifier: xVisualModifier
}

const vehiclePath1 = {
    ellipseCenterX: -25,
    ellipseCenterY: 25,
    radiusX: 12.5,
    radiusY: 12.5,
    startAngle: -Math.PI * .5,
    endAngle: 0,
    clockWise: false,
    rotation: 0,
    directionalPointA: new Vector3(-130, 0, 0),
    directionalPointB: new Vector3(0, 0, 130),
    crossWalkPointA: new Vector3(-15, 0, 0),
    crossWalkPointB: new Vector3(0, 0, 15),
    straightEndPoint: new Vector3(0, 0, 115),
    straightOppositeEndPoint: new Vector3(0, 0, -195),
    visualModifier: xVisualModifier,
    turningMaterial: turningMaterialA,
    straightMaterial: straightMaterialA
}

const vehiclePath2 = {
    ellipseCenterX: -25,
    ellipseCenterY: -25,
    radiusX: 27.5,
    radiusY: 27.5,
    startAngle: 0,
    endAngle: -Math.PI * 1.5,
    clockWise: false,
    rotation: 0,
    directionalPointA: new Vector3(0, 0, -130),
    directionalPointB: new Vector3(-130, 0, 0),
    crossWalkPointA: new Vector3(0, 0, -15),
    crossWalkPointB: new Vector3(-15, 0, 0),
    straightEndPoint: new Vector3(0, 0, 195),
    straightOppositeEndPoint: new Vector3(0, 0, -115),
    visualModifier: xVisualModifier,
    switchStraightPoint: true,
    turningMaterial: turningMaterialA,
    straightMaterial: straightMaterialB
}

const vehiclePath3 = {
    ellipseCenterX: -25,
    ellipseCenterY: -25,
    radiusX: 32.5,
    radiusY: 32.5,
    startAngle: 0,
    endAngle: -Math.PI * 1.5,
    clockWise: false,
    rotation: 0,
    directionalPointA: new Vector3(0, 0, -130),
    directionalPointB: new Vector3(-130, 0, 0),
    crossWalkPointA: new Vector3(0, 0, -15),
    crossWalkPointB: new Vector3(-15, 0, 0),
    straightEndPoint: new Vector3(0, 0, 195),
    straightOppositeEndPoint: new Vector3(0, 0, -115),
    visualModifier: xVisualModifier,
    switchStraightPoint: true,
    turningMaterial: turningMaterialA,
    straightMaterial: straightMaterialB
}

const vehiclePath4 = {
    ellipseCenterX: -25,
    ellipseCenterY: -25,
    radiusX: 7.5,
    radiusY: 7.5,
    startAngle: 0,
    endAngle: -Math.PI * 1.5,
    clockWise: false,
    rotation: 0,
    directionalPointA: new Vector3(0, 0, -130),
    directionalPointB: new Vector3(-130, 0, 0),
    crossWalkPointA: new Vector3(0, 0, -15),
    crossWalkPointB: new Vector3(-15, 0, 0),
    straightEndPoint: new Vector3(0, 0, 195),
    straightOppositeEndPoint: new Vector3(0, 0, -115),
    visualModifier: xVisualModifier,
    switchStraightPoint: true,
    turningMaterial: turningMaterialB,
    straightMaterial: straightMaterialB,
    onlyTurn: true
}

const vehiclePath5 = {
    ellipseCenterX: -25,
    ellipseCenterY: -25,
    radiusX: 12.5,
    radiusY: 12.5,
    startAngle: 0,
    endAngle: -Math.PI * 1.5,
    clockWise: false,
    rotation: 0,
    directionalPointA: new Vector3(0, 0, -130),
    directionalPointB: new Vector3(-130, 0, 0),
    crossWalkPointA: new Vector3(0, 0, -15),
    crossWalkPointB: new Vector3(-15, 0, 0),
    straightEndPoint: new Vector3(0, 0, 195),
    straightOppositeEndPoint: new Vector3(0, 0, -115),
    visualModifier: zVisualModifier,
    switchStraightPoint: true,
    turningMaterial: turningMaterialB,
    straightMaterial: straightMaterialB,
    onlyTurn: true
}

const vehiclePath6 = {
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
    straightEndPoint: new Vector3(0, 0, 115),
    straightOppositeEndPoint: new Vector3(0, 0, -195),
    visualModifier: zVisualModifier,
    turningMaterial: turningMaterialB,
    straightMaterial: straightMaterialB,
    onlyTurn: true
}

const vehiclePath7 = {
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
    straightEndPoint: new Vector3(0, 0, 115),
    straightOppositeEndPoint: new Vector3(0, 0, -195),
    visualModifier: zVisualModifier,
    turningMaterial: turningMaterialB,
    straightMaterial: straightMaterialB,
    onlyTurn: true
}

const vehiclePath8 = {
    ellipseCenterX: -25,
    ellipseCenterY: 25,
    radiusX: 17,
    radiusY: 17,
    startAngle: -Math.PI * .5,
    endAngle: 0,
    clockWise: false,
    rotation: 0,
    directionalPointA: new Vector3(-130, 0, 0),
    directionalPointB: new Vector3(0, 0, 130),
    crossWalkPointA: new Vector3(-15, 0, 0),
    crossWalkPointB: new Vector3(0, 0, 15),
    straightEndPoint: new Vector3(0, 0, 115),
    straightOppositeEndPoint: new Vector3(0, 0, -195),
    visualModifier: xVisualModifier,
    turningMaterial: turningMaterialA,
    straightMaterial: straightMaterialA,
    onlyStraight: true
}

const vehiclePath9 = {
    ellipseCenterX: -25,
    ellipseCenterY: 25,
    radiusX: 22,
    radiusY: 22,
    startAngle: -Math.PI * .5,
    endAngle: 0,
    clockWise: false,
    rotation: 0,
    directionalPointA: new Vector3(-130, 0, 0),
    directionalPointB: new Vector3(0, 0, 130),
    crossWalkPointA: new Vector3(-15, 0, 0),
    crossWalkPointB: new Vector3(0, 0, 15),
    straightEndPoint: new Vector3(0, 0, 115),
    straightOppositeEndPoint: new Vector3(0, 0, -195),
    visualModifier: xVisualModifier,
    turningMaterial: turningMaterialA,
    straightMaterial: straightMaterialA,
    onlyStraight: true
}

const vehiclePath10 = {
    ellipseCenterX: -25,
    ellipseCenterY: -25,
    radiusX: 37.5,
    radiusY: 37.5,
    startAngle: 0,
    endAngle: -Math.PI * 1.5,
    clockWise: false,
    rotation: 0,
    directionalPointA: new Vector3(0, 0, -130),
    directionalPointB: new Vector3(-130, 0, 0),
    crossWalkPointA: new Vector3(0, 0, -15),
    crossWalkPointB: new Vector3(-15, 0, 0),
    straightEndPoint: new Vector3(0, 0, 195),
    straightOppositeEndPoint: new Vector3(0, 0, -115),
    visualModifier: zVisualModifier,
    switchStraightPoint: true,
    turningMaterial: turningMaterialB,
    straightMaterial: straightMaterialB,
    onlyStraight: true
}

const vehiclePath11 = {
    ellipseCenterX: -25,
    ellipseCenterY: -25,
    radiusX: 42.5,
    radiusY: 42.5,
    startAngle: 0,
    endAngle: -Math.PI * 1.5,
    clockWise: false,
    rotation: 0,
    directionalPointA: new Vector3(0, 0, -130),
    directionalPointB: new Vector3(-130, 0, 0),
    crossWalkPointA: new Vector3(0, 0, -15),
    crossWalkPointB: new Vector3(-15, 0, 0),
    straightEndPoint: new Vector3(0, 0, 195),
    straightOppositeEndPoint: new Vector3(0, 0, -115),
    visualModifier: zVisualModifier,
    switchStraightPoint: true,
    turningMaterial: turningMaterialB,
    straightMaterial: straightMaterialB,
    onlyStraight: true
}

const pathData = {
    vehiclePath0Turning,
    vehiclePath0Straight,
    vehiclePath1Turning,
    vehiclePath1Straight,
    vehiclePath1,
    vehiclePath2,
    vehiclePath3,
    vehiclePath4,
    vehiclePath5,
    vehiclePath6,
    vehiclePath7,
    vehiclePath8,
    vehiclePath9,
    vehiclePath10,
    vehiclePath11
}

export { pathData };