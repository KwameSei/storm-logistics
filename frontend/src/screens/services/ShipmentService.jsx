// import React, { useState } from 'react';
// import axios from 'axios';

// const ShipmentService = () => {
//   const [trackingNumber, setTrackingNumber] = useState('');
//   const [shipment, setShipment] = useState(null);
//   const [error, setError] = useState('');

//   const URL = import.meta.env.VITE_SERVER_URL;

//   const getShipmentByTrackingNumber = async (trackingNumber) => {
//     const response = await axios.get(`${URL}/api/shipment/track/${trackingNumber}`);
//     console.log('Tracking info: ', response);

//     const shipment = await response.data.shipment;
//     setShipment(shipment);
//     setError('');
//     // return shipment;
//   }

//   return {
//     getShipmentByTrackingNumber
//   };
// }

// export default ShipmentService;

import axios from 'axios';
import { useState } from 'react';

const ShipmentService = () => {
  const [shipment, setShipment] = useState(null);
  const [error, setError] = useState('');

  const URL = import.meta.env.VITE_SERVER_URL;

  const getShipmentByTrackingNumber = async (trackingNumber) => {
    try {
      const response = await axios.get(`${URL}/api/shipment/track/${trackingNumber}`);
      const shipmentData = response.data.data;
      
      setShipment(shipmentData);
      setError('');
      return shipmentData;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to retrieve shipment');
      setShipment(null);
      throw error; // Re-throw the error for the caller to handle if needed
    }
  };

  return {
    getShipmentByTrackingNumber,
    shipment,
    error
  };
};

export default ShipmentService;


// const ShipmentService = {
  // getShipmentByTrackingNumber: async (trackingNumber) => {
    // Simulate a delay to mimic API call
    // await new Promise(resolve => setTimeout(resolve, 1000));

    // Dummy data for testing
    // const dummyData = {
      // trackingNumber: trackingNumber,
      // status: 'In Transit',
      // estimatedDeliveryDate: '2024-04-01',
      // origin: 'New York, USA',
      // destination: 'Accra, Ghana',
      // currentLocation: 'Tema, Ghana',
    // };

    // return dummyData;
  // }
// };

// export default ShipmentService;
