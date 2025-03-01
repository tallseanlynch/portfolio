import { 
    Color,
    Fog
} from 'three';

const defaultFogColor = new Color(0xf2fbfe);
const defaultSceneFog = new Fog(defaultFogColor, 5, 50);
const whiteColor = new Color(0xffffff);

export { defaultFogColor, defaultSceneFog, whiteColor };