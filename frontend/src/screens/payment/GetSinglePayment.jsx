import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { setPayment, setPaymentError } from "../../state-management/payment/paymentSlice";
import classes from "./payment.module.scss";

const GetSinglePayment = () => {
  const dispatch = useDispatch();
  const { paymentId } = useParams();
  const payment = useSelector(state => state.payment.payment);
  const paymentError = useSelector(state => state.payment.paymentError);
  const token = useSelector(state => state.user.token);
  const URL = import.meta.env.VITE_SERVER_URL;

  const fetchSinglePayment = async () => {
    try {
      const response = await axios.get(`${URL}/api/payments/get-payment/${paymentId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.data) {
        toast.success(response.data.message);
        dispatch(setPayment(response.data.data));
      } else {
        toast.error("No payment found");
      }
    } catch (error) {
      dispatch(setPaymentError(error.message));
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (paymentId) {
      fetchSinglePayment();
    }
  }, [paymentId]);

  if (!payment) {
    return <div>Loading...</div>; // Render loading indicator until payment data is fetched
  }

  return (
    <div className={classes.payment}>
      <h1>Payment Details</h1>
      {paymentError && <div className={classes.error}>{paymentError}</div>}
      <div className={classes.payment_details}>
        <div className={classes.payment_item}>
          <h3>Payment ID:</h3>
          <span>{payment._id}</span>
        </div>
        <div className={classes.payment_item}>
          <h3>Payment Reference: </h3>
          <span>{payment.reference}</span>
        </div>
        <div className={classes.payment_item}>
          <h3>Transaction ID: </h3>
          <span>{payment.transactionId}</span>
        </div>
        <div className={classes.payment_item}>
          <h3>Amount:</h3>
          <span>{payment.amount}</span>
        </div>
        <div className={classes.payment_item}>
          <h3>Payment Method:</h3>
          <span>{payment.paymentMethod}</span>
        </div>
        <div className={classes.payment_item}>
          <h3>Payment Date:</h3>
          <span>{new Date(payment.paymentDate).toDateString()}</span>
        </div>
        <div className={classes.payment_item}>
          <h3>Payment Status:</h3>
          <span>{payment.status}</span>
        </div>
      </div>
    </div>
  );
};

export default GetSinglePayment;