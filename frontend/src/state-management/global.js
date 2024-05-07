import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mode: 'dark',
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setMode(state, action) {
      state.mode = state.mode === 'dark' ? 'light' : 'dark';
    },
  },
});

export const { setMode } = globalSlice.actions;

export const globalReducer = globalSlice.reducer;