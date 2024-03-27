import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Box, CircularProgress, Container, Grid, Typography, TextField, DialogActions } from '@mui/material';
import { BlueButton } from '../../../components/ButtonStyled';
import { CountryDropdown } from '../../../components';

import classes from './CreateShipment.module.scss';

const CreateShipment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const [senderMail, setSenderMail] = useState('');
  const [item, setItem] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [origin, setOrigin] = useState({ country: '', state: '', city: '' });
  const [destination, setDestination] = useState({ country: '', state: '', city: '' });
  const [location, setLocation] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');

  const URL = import.meta.env.VITE_SERVER_URL;
  const API_KEY = import.meta.env.VITE_COUNTRY_CITY_API_KEY;
  const currentUser = useSelector((state) => state.user.currentUser);
  const token = useSelector((state) => state.user.token);
  const shipment = useSelector((state) => state.shipment.shipment);

  const fields = {
    senderMail,
    item,
    recipientName,
    recipientPhone,
    departureDate,
    origin,
    destination,
    location,
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
      setLoading(false);
      toast.success('Shipment successfully created')
      navigate('/track-shipment');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create shipment');
      setLoading(false);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form fields
    if (!senderMail,!item || !recipientName || !recipientPhone || !departureDate || !origin.country || !origin.state || !origin.city || !destination.country || !destination.state || !destination.city || !location || !estimatedDelivery) {
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

  return (
    <Container className={classes.shipment_container}>
      <Grid container className={classes.grid_container}>
        <Grid item xs={12} className={classes.shipment_form}>
          <Typography variant='h4' className={classes.shipmentFormTitle}>Create Shipment</Typography>
          <form onSubmit={handleSubmit}>
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
              id='item'
              label='Item'
              variant='outlined'
              fullWidth
              margin='normal'
              value={item}
              onChange={(e) => setItem(e.target.value)}
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
              id='location'
              label='Location'
              variant='outlined'
              fullWidth
              margin='normal'
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
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
