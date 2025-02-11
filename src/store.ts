import { configureStore } from '@reduxjs/toolkit'
import sceneCounterReducer from './features/sceneCounter';

export default configureStore({
  reducer: {
    sceneCounter: sceneCounterReducer
  },
})