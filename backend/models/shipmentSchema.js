import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true
  },
  senderMail: {
    type: String,
    required: true
  },
  recipientName: {
    type: String,
    required: true
  },
  recipientPhone: {
    type: String,
    required: true
  },
  trackingNumber: {
    type: String,
    // required: true
  },
  departureDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: 'Pending'
  },
  origin: {
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true }
  },
  destination: {
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true }
  },
  // userId: {
  //   type: mongoose.Schema.Types.ObjectId, 
  //   ref: 'User', 
  //   required: true
  // },
  estimatedDelivery: {
    type: Date
  },
  location: {
    type: String
  },
},
{
  timestamps: true
});

// Pre-save hook to generate tracking number
shipmentSchema.pre('save', async function (next) {
  try {
    if (!this.trackingNumber) {
      this.trackingNumber = generateTrackingNumber();
    }

    next();
  } catch (error) {
    next(error)
  }
})

// Helper function to generate a random tracking number
const generateTrackingNumber = () => {
  const trackingNumber = Math.random().toString(36).substring(2, 9).toUpperCase();
  return trackingNumber;
}

// Method to extract tracking number without the object properties
// shipmentSchema.methods.extractTrackingNumber = function () {
//   const regex = /ObjectId\('([a-fA-F0-9]+)'\)/; // Regex to match the tracking number
//   const match = this.trackingNumber.match(regex); // Match the tracking number
//   return match ? match[1] : ''; // Return the tracking number without the object properties
// }

const Shipment = mongoose.model('Shipment', shipmentSchema)

export default Shipment;