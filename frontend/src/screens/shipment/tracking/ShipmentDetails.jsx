const ShipmentDetails = ({ shipment }) => {
  // Log the shipment data to console to verify its structure
  console.log('Shipment Data:', shipment);

  // Check if shipment is null or undefined
  if (!shipment) {
    return <div>No shipment data available</div>;
  }

  // Destructure shipment object
  const { trackingNumber, status, estimatedDelivery, currentLocation, origin, destination } = shipment;

  // Check if currentLocation is null or undefined
  const locationString = currentLocation ? `${currentLocation.country}, ${currentLocation.state}, ${currentLocation.city}` : 'N/A';

  return (
    <div className="shipment-details">
      <h2>Shipment Details</h2>
      <p><strong>Tracking Number:</strong> {trackingNumber}</p>
      <p><strong>Origin:</strong> {origin.country}, {origin.state}, {origin.city}</p>
      <p><strong>Destination:</strong> {destination.country}, {destination.state}, {destination.city}</p>
      <p><strong>Status:</strong> {status}</p>
      <p><strong>Estimated Delivery:</strong> {new Date(estimatedDelivery).toLocaleDateString()}</p>
      <p><strong>Current Location:</strong> {locationString}</p>
    </div>
  );
}

export default ShipmentDetails;
