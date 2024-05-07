import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './userState/userSlice';
import { shipmentReducer } from './shipmentState/shipmentSlice';
import { paymentReducer } from './payment/paymentSlice';
import { icumsReducer } from './icums/icumsSlice';
import { globalReducer } from './global';

const store = configureStore({
  reducer: {
    global: globalReducer,
    user: userReducer,
    shipment: shipmentReducer,
    payment: paymentReducer,
    icums: icumsReducer
  },
});

export default store;