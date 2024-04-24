/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  status: 'idle',
  user: null,
  users: [],
  userInfo: [],
  tempUserInfo: [],
  error: null,
  loading: false,
  currentUser: JSON.parse(localStorage.getItem('user')) || null,
  currentRole: (JSON.parse(localStorage.getItem('user')) || {}).role || null,
  token: localStorage.getItem('token') || null,
  response: null,
  responseStatus: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,

  reducers: {
    authRequest: (state) => {
      state.status = 'loading';
    },
    underControl: (state) => {
      state.status = 'idle';
      state.response = null;
    },
    authSuccess: (state, action) => {
      state.status = 'success';
      state.currentUser = action.payload;
      state.currentRole = action.payload.role;
      localStorage.setItem('user', JSON.stringify(action.payload));
      state.response = null;
      state.error = null;
    },
    authFailure: (state, action) => {
      state.status = 'failed';
      state.response = action.payload;
      state.error = action.payload;
    },
    authError: (state, action) => {
      state.status = 'error';
      state.response = action.payload;
      state.error = action.payload;
    },
    authLogout: (state) => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      state.currentUser = null;
      state.status = 'idle';
      state.token = null;
      state.currentRole = null;
      state.response = null;
      state.responseStatus = null;
      state.error = null;
    },
    authDeleteSuccess: (state, action) => {
      localStorage.removeItem('user');
      state.userInfo = null;
      state.loading = false,
      state.response = null;
      state.error = null
    },
    authUpdateSuccess: (state, action) => {
      localStorage.setItem('user', JSON.stringify(action.payload));
      state.userInfo = action.payload;
      state.loading = false;
      state.response = null;
      state.error = null;
    },
    getRequest: (state) => {
      state.loading = true;
    },
    getFailure: (state, action) => {
      state.loading = false;
      state.response = action.payload;
      state.error = action.payload;
    },
    getSuccess: (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
      state.response = null;
      state.error = null;
    },
    getError: (state, action) => {
      state.loading = false;
      state.response = action.payload;
      state.error = action.payload;
    },
    getUser: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.response = null;
      state.error = null;
    },
    getUsers: (state, action) => {
      state.loading = false;
      state.users = action.payload;
      state.response = null;
      state.error = null;
    },
  },
});

export const {
  authRequest,
  authSuccess,
  authFailure,
  authError,
  authLogout,
  authUpdateSuccess,
  authDeleteSuccess,
  getRequest,
  getSuccess,
  getFailure,
  getError,
  underControl,
  getUser,
  getUsers
} = userSlice.actions;

export const userReducer = userSlice.reducer;