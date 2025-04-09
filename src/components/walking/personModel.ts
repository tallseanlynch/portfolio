import { BoxGeometry } from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

const personTorso = new BoxGeometry(1, .75, .5, 1, 1, 1);
const personHead = new BoxGeometry(.5, .5, .25, 1, 1, 1);
personHead.translate(0, .5, 0);
const personLegA = new BoxGeometry(.25, .75, .5, 1, 1, 1);
personLegA.translate(-.37, -.75, 0);
const personLegB = new BoxGeometry(.25, .75, .5, 1, 1, 1);
personLegB.translate(.37, -.75, 0);
const personArmA = new BoxGeometry(.25, .75, .5, 1, 1, 1);
personArmA.translate(-.475, -.225, 0);
personArmA.rotateZ(-.4);
const personArmB = new BoxGeometry(.25, .75, .5, 1, 1, 1);
personArmB.translate(.475, -.225, 0);
personArmB.rotateZ(.4);
const peopleGeometry = mergeGeometries([
  personTorso, 
  personHead, 
  personLegA, 
  personLegB, 
  personArmA, 
  personArmB
]);
peopleGeometry.translate(0, .725, 0);

export { 
  peopleGeometry,
  personArmA,
  personArmB,
  personHead,
  personLegA,
  personLegB,
  personTorso
};