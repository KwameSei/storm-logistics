import { useState } from 'react';
import axios from 'axios';

const URL = import.meta.env.VITE_SERVER_URL;

const CurrentLocationService = () => {
  const [shipment, setShipment] = useState(null);
  const [error, setError] = useState('');

  // Function to update the shipment's current location
  const updateShipmentLocation = async (trackingNumber, newLocation) => {
    try {
      const response = await axios.put(`${URL}/api/shipment/update-current-location/${trackingNumber}`, { newLocation });
      const shipmentData = response.data.data;
      
      setShipment(shipmentData);
      setError('');
      return shipmentData;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update shipment location');
      setShipment(null);
      throw error; // Re-throw the error for the caller to handle if needed
    }
  };

  return {
    updateShipmentLocation,
    shipment,
    error
  };
};

export default CurrentLocationService;
