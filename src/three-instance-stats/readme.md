# three-instance-stats

Simple Proxy around three classes to allow a count of how many instances of that class have been created. This only works with classes from three and not everything is supported. Simple classes like Color, Euler and Vector3 are best to test.

Make sure this is not imported into any production builds and only used for dev testing.

## Usage step 1
Comment out variables which you would like to get an instance count of, import then from three-instance-stats instead. If using TypeScript, you will need to import some classes from three for their types. Include InstanceStats for a React component that will display stats as a table.

```js
import {
//     Color,
//     Vector2,
    Vector3 as Vector3Type,
//     Quaternion,
    TextureLoader
} from 'three'

import {
    Color,
    Vector2,
    Vector3,
    Quaternion,
    InstanceStats // React component displays stats
} from '../path-in-project/three-instance-stats'
```

## Usage step 2
Added InstanceStats component into your app / component.

```js
const ComponentWithStats = () => {
    return (
        <>
            <InstanceStats 
                // Number of miliseconds between each update
                updateTimeMS={500} 
                // Array of strings selecting which stats to display.
                // If empty display all stats with instance counts > 0
                stats={['Color', 'Euler', 'Vector2', 'Vector3']}
                // Boolean to display all stats regardless of stats value
                showAll={false}
            />
            <Canvas
                camera={{ position: [0, 0, 15] }}
                className={classNames}
            >
                <WaterShader render={classNames === '' ? true : false} />
                <OrbitControls
                    enableDamping={true}
                    dampingFactor={0.05}
                    screenSpacePanning={false}
                    zoomSpeed={.1}
                    panSpeed={.1}
                    rotateSpeed={.1}
                />
            </Canvas>
        </>
    )
}
```
