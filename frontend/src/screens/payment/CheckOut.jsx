import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import PaymentForm from './PaymentForm';
import { BlueButton } from '../../components/ButtonStyled';
import { CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import classes from './payment.module.scss';

const CheckOut = () => {
  const { shipmentId } = useParams();
  const [paymentUrl, setPaymentUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    initiatePayment(shipmentId);
  }, [shipmentId]);

  const initiatePayment = async (shipmentId) => {
    console.log('Checkout shipmentId', shipmentId);
    
    try {
      setLoading(true);
      const response = await axios.get(`${URL}/api/payments/initiate-payment/?shipmentId=${shipmentId}`);

      console.log('Response from initiate payment:', response.data);

      const paymentData = response.data.data;
      setPaymentUrl(paymentData.authorizationUrl);
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error(error.response?.data?.message || 'Failed to initiate payment');
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
      {/* <PaymentForm /> */}
      <div className={classes.payment}>
        {paymentUrl ? (
          <BlueButton onClick={() => window.location.href = paymentUrl} > Proceed to Payment </BlueButton>
        ) : (
          <p>Failed to initiate payment</p>
        )}
      </div>
    </div>
  );
}
export default CheckOut;