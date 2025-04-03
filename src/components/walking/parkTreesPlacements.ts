import { Euler, Vector3 } from 'three';

// treeA
const treePositionsA0 = [
    new Vector3(40, 0, -10),
    new Vector3(40, 0, 20),
    new Vector3(60, 0, 20),
    new Vector3(60, 0, 10),
    new Vector3(50, 0, 5),
    new Vector3(40, 0, 5)
];

const treeRotationsA0 = [
    new Euler(0, Math.PI * .5, 0),
    new Euler(0, 0, 0),
    new Euler(0, Math.PI * .5, 0),
    new Euler(0, 0, 0),
    new Euler(0, Math.PI * .5, 0),
    new Euler(0, 0, 0)
];

const treePositionsA1 = [
    new Vector3(70, 0, 22),
    new Vector3(80, 0, 22),
    new Vector3(60, 15, 18),
    new Vector3(70, 0, -22),
    new Vector3(100, 0, -5),
    new Vector3(100, 0, -15)
];

const treeRotationsA1 = [
    new Euler(0, Math.PI, 0),
    new Euler(0, Math.PI, 0),
    new Euler(0, Math.PI * .5, 0),
    new Euler(0, 0, 0),
    new Euler(0, Math.PI * .5, 0),
    new Euler(0, 0, 0)
];

const treePositionsA2 = [
    new Vector3(-50, 0, 105),
    new Vector3(-85, 0, 55),
    new Vector3(-65, 0, 70),
    new Vector3(-60, 0, 85),
    new Vector3(-40, 0, 45),
    new Vector3(-75, 0, 65)
];

const treeRotationsA2 = [
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, Math.PI * .25, 0),
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, 0, 0)
];

const treePositionsA3 = [
    new Vector3(-50, 0, 95),
    new Vector3(-75, 0, 120),
    new Vector3(-95, 0, 120),
    new Vector3(-85, 0, 110),
    new Vector3(-100, 0, 100),
    new Vector3(-120, 0, 95)
];

const treeRotationsA3 = [
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, Math.PI * .25, 0),
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0)
];

const treePositionsA4 = [
    new Vector3(-42, 0, 52),
    new Vector3(-42, 0, 80),
    new Vector3(-40, 0, 120),
    new Vector3(-45, 0, 110),
    new Vector3(-100, 0, 100),
    new Vector3(-45, 10, 110)
];

const treeRotationsA4 = [
    new Euler(0, Math.PI * .25, 0),
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0)
];

const treePositionsA5 = [
    new Vector3(-135, 0, -43),
    new Vector3(-90, 0, -41),
    new Vector3(-88, 0, -60),
    new Vector3(-51, 0, -43),
    new Vector3(-42, 0, -64),
    new Vector3(-42, 0, -110)
];

const treeRotationsA5 = [
    new Euler(0, Math.PI * .25, 0),
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0)
];

const treePositionsA6 = [
    new Vector3(-39, 0, -113),
    new Vector3(-87, 0, -70),
    new Vector3(-88, 0, -48),
    new Vector3(-79, 0, -40),
    new Vector3(-42, 0, -41),
    new Vector3(-40.5, 0, -90)
];

const treeRotationsA6 = [
    new Euler(0, Math.PI * .25, 0),
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0)
];

// treeB
const treePositionsB0 = [
    new Vector3(40, 0, -5),
    new Vector3(90, 0, -15),
    new Vector3(75, 0, 10),
    new Vector3(100, 0, 20),
    new Vector3(50, 0, 20),
    new Vector3(38, 0, 15)
];

const treeRotationsB0 = [
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, Math.PI * .25, 0)
];

const treePositionsB1 = [
    new Vector3(80, 0, -15),
    new Vector3(90, 0, -20),
    new Vector3(115, 0, -20),
    new Vector3(85, 0, 15),
    new Vector3(50, 0, 15),
    new Vector3(80, 10, -15)
];

const treeRotationsB1 = [
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, -Math.PI, 0),
    new Euler(0, Math.PI, 0),
    new Euler(0, 0, 0)
];

const treePositionsB2 = [
    new Vector3(-50, 0, 55),
    new Vector3(-85, 0, 45),
    new Vector3(-55, 0, 70),
    new Vector3(-50, 0, 85),
    new Vector3(-50, 0, 40),
    new Vector3(-70, 0, 55)
];

const treeRotationsB2 = [
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, Math.PI * .25, 0),
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, 0, 0)
];

const treePositionsB3 = [
    new Vector3(-70, 0, 95),
    new Vector3(-95, 0, 130),
    new Vector3(-115, 0, 120),
    new Vector3(-90, 0, 105),
    new Vector3(-100, 0, 90),
    new Vector3(-110, 0, 95)
];

const treeRotationsB3 = [
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, Math.PI * .25, 0),
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0)
];

const treePositionsB4 = [
    new Vector3(-70, 10, 95),
    new Vector3(-95, 5, 130),
    new Vector3(-115, 15, 120),
    new Vector3(-90, 10, 105),
    new Vector3(-100, 10, 90),
    new Vector3(-110, 15, 95)
];

const treeRotationsB4 = [
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, Math.PI * .25, 0),
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0)
].reverse();

const treePositionsB5 = [
    new Vector3(-38, 0, 112),
    new Vector3(-45, 0, 95),
    new Vector3(-40, 0, 90),
    new Vector3(-40, 0, 105),
    new Vector3(-44, 0, 60),
    new Vector3(-60, 0, 45)
];

const treeRotationsB5 = [
    new Euler(0, Math.PI * .25, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0)
].reverse();

const treePositionsB6 = [
    new Vector3(-125, 0, -45),
    new Vector3(-106, 0, -42),
    new Vector3(-81, 0, -70),
    new Vector3(-79, 0, -51),
    new Vector3(-41, 0, -47),
    new Vector3(-72, 0, -41)
];

const treeRotationsB6 = [
    new Euler(0, Math.PI * .25, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0)
].reverse();

const treePositionsB7 = [
    new Vector3(-83, 0, -42),
    new Vector3(-42, 0, -54),
    new Vector3(-73, 0, -68),
    new Vector3(-90, 0, -68),
    new Vector3(-40, 0, -105),
    new Vector3(-113, 0, -46)
];

const treeRotationsB7 = [
    new Euler(0, Math.PI * .25, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0)
].reverse();

// treeC
const treePositionsC0 = [
    new Vector3(120, 0, -5),
    new Vector3(90, 0, -15),
    new Vector3(75, 0, 10),
    new Vector3(100, 0, 20),
    new Vector3(130, 0, -20),
    new Vector3(90, 0, 15)
];

const treeRotationsC0 = [
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, Math.PI * .25, 0)
];

const treePositionsC1 = [
    new Vector3(-60, 0, 55),
    new Vector3(-95, 0, 45),
    new Vector3(-45, 0, 70),
    new Vector3(-70, 0, 85),
    new Vector3(-70, 0, 50),
    new Vector3(-90, 0, 65)
];

const treeRotationsC1 = [
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, Math.PI * .25, 0)
];

const treePositionsC2 = [
    new Vector3(-60, 0, 95),
    new Vector3(-95, 0, 130),
    new Vector3(-115, 0, 120),
    new Vector3(-120, 0, 85),
    new Vector3(-100, 0, 110),
    new Vector3(-110, 0, 105)
];

const treeRotationsC2 = [
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, Math.PI * .25, 0),
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0)
];

const treePositionsC3 = [
    new Vector3(-111, 0, 43),
    new Vector3(-80, 0, 73),
    new Vector3(-56, 0, 77),
    new Vector3(-130, 0, 70),
    new Vector3(-65, 0, 40),
    new Vector3(-62, 0, 131)
];

const treeRotationsC3 = [
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, Math.PI * .25, 0),
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0)
];

const treePositionsC4 = [
    new Vector3(-40, 0, -122),
    new Vector3(-54, 0, -108),
    new Vector3(-117, 0, -44),
    new Vector3(-78, 0, -78),
    new Vector3(-75, 0, -55),
    new Vector3(-85, 0, -82)
];

const treeRotationsC4 = [
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0)
];

const treePositionsC5 = [
    new Vector3(-48, 0, -79),
    new Vector3(-45, 0, -95),
    new Vector3(-45, 0, -79),
    new Vector3(-64, 0, -43),
    new Vector3(-100, 0, -42),
    new Vector3(-96, 0, -43)
];

const treeRotationsC5 = [
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0),
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, 0, 0),
    new Euler(0, -Math.PI * .5, 0)
];

export {
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
}