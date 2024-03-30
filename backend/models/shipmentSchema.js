// import mongoose from "mongoose";

// const shipmentSchema = new mongoose.Schema({
//   item: {
//     type: String,
//     required: true
//   },
//   senderMail: {
//     type: String,
//     required: true
//   },
//   recipientName: {
//     type: String,
//     required: true
//   },
//   recipientPhone: {
//     type: String,
//     required: true
//   },
//   trackingNumber: {
//     type: String,
//     // required: true
//   },
//   departureDate: {
//     type: Date,
//     required: true
//   },
//   status: {
//     type: String,
//     required: true,
//     default: 'Pending'
//   },
//   origin: {
//     country: { type: String, required: true },
//     state: { type: String, required: true },
//     city: { type: String, required: true }
//   },
//   destination: {
//     country: { type: String, required: true },
//     state: { type: String, required: true },
//     city: { type: String, required: true }
//   },
//   // userId: {
//   //   type: mongoose.Schema.Types.ObjectId, 
//   //   ref: 'User', 
//   //   required: true
//   // },
//   estimatedDelivery: {
//     type: Date
//   },
//   location: {
//     type: String
//   },
// },
// {
//   timestamps: true
// });

// // Pre-save hook to generate tracking number
// shipmentSchema.pre('save', async function (next) {
//   try {
//     if (!this.trackingNumber) {
//       this.trackingNumber = generateTrackingNumber();
//     }

//     next();
//   } catch (error) {
//     next(error)
//   }
// })

// // Helper function to generate a random tracking number
// const generateTrackingNumber = () => {
//   const trackingNumber = Math.random().toString(36).substring(2, 9).toUpperCase();
//   return trackingNumber;
// }

// // Method to extract tracking number without the object properties
// shipmentSchema.methods.extractTrackingNumber = function () {
//   return this.trackingNumber;
// }

// const Shipment = mongoose.model('Shipment', shipmentSchema)

// export default Shipment;

import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema({

  trackingNumber: {
    type: String,
    unique: true,
    // required: true
  },
  item: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['package', 'envelope'],
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  senderMail: {
    type: String,
    required: true
  },
  senderPhone: {
    type: String,
    required: true
  },
  recipientName: {
    type: String,
    required: true
  },
  recipientEmail: {
    type: String,
    required: true
  },
  recipientPhone: {
    type: String,
    required: true
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
  estimatedDelivery: {
    type: Date
  },
  currentLocation: {
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true }
  }
}, { timestamps: true });

// Middleware to generate the courier ID before saving
shipmentSchema.pre('save', function (next) {
  const shipment = this;
  
  if (!shipment.trackingNumber){
  // Generate a unique ID using any desired method (e.g., UUID)
  shipment.trackingNumber = generateUniquetrackingNumber();
  }
  next();
});

// Function to generate a unique courier ID (example using UUID)
function generateUniquetrackingNumber() {
  return 'COURIER_' + Math.random().toString(36).substring(2, 9);
}

const Shipment = mongoose.model('Shipment', shipmentSchema);

export default Shipment;