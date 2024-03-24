const ShipmentDetails = ({ shipment }) => {
  const { trackingNumber, status, estimatedDelivery, location, origin, destination } = shipment;

  return (
    <div className="shipment-details">
      <h2>Shipment Details</h2>
      <p><strong>Tracking Number:</strong> {trackingNumber}</p>
      <p><strong>Origin:</strong> {origin}</p>
      <p><strong>Destination:</strong> {destination}</p>
      <p><strong>Status:</strong> {status}</p>
      <p><strong>Estimated Delivery:</strong> {estimatedDelivery}</p>
      <p><strong>Location:</strong> {location}</p>
    </div>
  );
}

export default ShipmentDetails;