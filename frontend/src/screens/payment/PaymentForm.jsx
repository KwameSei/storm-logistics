import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BlueButton } from '../../components/ButtonStyled';
import { toast } from 'react-toastify';

const PaymentForm = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [shipment, setShipment] = useState(null);

    const currentUser = useSelector(state => state.user);
    const URL = import.meta.env.VITE_SERVER_URL;

    useEffect(() => {
      if (id) { // Check if id is not undefined
          fetchShipment();
      }
    }, [id]); 

    const fetchShipment = async () => {
        try {
            const response = await axios.get(`${URL}/api/shipment/get-shipment-byId/${id}`);
            setShipment(response.data.data); // Set the fetched shipment data to the state
        } catch (error) {
          console.error('Error fetching shipment:', error.message);
          toast.error(error.response?.data?.message || 'Failed to fetch shipment');
        }
    }

    const handlePayment = async ( totalCost, senderMail, shipment) => {

      if (!shipment) {
        console.error('Shipment data not available');
        throw new Error('Shipment data not available');
      }
      
      setLoading(true);
        
      try {
        if (!shipment) {
          throw new Error('Shipment data not available');
        }

        // Initiate payment with shipment data
        const response = await axios.post(`${URL}/api/payments/initiate-payment`, {
            userId: currentUser?.id,
            totalCost,
            email: senderMail,
            shipmentId: shipment.id, // Include shipment data in the request payload
        });

        // Redirect user to Paystack payment page
        if (response.data.data && response.data.data.authorization_url) {
          window.location.href = response.data.data.authorization_url;
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (error) {
        console.error('Error initiating payment:', error);
        onPaymentFailure(error.message || 'Failed to initiate payment');
      } finally {
        setLoading(false);
      }
    }

    // Disable the payment button if shipment data is not available
    const isPaymentDisabled = loading || !shipment;

    return (
      <div>
        <BlueButton onClick={handlePayment} disabled={isPaymentDisabled}>
            {loading ? 'Processing Payment...' : 'Proceed to Pay'}
        </BlueButton>
      </div>
    );
};

export default PaymentForm;
