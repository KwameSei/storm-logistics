import { useState } from 'react';
import { TextField, Button, CircularProgress, Snackbar, Box, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';
import CurrentLocationService from '../../services/CurrentLocationService';
import { CountryDropdown } from '../../../components';

import classes from './Tracking.module.scss';

const UpdateShipmentLocation = () => {
  // State variables
  const [trackingNumber, setTrackingNumber] = useState('');
  const [newLocation, setNewLocation] = useState({ country: '', state: '', city: '' });
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Shipment service instance
  const { updateShipmentLocation } = CurrentLocationService();

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call the updateShipmentLocation function from the shipment service
      await updateShipmentLocation(trackingNumber, newLocation);
      setLoading(false);
      setSnackbarMessage('Shipment location updated successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Failed to update shipment location:', error);
      setLoading(false);
      setSnackbarMessage('Failed to update shipment location');
      setSnackbarOpen(true);
    }
  };

  // Function to handle Snackbar close
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleCurrentLocationChange = (selectedCurrentLocation) => {
    setNewLocation(selectedCurrentLocation);
  }

  return (
    <div className={classes.update_location}>
      <h2>Update Shipment Location</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Tracking Number"
          variant="outlined"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          required
        />
        {/* <TextField
          label="New Location"
          variant="outlined"
          value={newLocation}
          onChange={(e) => setNewLocation(e.target.value)}
          required
        /> */}
        <Box marginBottom={2}>
          <Typography variant="subtitle1" gutterBottom>New Location</Typography>
          <CountryDropdown label="New Location" onChange={handleCurrentLocationChange} />
        </Box>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={loading}
          startIcon={<Search />}
        >
          Update Location
        </Button>
        {loading && <CircularProgress />}
      </form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      />
    </div>
  );
};

export default UpdateShipmentLocation;
