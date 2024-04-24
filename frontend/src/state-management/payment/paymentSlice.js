import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  payment: null,
  payments: [],
  paymentError: null,
  paymentStatus: null,
  paymentStatusError: null,
  paymentCallback: null,
  paymentCallbackError: null,
  paymentId: null,
  response: null,
  status: null,
  message: null,
  data: null,
  paymentStatusData: null,
  paymentCallbackData: null,
  paymentData: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setPayment: (state, action) => {
      state.payment = action.payload;
      state.response = action.payload.response;
      state.status = action.payload.status;
      state.message = action.payload.message;
      state.data = action.payload.data;
      state.paymentData = action.payload.paymentData;
      state.paymentError = null;
    },
    setPayments: (state, action) => {
      state.payments = action.payload;
      state.response = action.payload.response;
      state.status = action.payload.status;
      state.message = action.payload.message;
      state.data = action.payload.data;
      state.paymentData = action.payload.paymentData;
      state.paymentError = null;
    },
    setPaymentError: (state, action) => {
      state.paymentError = action.payload;
      // state.response = action.payload.response;
    },
    setPaymentStatus: (state, action) => {
      state.paymentStatus = action.payload;
    },
    setPaymentStatusError: (state, action) => {
      state.paymentStatusError = action.payload;
      state.response = action.payload.response;
      state.status = action.payload.status;
      state.message = action.payload.message;
      state.data = action.payload.data;
      state.paymentStatusData = action.payload.paymentStatusData;
    },
    setPaymentCallback: (state, action) => {
      state.paymentCallback = action.payload;
      state.response = action.payload.response;
      state.status = action.payload.status;
      state.message = action.payload.message;
      state.data = action.payload.data;
      state.paymentCallbackData = action.payload.paymentCallbackData;
    },
    setPaymentCallbackError: (state, action) => {
      state.paymentCallbackError = action.payload;
      state.response = action.payload.response;
      state.status = action.payload.status;
      state.message = action.payload.message;
    },
    setPaymentId: (state, action) => {
      state.paymentId = action.payload;
    },
  },
});

export const {
  setPayment,
  setPayments,
  setPaymentError,
  setPaymentStatus,
  setPaymentStatusError,
  setPaymentCallback,
  setPaymentCallbackError
} = paymentSlice.actions;

export const paymentReducer = paymentSlice.reducer;