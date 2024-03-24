import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './userState/userSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;