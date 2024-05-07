import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: String,
  transactionId: String,
  transactionDate: Date,
  transactionType: String,
  transactionAmount: String,
  shipments: {
    type: [mongoose.Types.ObjectId],
    of: Number
  }
}, {
  timestamps: true
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;