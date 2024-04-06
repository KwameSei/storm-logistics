import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import classes from './payment.module.scss';

const PaymentCallback = () => {
  const { shipmentId } = useParams();
  const [loading, setLoading] = useState(true);
  const URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    handlePaymentCallback(shipmentId);
  }, [shipmentId]);

  const handlePaymentCallback = async (shipmentId) => {
    try {
      // Get the payment reference from the query parameters
      const paymentReference = new URLSearchParams(window.location.search).get('reference');
      console.log('Payment reference:', paymentReference);

       // Check if the payment reference is missing
      if (!paymentReference) {
        console.error('Payment reference is undefined or null');
        toast.error('Payment reference is missing');
        return;
      }

      // Make a request to the server to handle the payment callback
      const response = await axios.get(`${URL}/api/payments/payment-callback?reference=${paymentReference}`);

      console.log('Response from payment callback:', response.data);

      if (!response) {
        console.error('Invalid response from server');
        toast.error('Invalid response from server');
        return;
      }

      const paymentData = response.data;

      if (paymentData.success) {
        toast.success('Payment successful');
      } else {
        toast.error('Payment failed');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={classes.loading}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className={classes.checkout}>
      {/* Render any UI elements you want here */}
    </div>
  );
};

export default PaymentCallback;
