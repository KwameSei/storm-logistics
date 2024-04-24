import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  shipment: null,
  shipments: [],
  error: null,
  loading: false,
};

const shipmentSlice = createSlice({
  name: 'shipment',
  initialState,
  reducers: {
    getShipments(state, action) {
      state.shipments = action.payload;
      state.loading = false;
    },
    getShipmentsSuccess(state, action) {
      state.shipments = action.payload;
      state.loading = false;
    },
    getShipmentsFailure(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    getShipment(state, action) {
      state.shipment = action.payload;
      state.loading = false;
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