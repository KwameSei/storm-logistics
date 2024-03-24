import { useState } from 'react';
import { TextField, Button, CircularProgress } from '@mui/material';
import { Search } from '@mui/icons-material';
import { ShipmentService } from '../../index';
import ShipmentDetails from './ShipmentDetails';

import classes from './Tracking.module.scss';

const TrackShipment = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const shipment = await ShipmentService.getShipmentByTrackingNumber(trackingNumber);
    setShipment(shipment);
    setLoading(false);
  }

  return (
    <div className={classes.tracking}>
      <h1>Track Shipment</h1>
      <TextField
        label="Tracking Number"
        variant="outlined"
        value={trackingNumber}
        onChange={(e) => setTrackingNumber(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        startIcon={<Search />}
        onClick={handleSearch}
      >
        Search
      </Button>
      {loading && <CircularProgress />}
      {shipment && <ShipmentDetails shipment={shipment} />}
    </div>
  );
}

export default TrackShipment;