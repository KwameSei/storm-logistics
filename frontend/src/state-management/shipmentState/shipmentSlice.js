import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  shipments: [],
  shipment: {},
  error: null,
  loading: false,
};

const shipmentSlice = createSlice({
  name: 'shipment',
  initialState,
  reducers: {
    getShipments(state) {
      state.loading = true;
    },
    getShipmentsSuccess(state, action) {
      state.shipments = action.payload;
      state.loading = false;
    },
    getShipmentsFailure(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    getShipment(state) {
      state.loading = true;
    },
    getShipmentSuccess(state, action) {
      state.shipment = action.payload;
      state.loading = false;
    },
    getShipmentFailure(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  getShipments,
  getShipmentsSuccess,
  getShipmentsFailure,
  getShipment,
  getShipmentSuccess,
  getShipmentFailure,
} = shipmentSlice.actions;

export const shipmentReducer = shipmentSlice.reducer;