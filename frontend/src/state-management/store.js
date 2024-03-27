import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './userState/userSlice';
import { shipmentReducer } from './shipmentState/shipmentSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    shipment: shipmentReducer,
  },
});

export default store;