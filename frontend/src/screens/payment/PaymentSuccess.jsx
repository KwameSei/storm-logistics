import React from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { BlueButton } from "../../components/ButtonStyled";
import classes from "./payment.module.scss";

const PaymentSuccess = () => {
  const { shipmentId } = useParams();
  const currentUser = useSelector((state) => state.user.currentUser);
  const currentRole = currentUser.data.role;

  return (
    <div className={classes.payment_success}>
      <div className={classes.success_inner}>
        <h1>Payment Successful</h1>
        <p>Your payment for shipment {shipmentId} has been successfully processed.</p>
        <p>Thank you for using our services.</p>
        <Link to="/">
          <BlueButton>Go Home</BlueButton>
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;