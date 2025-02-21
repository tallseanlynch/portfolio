import {
  SnowShaderCanvas,
  BrandSection,
  WaterShaderCanvas,
  RomeShaderCanvas,
  InsectsShaderCanvas
} from './components';
import './assets/css/brand.css';
import {
  useEffect,
  memo,
  useState,
  Suspense
} from 'react';
import { useSelector } from 'react-redux';

interface SceneCounterState {
  sceneCounter: {
    value: number
  }
};

type calculateSceneIndexType = {
  startingSceneIndex: number;
  sceneCounter: number;
};

const scenes = [
  memo(WaterShaderCanvas),
  memo(SnowShaderCanvas),
  memo(RomeShaderCanvas),
  memo(InsectsShaderCanvas)
];

const startingSceneMap = {
  water: 0,
  [0]: 'water',
  snow: 1,
  [1]: 'snow',
  rome: 2,
  [2]: 'rome',
  insects: 3,
  [3]: 'insects'
};

const calculateSceneIndex = ({startingSceneIndex, sceneCounter}: calculateSceneIndexType): number => {
  const modulusIndex = (startingSceneIndex + sceneCounter) % scenes.length;
  const circularValue = modulusIndex > -1 ? modulusIndex : scenes.length + modulusIndex;
  return circularValue;
};

const calculateStartingSceneParams = (): string => {
  const urlString = window.location.href;
  const url = new URL(urlString);
  const searchParams = url.searchParams;
  const sceneParam = searchParams.get('scene');
  const startingSceneParam = sceneParam ? sceneParam : 'water';
  return startingSceneParam;
};

const Loading = () => {
    return (
        <div className='loading-container'>
          <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
        </div>
    )
}

const App = (): JSX.Element => {
  const sceneCounter = useSelector((state: SceneCounterState) => state.sceneCounter.value);
  const [startingSceneIndex, setStartingSceneIndex] = useState(0);

  useEffect(() => {
    setStartingSceneIndex(startingSceneMap[calculateStartingSceneParams()]);
  }, [])

  useEffect(() => {
    history.pushState(null, '', `?scene=${startingSceneMap[calculateSceneIndex({startingSceneIndex, sceneCounter})]}`)
  }, [sceneCounter, startingSceneIndex])

  const SceneToRender = scenes[calculateSceneIndex({startingSceneIndex, sceneCounter})];

  return (
    <>
      <Suspense fallback={<Loading />}>
        <div className='container-100'>
            <SceneToRender />
          </div>
          <BrandSection />
      </Suspense>
    </>
  );
}

export default App;