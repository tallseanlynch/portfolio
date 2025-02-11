import {
  SnowShaderCanvas,
  BrandSection,
  WaterShaderCanvas,
  RomeShaderCanvas
} from './components';
import './assets/css/brand.css';
import {
  useEffect,
  memo,
  useState
} from 'react';
import { useSelector } from 'react-redux';

interface SceneCounterState {
  sceneCounter: {
    value: number
  }
}

const scenes = [
  memo(WaterShaderCanvas),
  memo(SnowShaderCanvas),
  memo(RomeShaderCanvas)
]

const App = (): JSX.Element => {
  const sceneCounter = useSelector((state: SceneCounterState) => state.sceneCounter.value);
  const [startingSceneIndex, setStartingSceneIndex] = useState(0);

  const startingSceneMap = {
    water: 0,
    [0]: 'water',
    snow: 1,
    [1]: 'snow',
    rome: 2,
    [2]: 'rome'
  }

  useEffect(() => {
    const urlString = window.location.href;
    const url = new URL(urlString);
    const searchParams = url.searchParams;
    const sceneParam = searchParams.get('scene');
    const startingSceneParam = sceneParam ? sceneParam : 'water';
    setStartingSceneIndex(startingSceneMap[startingSceneParam]);
  }, [])

  useEffect(() => {
    history.pushState(null, '', `?scene=${startingSceneMap[(startingSceneIndex + Math.abs(sceneCounter)) % scenes.length]}`)
  }, [sceneCounter, startingSceneIndex])

  const SceneToRender = scenes[(startingSceneIndex + Math.abs(sceneCounter)) % scenes.length]

  return (
    <>
      <div className='container-100'>
        <SceneToRender />
      </div>
      <BrandSection />
    </>
  );
}

export default App;