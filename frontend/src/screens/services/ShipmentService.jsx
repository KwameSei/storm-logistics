
// const ShipmentService = () => {
//   const getShipmentByTrackingNumber = async (trackingNumber) => {
//     const response = await fetch(`/api/shipments/${trackingNumber}`);
//     const shipment = await response.json();
//     return shipment;
//   }

//   return {
//     getShipmentByTrackingNumber
//   };
// }

// export default ShipmentService;

const ShipmentService = {
  getShipmentByTrackingNumber: async (trackingNumber) => {
    // Simulate a delay to mimic API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Dummy data for testing
    const dummyData = {
      trackingNumber: trackingNumber,
      status: 'In Transit',
      estimatedDeliveryDate: '2024-04-01',
      origin: 'New York, USA',
      destination: 'Accra, Ghana',
      currentLocation: 'Tema, Ghana',
    };

    return dummyData;
  }
};

export default ShipmentService;
