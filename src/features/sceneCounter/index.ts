import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SceneCounterState {
  value: number;
}

export const sceneCounterSlice = createSlice({
  name: 'sceneCounter',
  initialState: { value: 0 } as SceneCounterState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    setValue: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
});

export const { increment, decrement, setValue } = sceneCounterSlice.actions;

export default sceneCounterSlice.reducer;