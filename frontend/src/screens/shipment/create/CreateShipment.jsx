import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Box, CircularProgress, Container, Grid, Typography, TextField, DialogActions, MenuItem, InputLabel, Select, FormControl } from '@mui/material';
import { BlueButton } from '../../../components/ButtonStyled';
import { CountryDropdown } from '../../../components';

import classes from './CreateShipment.module.scss';

const CreateShipment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const [senderMail, setSenderMail] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [senderName, setSenderName] = useState('');
  const [item, setItem] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [weight, setWeight] = useState('');
  const [type, setType] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [origin, setOrigin] = useState({ country: '', state: '', city: '' });
  const [destination, setDestination] = useState({ country: '', state: '', city: '' });
  const [currentLocation, setCurrentLocation] = useState({ country: '', state: '', city: '' });
  const [estimatedDelivery, setEstimatedDelivery] = useState('');

  const URL = import.meta.env.VITE_SERVER_URL;
  const API_KEY = import.meta.env.VITE_COUNTRY_CITY_API_KEY;
  const currentUser = useSelector((state) => state.user.currentUser);
  const token = useSelector((state) => state.user.token);
  const shipment = useSelector((state) => state.shipment.shipment);

  const fields = {
    senderMail,
    senderName,
    senderPhone,
    item,
    type,
    weight,
    recipientName,
    recipientPhone,
    recipientEmail,
    departureDate,
    origin,
    destination,
    currentLocation,
    estimatedDelivery,
  };

  const createShipment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${URL}/api/shipment/create-shipment`, fields, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Response', response);

      const shipmentData = response.data;
      console.log('Shipment Data', shipmentData)

      dispatch(getShipmentSuccess(shipmentData));
      toast.success('Shipment successfully created')
      navigate('/track-shipment');
      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create shipment');
      setLoading(false);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form fields
    if (!senderMail || !item || !recipientName || !recipientPhone || !departureDate || !origin.country || !origin.state || !origin.city || !destination.country || !destination.state || !destination.city || !currentLocation || !estimatedDelivery) {
      return toast.error('All fields are required');
    }

    createShipment(e);
  };

  const handleOriginChange = (selectedOrigin) => {
    setOrigin(selectedOrigin);
  };

  const handleDestinationChange = (selectedDestination) => {
    setDestination(selectedDestination);
  };

  const handleCurrentLocationChange = (selectedCurrentLocation) => {
    setCurrentLocation(selectedCurrentLocation);
  }

  const selectTypeHandler = (e) => {
    setType(e.target.value);
  }

  return (
    <Container className={classes.shipment_container}>
      <Grid container className={classes.grid_container}>
        <Grid item xs={12} className={classes.shipment_form}>
          <Typography variant='h4' className={classes.shipmentFormTitle}>Create Shipment</Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              required
              id='senderName'
              label='Sender Name'
              variant='outlined'
              fullWidth
              margin='normal'
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
            />
            <TextField
              required
              id='senderMail'
              label='Sender Email'
              variant='outlined'
              fullWidth
              margin='normal'
              value={senderMail}
              onChange={(e) => setSenderMail(e.target.value)}
            />
            <TextField
              required
              id='senderPhone'
              label='Sender Phone'
              variant='outlined'
              fullWidth
              margin='normal'
              value={senderPhone}
              onChange={(e) => setSenderPhone(e.target.value)}
            />
            <TextField
              required
              id='recipientName'
              label='Recipient Name'
              variant='outlined'
              fullWidth
              margin='normal'
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
            />
            <TextField
              required
              id='recipientEmail'
              label='Recipient Email'
              variant='outlined'
              fullWidth
              margin='normal'
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
            />
            <TextField
              required
              id='recipientPhone'
              label='Recipient Phone'
              variant='outlined'
              fullWidth
              margin='normal'
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
            />
            <TextField
              required
              id='item'
              label='Item'
              variant='outlined'
              fullWidth
              margin='normal'
              value={item}
              onChange={(e) => setItem(e.target.value)}
            />
            {/* <TextField
              required
              id='type'
              label='Type of Item'
              variant='outlined'
              fullWidth
              margin='normal'
              value={type}
              onChange={(e) => setType(e.target.value)}
            /> */}
            <div className={classes.select}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="item-type-label">Item Type</InputLabel>
              <Select
                labelId="item-type-label"
                id="item-type-select"
                value={type}
                onChange={selectTypeHandler}
                label="Item Type"
                required
              >
                <MenuItem value="">
                  <em>Select Item Type</em>
                </MenuItem>
                <MenuItem value="package">Package</MenuItem>
                <MenuItem value="envelope">Envelope</MenuItem>
              </Select>
            </FormControl>
            </div>
            <TextField
              required
              id='weight'
              type='Number'
              label='Weight of Item'
              variant='outlined'
              fullWidth
              margin='normal'
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
            <TextField
              required
              id='departureDate'
              label='Departure Date'
              variant='outlined'
              fullWidth
              margin='normal'
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
            />
            <DatePicker
              selected={departureDate}
              onChange={(date) => setDepartureDate(date)}
              showTimeSelect
              timeFormat='HH:mm'
              timeIntervals={15}
              timeCaption='time'
              dateFormat='MMMM d, yyyy h:mm aa'
              placeholderText='Select Departure Date'
              backgroundColor='white'
            />
            {/* <TextField
              required
              id='status'
              label='Status'
              variant='outlined'
              fullWidth
              margin='normal'
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            /> */}

            <Box marginBottom={2}>
              <Typography variant="subtitle1" gutterBottom>Origin Country</Typography>
              <CountryDropdown label="Origin" onChange={handleOriginChange} />
            </Box>

            <Box marginBottom={2}>
              <Typography variant="subtitle1" gutterBottom>Destination Country</Typography>
              <CountryDropdown label="Destination" onChange={handleDestinationChange} />
            </Box>
            <Box marginBottom={2}>
              <Typography variant="subtitle1" gutterBottom>Current Location</Typography>
              <CountryDropdown label="Current Location" onChange={handleCurrentLocationChange} />
            </Box>
            {/* <TextField
              required
              id='userId'
              label='User ID'
              variant='outlined'
              fullWidth
              margin='normal'
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            /> */}
            <TextField
              required
              id='estimatedDelivery'
              label='Estimated Delivery'
              variant='outlined'
              fullWidth
              margin='normal'
              value={estimatedDelivery}
              onChange={(e) => setEstimatedDelivery(e.target.value)}
            />
            <DatePicker
              selected={estimatedDelivery}
              onChange={(date) => setEstimatedDelivery(date)}
              showTimeSelect
              timeFormat='HH:mm'
              timeIntervals={15}
              timeCaption='time'
              dateFormat='MMMM d, yyyy h:mm aa'
              placeholderText='Select Estimated Delivery Date'
              backgroundColor='white'
            />
            <DialogActions>
              <BlueButton type='submit' disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Create Shipment'}
              </BlueButton>
            </DialogActions>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreateShipment;
