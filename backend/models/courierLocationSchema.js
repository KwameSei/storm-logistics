import mongoose from "mongoose";

const courierLocationSchema = new mongoose.Schema({
  courier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shipment',
    required: true
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  }
});

const CourierLocation = mongoose.model('CourierLocation', courierLocationSchema);

export default CourierLocation;