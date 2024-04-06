import paystack from "paystack";
import axios from "axios";
import https from "https";
import Payment from "../models/paymentSchema.js";
import Shipment from "../models/shipmentSchema.js";
import User from "../models/userSchema.js";
import sendPaymentSuccessEmail from "../utils/sendPaymentSuccessEmail.js";

// Initialiaze Paystack SDK with API key
const paystackClient = paystack(process.env.PAYSTACK_SECRET_KEY);

const generateReference = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000); // Generate random number between 0 and 9999
  const reference = `REF_${timestamp}_${random}`;
  return reference;
}

// Create a new payment || Process payment
// export const processPayment = async (req, res) => {
//   try {
//     const { amount, transactionId, status, paymentDate, userId, shipmentId } = req.body;

//     // Create a new payment
//     const newPayment = new Payment({
//       amount,
//       transactionId,
//       status,
//       paymentDate,
//       user: userId,
//       shipment: shipmentId
//     });

//     // Save the payment to the database
//     await newPayment.save();

//     // Update the shipment document with the new payment reference
//     await Shipment.findByIdAndUpdate(shipmentId, {
//       $push: { payments: newPayment._id }
//     });

//     // Update the user document with the new payment reference
//     await User.findByIdAndUpdate(userId, {
//       $push: { payments: newPayment._id }
//     });

//     return res.status(200).json({
//       success: true,
//       status: 200,
//       message: "Payment processed successfully",
//       data: newPayment
//     });
//   } catch (error) {
//     console.error("Error processing payment:", error);
//     return res.status(500).json({
//       success: false,
//       status: 500,
//       message: error.message
//     });
//   }
// };

// // Verify payment
// export const verifyPayment = async (req, res) => {
//   try {
//     const { reference } = req.body;

//     // Verify the payment with Paystack
//     const response = await paystackClient.transaction.verify(reference);

//     return res.status(200).json({
//       success: true,
//       status: 200,
//       message: "Payment verified successfully",
//       data: response.data
//     });
//   } catch (error) {
//     console.error("Error verifying payment:", error);
//     return res.status(500).json({
//       success: false,
//       status: 500,
//       message: error.message
//     });
//   }
// };

// Function to initiate payment with Paystack
// export const initiatePayment = async (req, res) => {
//   try {
//     const { totalCost, email } = req.body;

//     // Generate a unique reference
//     const reference = generateReference();

//     // Initialize payment with Paystack
//     const response = await paystackClient.transaction.initialize({
//       amount: totalCost * 100,  // Convert totalCost from GHS to kobo
//       email,
//       reference,
//       callback_url: "http://localhost:3000/api/v1/payments/verify",
//       metadata: {
//         custom_fields: [
//           {
//             display_name: "Shipment ID",
//             variable_name: "shipment_id",
//             value: "SHPT_001"
//           }
//         ]
//       },
//       channels: ["card", "bank", "ussd", "qr", "mobile_money", "bank_transfer"],
//       currency: "GHS",
//       plan: "PLN_7h3k2w2m0f0k2m0",
//       subaccount: "ACCT_7h3k2w2m0f0k2m0",
//       transaction_charge: 0,
//       split: [
//         {
//           id: "ACCT_7h3k2w2m0f0k2m0",
//           transaction_charge: 0,
//           percentage: 50
//         }
//       ],
//       invoice_limit: 10,
//     });

//     console.log("Paystack Response:", response);

//     // Return the response data
//     return res.status(200).json({
//       success: true,
//       status: 200,
//       message: "Payment initialized successfully",
//       data: { reference, authorization_url: response.data.authorization_url}
//     });
//   } catch (error) {
//     console.error("Error initializing payment:", error);
//     return res.status(500).json({
//       success: false,
//       status: 500,
//       message: error.message
//     });
//   }
// };

// Function to initialize payment with Paystack
const initiatePayment = async (shipmentId) => {
  try {

    console.log("Shipment ID:", shipmentId);

    const shipment = await Shipment.findById(shipmentId);
    console.log("Shipment:", shipment);

    if (!shipment) {
      throw new Error("Shipment not found");
    }

    const SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

    // Generate a unique reference for the payment transaction
    const reference = generateUniqueReference();

    const params = JSON.stringify({
      amount: shipment.totalCost * 100,  // Convert totalCost from GHS to kobo
      email: shipment.senderMail,
      reference: reference, // Provide the generated reference for the payment
      callback_url: `${process.env.CLIENT_URL}/payment-callback`,
    });

    const options = {
      hostname: "api.paystack.co",
      port: 443,
      path: "/transaction/initialize",
      method: "POST",
      headers: {
        Authorization: `Bearer ${SECRET_KEY}`,
        "Content-Type": "application/json"
      }
    };

    return new Promise((resolve, reject) => {
      const request = https.request(options, response => {
        let data = "";

        response.on("data", chunk => {
          data += chunk;
        });

        response.on("end", () => {
          try {
            const parsedData = JSON.parse(data);
            if (!parsedData.data || !parsedData.data.authorization_url) {
              console.error("Invalid response from Paystack API:", parsedData);
              reject("Invalid response from Paystack API");
            }
            
            // Resolve with the parsed data if the response is successful
            resolve({ authorizationUrl: parsedData.data.authorization_url, reference: reference });
          } catch (error) {
            console.error("Error parsing Paystack API response:", error);
            reject("Error parsing Paystack API response");
          }
        });
      });

      request.on("error", error => {
        console.error("Error initiating payment:", error);
        reject("Request failed: " + error.message);
      });

      request.setTimeout(10000);

      request.on("timeout", () => {
        console.error("Request timed out");
        request.abort();
        reject("Request timed out");
      });

      request.write(params);
      request.end();
    });
  } catch (error) {
    console.error("Error initiating payment:", error);
    throw new Error("Error initiating payment: " + error.message);
  }
}

// Function to generate a unique reference for the payment transaction
function generateUniqueReference() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000); // Generate random number between 0 and 9999
  const reference = `STORM-PAYMENT_${timestamp}_${random}`;
  return reference;
  // You can implement any method to generate a unique reference, such as UUID
  // return 'STORM-PAYMENT_' + Math.random().toString(36).substring(2, 9);
}

// Callback function to handle payment response
export const handlePaymentCallback = async (req, res) => {
  try {
    const { reference } = req.query;
    console.log("Payment reference:", reference);

    if (!reference) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Payment reference is missing"
      });
    }

    // Verify payment with retry logic
    const response = await verifyPaymentWithRetry(reference);
    console.log("Payment verification response:", response);

    // Check if response contains data and status is success
    if (response && response.status && response.status === "success") {
      const paymentData = response;

    //Find the user by email
    const user = await User.findOne({ email: paymentData.customer.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "User not found"
      });
}
      // Create a new payment document
      const newPayment = new Payment({
        amount: paymentData.amount / 100, // Convert amount from kobo to GHS
        transactionId: paymentData.id,
        reference: paymentData.reference,
        status: paymentData.status,
        paymentDate: paymentData.paid_at,
        user: user._id,
        shipment: paymentData.metadata.shipmentId
      });

      // Save the payment to the database
      const savedPayment = await newPayment.save();

      // Update the shipment document with the new payment reference
      const updatedShipment = await Shipment.findByIdAndUpdate(paymentData.metadata.shipmentId, {
        $push: { payments: savedPayment._id } // Push payment _id to payments array
      }, { new: true });

      console.log("Updated shipment data:", updatedShipment);

      // Send a payment success email to the user
      const senderMail = paymentData.customer.email;
      sendPaymentSuccessEmail(savedPayment, response);

      return res.status(200).json({
        success: true,
        status: 200,
        message: "Payment processed successfully",
        data: savedPayment
      });
    } else {
      console.error("Payment verification failed:", response); // Log the failure response
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Payment verification failed"
      });
    }
  } catch (error) {
    // If a duplicate key error occurs, handle it gracefully
    if (error.code === 11000 && error.keyPattern && error.keyPattern.reference === 1) {
      console.error("Duplicate payment reference:", error.keyValue.reference);
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Payment reference already exists"
      });
    }
    // If another error occurs, log it and return an internal server error response
    console.error("Error processing payment:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Error processing payment"
    });
  }
};

// const verifyPaymentWithRetry = async (reference, retryCount = 5, delay = 1000) => {
//   try {
//     let retry = 0;
//     let paymentVerified = false;
//     let response;

//     while (retry < retryCount && !paymentVerified) {
//       // Make a direct HTTP request to the Paystack API
//       response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
//         headers: {
//           Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
//         }
//       });

//       if (response.data.data.status === "success") {
//         paymentVerified = true;
//       } else {
//         retry++;
//         await new Promise(resolve => setTimeout(resolve, delay)); // Wait for a delay before retrying
//       }
//     }

//     return response;
//   } catch (error) {
//     throw new Error("Error verifying payment: " + error.message);
//   }
// };

async function verifyTransaction(reference) {
  try {
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      // Handle 400 error status (Bad Request)
      console.error('Error verifying transaction:', error.response.data);
      throw new Error(`Error verifying transaction: ${error.response.data.message}`);
    } else {
      // Handle other errors
      console.error('Error verifying transaction:', error);
      throw new Error(`Error verifying transaction: ${error.message}`);
    }
  }
}

async function verifyPaymentWithRetry(reference, retryCount = 5) {
  try {
    console.log(`Verifying payment for reference ${reference}...`);
    const response = await verifyTransaction(reference);
    console.log(`Payment verification response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error verifying payment for reference ${reference}: ${error.message}`);
    if (retryCount > 0) {
      console.log(`Retrying verification for reference ${reference}...`);
      // You can add retry logic here, such as retrying after a delay or with different parameters
      return await verifyPaymentWithRetry(reference, retryCount - 1);
    } else {
      throw new Error(`Failed to verify payment for reference ${reference} after multiple attempts`);
    }
  }
}

// Create a payment link
export const createPaymentLink = async (req, res) => {
  try {
    const shipmentId = req.query.shipmentId;

    // Fetch the shipment details
    const shipment = await Shipment.findById(shipmentId);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Shipment not found"
      });
    }

    // Fetch the user details
    // const user = await User.findById(shipment.sender);

    // if (!user) {
    //   return res.status(404).json({
    //     success: false,
    //     status: 404,
    //     message: "User not found"
    //   });
    // }

    // Generate payment link using Paystack
    const paymentLink = await initiatePayment(shipmentId);

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Payment url successfully created",
      data: paymentLink
    })
  } catch (error) {
    console.error('Error generating payment link:', error);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Failed to generate payment link'
    });
  }
}

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