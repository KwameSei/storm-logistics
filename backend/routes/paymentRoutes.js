import express from "express";
import {
  createPaymentLink,
  deletePayment,
  // processPayment,
  // verifyPayment,
  // initiatePayment,
  getPayment,
  getPayments,
  handlePaymentCallback,
  updatePayment
} from "../controllers/paymentController.js";

const router = express.Router();

// router.post("/initiate-payment", initiatePayment);
// router.post("/process-payment", processPayment);
router.get("/initiate-payment", createPaymentLink);
// router.get("/verify-payment", verifyPayment);
router.get("/get-all-payments", getPayments);
router.get("/get-payment/:id", getPayment);
router.get("/payment-callback", handlePaymentCallback);
router.put("/update-payment/:id", updatePayment);

export default router;