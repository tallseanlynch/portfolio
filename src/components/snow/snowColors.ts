import { 
    Color,
    Fog
} from 'three';

const whiteColor = new Color(0xffffff);
const defaultFogColor = new Color(0xf2fbfe);
const defaultSceneFog = new Fog(defaultFogColor, 5, 50);

export { whiteColor, defaultFogColor, defaultSceneFog };