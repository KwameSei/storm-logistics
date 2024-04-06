import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  amount: {type: Number},
  transactionId: {type: String},
  reference: {
    type: String,
    required: [true, 'Reference is required'],
    unique: true
  },
  status: {type: String, default: 'Pending'},
  paymentDate: { type: Date },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  shipment: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Shipment' 
  }
}, {timestamps: true});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;