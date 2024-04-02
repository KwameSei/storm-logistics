import { useState } from 'react';
import { TextField, Button, CircularProgress } from '@mui/material';
import { Search } from '@mui/icons-material';
import { BlueButton } from '../../../components/ButtonStyled';
import ShipmentService from '../../services/ShipmentService';
import ShipmentDetails from './ShipmentDetails';

import classes from './Tracking.module.scss';

const TrackShipment = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const shipmentService = ShipmentService();

  const handleSearch = async () => {
    setLoading(true);
    try {
      const shipmentData = await shipmentService.getShipmentByTrackingNumber(trackingNumber); // Call the function on the instance
      setShipment(shipmentData);
      setLoading(false);

      console.log('Shipment data: ', shipmentData);
    } catch (error) {
      console.error('Failed to retrieve shipment:', error);
      setLoading(false);
    }
  }

  return (
    <div className={classes.tracking}>
      <div className={classes.tracking_container}>
        <h1>Track Shipment</h1>
        <div className={classes.search}>
          <TextField
            label="Tracking Number"
            variant="outlined"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className={classes.tracking_number}
          />
          <BlueButton
            variant="contained"
            color="primary"
            startIcon={<Search />}
            onClick={handleSearch}
          >
            Search
          </BlueButton>
        </div>
        {loading && <CircularProgress />}
        {shipment && <ShipmentDetails shipment={shipment} />}
      </div>
    </div>
  );
}

export default TrackShipment;