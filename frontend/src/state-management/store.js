import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './userState/userSlice';
import { shipmentReducer } from './shipmentState/shipmentSlice';
import { paymentReducer } from './payment/paymentSlice';
import { icumsReducer } from './icums/icumsSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    shipment: shipmentReducer,
    payment: paymentReducer,
    icums: icumsReducer
  },
});

export default store;