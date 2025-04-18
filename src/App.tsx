import {
  BrandSection,
  InsectsShaderCanvas,
  RomeShaderCanvas,
  SnowShaderCanvas,
  WaterShaderCanvas,
  MixShaderCanvas,
  WalkingShaderCanvas
} from './components';
import './assets/css/brand.css';
import {
  Suspense,
  useEffect,
  useState
} from 'react';
import { useSelector } from 'react-redux';

const scenes = [
  WaterShaderCanvas,
  SnowShaderCanvas,
  RomeShaderCanvas,
  InsectsShaderCanvas,
  MixShaderCanvas,
  WalkingShaderCanvas
];

const startingSceneMap = {
  water: 0,
  [0]: 'water',
  snow: 1,
  [1]: 'snow',
  rome: 2,
  [2]: 'rome',
  insects: 3,
  [3]: 'insects',
  mix: 4,
  [4]: 'mix',
  walking: 5,
  [5]: 'walking'
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

const Loading: React.FC = (): JSX.Element => {
    return (
      <div className='loading-container'>
        <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
      </div>
    )
};

const App: React.FC = (): JSX.Element => {
  const sceneCounter = useSelector((state: SceneCounterState) => state.sceneCounter.value);
  const [startingSceneIndex, setStartingSceneIndex] = useState(0);

  useEffect(() => {
    setStartingSceneIndex(startingSceneMap[calculateStartingSceneParams()]);
  }, [])

  useEffect(() => {
    history.pushState(null, '', `?scene=${startingSceneMap[calculateSceneIndex({startingSceneIndex, sceneCounter})]}`);
  }, [sceneCounter, startingSceneIndex])

  const sceneIndex = calculateSceneIndex({startingSceneIndex, sceneCounter});
  const SceneToRender = scenes[sceneIndex];

  return (
    <>
      <Suspense fallback={<Loading />}>
        <div className='container-100'>
          <SceneToRender />
        </div>
      </Suspense>
      <BrandSection />
    </>
  );
};

export default App;