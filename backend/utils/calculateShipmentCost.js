export const calculateShipmentCost = (shipment) => {
  let baseRate = 0;
  let distanceCharge = 0;
  let weightCharge = 0;
  let carrierCharge = 0;
  let deliveryModeCharge = 0;

  // Determine carrier charge based on the carrier
  switch (shipment.carrier) {
    case 'DHL':
      carrierCharge = 100;
      break;
    case 'FedEx':
      carrierCharge = 120;
      break;
    case 'UPS':
      carrierCharge = 130;
      break;
    case 'USPS':
      carrierCharge = 140;
      break;
    default:
      carrierCharge = 0;
  }

  // Determine delivery mode charge based on the delivery mode
  switch (shipment.delivery_mode) {
    case 'Air':
      deliveryModeCharge = 200;
      break;
    case 'Sea':
      deliveryModeCharge = 150;
      break;
    case 'Land':
      deliveryModeCharge = 100;
      break;
    case 'Pick and Deliver':
      deliveryModeCharge = 50;
      break;
    case 'Safe Keeping':
      deliveryModeCharge = 30;
      break;
    default:
      deliveryModeCharge = 0;
  }

  // Determine base rate based on the shipment type
  switch (shipment.type) {
    case 'Document':
      baseRate = 10;
      break;
    case 'Parcel':
      baseRate = 20;
      break;
    case 'Pallet':
      baseRate = 30;
      break;
    case 'Container':
      baseRate = 1000;
      break;
    case 'Parcel':
      baseRate = 50;
      break;
    case 'Envelope':
      baseRate = 5;
      break;
    case 'Hand Carry':
      baseRate = 100;
      break;
    case 'Express':
      baseRate = 200;
      break;
    case 'Overnight':
      baseRate = 300;
      break;
    case 'Same Day':
      baseRate = 400;
      break;
    case 'Priority Mail':
      baseRate = 50;
      break;
    case 'Local Delivery':
      baseRate = 20;
      break;
    case 'Storage':
      baseRate = 10;
      break;
    default:
      baseRate = 0;
  }

  // Calculate distance charge
  const distanceRate = 0.5; // 0.5 per km
  distanceCharge = shipment.distance * distanceRate;

  // Calculate weight charge
  const weightRate = 0.1; // 0.1 per kg
  weightCharge = shipment.weight * weightRate;

  // Calculate the total shipment cost
  const shippingCost = baseRate + distanceCharge + weightCharge + carrierCharge + deliveryModeCharge;

  return {
    success: true,
    status: 200,
    message: 'Shipment cost calculated successfully',
    data: {
      baseRate,
      distanceCharge,
      weightCharge,
      carrierCharge,
      deliveryModeCharge,
      shippingCost
    }
  };
};