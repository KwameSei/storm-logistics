import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  icums: null,
  icumses: [],
  icumsError: null,
  icumsStatus: null,
  icumsStatusError: null,
  icumsId: null,
  response: null,
  status: null,
  message: null,
  data: null,
  icumsData: null,
};

const icumsSlice = createSlice({
  name: 'icums',
  initialState,
  reducers: {
    setIcums: (state, action) => {
      state.icums = action.payload;
      state.icumsError = null;
    },
    setIcumses: (state, action) => {
      state.icumses = action.payload;
      state.icumsError = null;
    },
    setIcumsError: (state, action) => {
      state.icumsError = action.payload;
      // state.response = action.payload.response;
    },
    setIcumsStatus: (state, action) => {
      state.icumsStatus = action.payload;
    },
    setIcumsStatusError: (state, action) => {
      state.icumsStatusError = action.payload;
      state.response = action.payload.response;
      state.status = action.payload.status;
      state.message = action.payload.message;
      state.data = action.payload.data;
    },
  },
});

export const {
  setIcums,
  setIcumses,
  setIcumsError,
  setIcumsStatus,
  setIcumsStatusError,
} = icumsSlice.actions;

export const icumsReducer = icumsSlice.reducer;