import paystack from "paystack";
import Payment from "../models/paymentSchema.js";
import Shipment from "../models/shipmentSchema.js";
import User from "../models/userSchema.js";

// Initialiaze Paystack SDK with API key
const paystackClient = paystack(process.env.PAYSTACK_SECRET_KEY);

// Create a new payment || Process payment
export const processPayment = async (req, res) => {
  try {
    const { amount, transactionId, status, paymentDate, user, shipment } = req.body;

    // Create a new payment
    const newPayment = new Payment({
      amount,
      transactionId,
      status,
      paymentDate,
      user,
      shipment
    });

    // Save the payment to the database
    await newPayment.save();

    // Update the shipment document with the new payment reference
    await Shipment.findByIdAndUpdate(shipment, {
      $push: { payments: newPayment._id }
    });

    // Update the user document with the new payment reference
    await User.findByIdAndUpdate(user, {
      $push: { payments: newPayment._id }
    });

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Payment processed successfully",
      data: newPayment
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    });
  }
};

// Verify payment
export const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.body;

    // Verify the payment with Paystack
    const response = await paystackClient.transaction.verify(reference);

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Payment verified successfully",
      data: response.data
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    });
  }
};

// Function to initiate payment with Paystack
export const initiatePayment = async (totalCost, email, reference) => {
  try {
    // const { amount, email, reference } = req.body;

    // Convert totalCost from GHS to kobo
    const totalCostInKobo = totalCost * 100;

    // Initialize payment with Paystack
    const response = await paystackClient.transaction.initialize({
      amount: totalCostInKobo,
      email,
      reference,
      callback_url: "http://localhost:3000/api/v1/payments/verify",
      metadata: {
        custom_fields: [
          {
            display_name: "Shipment ID",
            variable_name: "shipment_id",
            value: "SHPT_001"
          }
        ]
      },
      channels: ["card", "bank", "ussd", "qr", "mobile_money", "bank_transfer"],
      currency: "GHS",
      plan: "PLN_7h3k2w2m0f0k2m0",
      subaccount: "ACCT_7h3k2w2m0f0k2m0",
      transaction_charge: 0,
      split: [
        {
          id: "ACCT_7h3k2w2m0f0k2m0",
          transaction_charge: 0,
          percentage: 50
        }
      ],
      invoice_limit: 10,
    });

    // Return the response data
    return response.data;
  } catch (error) {
    console.error("Error initializing payment:", error);
    // Throw the error to be handled in the calling function
    throw error;
  }
};

// Function to get all payments
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find();

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Payments retrieved successfully",
      data: payments
    });
  } catch (error) {
    console.error("Error getting payments:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    });
  }
};

// Function to get a single payment
export const getPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id);

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Payment retrieved successfully",
      data: payment
    });
  } catch (error) {
    console.error("Error getting payment:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    });
  }
}

// Function to update a payment
export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, transactionId, status, paymentDate, user, shipment } = req.body;

    const updatedPayment = await Payment.findByIdAndUpdate(id, {
      amount,
      transactionId,
      status,
      paymentDate,
      user,
      shipment
    });

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Payment updated successfully",
      data: updatedPayment
    });
  } catch (error) {
    console.error("Error updating payment:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    });
  }
};

// Function to delete a payment
export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    await Payment.findByIdAnd(deleteOne(id));

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Payment deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting payment:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    });
  }
}