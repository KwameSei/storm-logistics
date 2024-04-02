import classes from "./shipmentSuccess.module.scss";

const ShipmentSuccess = () => {
  return (
    <div className={classes.success}>
      <div className={classes.success_container}>
        <h1>Shipment Successfully Created</h1>
        <p>Your shipment has been successfully created. An admin needs to approve the shipment before you can proceed to make payment.</p>
      </div>
    </div>
  )
}

export default ShipmentSuccess;