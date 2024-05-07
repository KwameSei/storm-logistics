import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Box, CircularProgress, Container, Typography, TextField, DialogActions, MenuItem, InputLabel, Select, FormControl } from '@mui/material';
import { BlueButton } from '../../../components/ButtonStyled';
import { CountryDropdown } from '../../../components';
import { getShipmentSuccess } from '../../../state-management/shipmentState/shipmentSlice';
import { setIcumses } from '../../../state-management/icums/icumsSlice';
import { Waybill } from '../../../screens';

import classes from './CreateShipment.module.scss';

const CreateShipment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const [senderMail, setSenderMail] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderAddress, setSenderAddress] = useState('');
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [pickup_time, setPickup_time] = useState('');
  const [pickup_date, setPickup_date] = useState('');
  const [delivery_mode, setDelivery_mode] = useState('');
  const [weight, setWeight] = useState(0.1);
  const [dimensions, setDimensions] = useState({ length: '', width: '', height: '' });
  const [distance, setDistance] = useState(0.1);
  const [shippingCost, setShippingCost] = useState('');
  const vatRate = 17.5; // VAT rate is fixed at 17.5%
  const [totalCost, setTotalCost] = useState(0);
  const [type, setType] = useState('');
  const [carrier, setCarrier] = useState('');
  const [customCarrier, setCustomCarrier] = useState('');
  const [selectedCarrier, setSelectedCarrier] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [origin, setOrigin] = useState({ country: '', state: ''});
  const [destination, setDestination] = useState({ country: '', state: '' });
  const [currentLocation, setCurrentLocation] = useState({ country: '', state: ''});
  const [originCity, setOriginCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [hs_code, setHs_code] = useState('');
  const [cifValue, setCifValue] = useState('');
  const [isShipmentCreated, setIsShipmentCreated] = useState(false);

  const [currency, setCurrency] = useState('GHS');
  const [itemInfo, setItemInfo] = useState([{ 
    quantity: '', 
    weight: '',
    hs_code: '',
    cpc: '',
    origin: '',
    cifValue: '',
    fob: '',
    pkgUnit: '',
    suppUnit1: '',
  }]);
  const [userDefinedTax, setUserDefinedTax] = useState([{
    quantity: '',
    taxType: '',
    taxRate: '',
  }]);
  const [calculatedTax, setCalculatedTax] = useState(null);
  // const [import_duty_rate, setImport_duty_rate] = useState('');
  // const [import_duty_vat, setImport_duty_vat] = useState('');
  // const [otherDutiesAndCharges, setOtherDutiesAndCharges] = useState('');
  // const [totalDutyCost, setTotalDutyCost] = useState('');

  const [dutyData, setDutyData] = useState({
    importDuty: 0,
    vat: 0,
    nhil: 0,
    otherDutiesAndCharges: 0,
    totalDutyCost: 0,
  });

  const [status, setStatus] = useState({
    success: true,
    message: '',
  });

  const URL = import.meta.env.VITE_SERVER_URL;
  const API_KEY = import.meta.env.VITE_COUNTRY_CITY_API_KEY;
  const currentUser = useSelector((state) => state.user.currentUser);
  const currentRole = useSelector((state) => state.user.currentUser.data.role);
  const token = useSelector((state) => state.user.token);
  const shipment = useSelector((state) => state.shipment.shipment);
  const icumses = useSelector((state) => state.icums.icumses);
  // console.log('ICUMS Data in Redux:', icumses);

  // Fetch the list of available HS codes from the ICUMS API
  const fetchIcums = async () => {
    try {
      const response = await axios.get(`${URL}/api/icums/get-all-icums`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const icumsData = response.data.data;
      console.log('Fetched ICUMS Data:', icumsData);
      
      dispatch(setIcumses(icumsData));
    } catch (error) {
      console.error('Error fetching ICUMS data:', error);
      toast.error(error?.data || 'Failed to fetch ICUMS data');
    }
  };

  useEffect(() => {
    fetchIcums();
  }, [token]);

  const fields = {
    senderMail,
    senderName,
    senderPhone,
    senderAddress,
    item,
    quantity,
    type,
    weight,
    distance,
    shippingCost,
    vatRate,
    totalCost,
    recipientName,
    recipientPhone,
    recipientEmail,
    recipientAddress,
    departureDate,
    origin,
    destination,
    originCity,
    destinationCity,
    currentCity,
    currentLocation,
    estimatedDelivery,
    carrier,
    customCarrier,
    delivery_mode,
    pickup_date,
    pickup_time,
    cifValue,
    hs_code
  };

  const carriers = [
    'Ghana Post',
    'DHL',
    'FedEx',
    'UPS',
    'USPS',
    'TNT',
    'Aramex',
    'Delta Air Freight',
    'Emirates SkyCargo',
    'Air France Cargo',
    'Cargolux',
    'China Airlines Cargo',
    'ANA Cargo',
    'Asiana Cargo',
    'EVA Air Cargo',
    'IAG Cargo',
    'KLM Cargo',
    'LATAM Cargo',
    'Qantas Freight',
    'Saudia Cargo',
    'Swiss WorldCargo',
    'United Cargo', 
    'Virgin Atlantic Cargo',
    'Air Canada Cargo',
    'Air China Cargo',
    'AirBridgeCargo',
    'Air India Cargo',
    'Air New Zealand Cargo',
    'American Airlines Cargo',
    'Atlas Air',
    'British Airways World Cargo',
    'Cargolux Italia',
    'Cathay Pacific Cargo',
    'China Southern Cargo',
    'Coyne Airways',
    'DHL Aviation',
    'EgyptAir Cargo',
    'El Al Cargo',
    'Ethiopian Cargo',
    'Etihad Cargo',
    'FedEx Express',
    'Garuda Indonesia Cargo',
    'Iberia Cargo',
    'Korean Air Cargo',
    'Lufthansa Cargo',
    'MASkargo',
    'Nippon Cargo Airlines',
    'Qatar Airways Cargo',
    'Singapore Airlines Cargo',
    'South African Airways Cargo',
    'Thai Cargo',
    'Turkish Airlines Cargo',
    'UPS Airlines',
    'Vietnam Airlines Cargo',
    'Volga-Dnepr Airlines',
    'XiamenAir Cargo',
    'Yangtze River Express',
    'Zimex Aviation',
    'Other'
  ];

  // Function to calculate the shipping cost
  const calculateShippingCost = (type, weight, quantity, distance, delivery_mode, carrier) => {
    console.log('Inputs:', type, weight, quantity, distance, delivery_mode, carrier);

    // Validate inputs and return 0 if any input is invalid
    if (
        !type || !weight || !quantity || !distance || !delivery_mode || !carrier ||
        isNaN(weight) || isNaN(quantity) || isNaN(distance)
    ) {
        console.error('Invalid input(s) provided.');
        return 0;
    }

    // Initialize rates with default values
    let carrierRate = 0;
    let deliveryModeRate = 0;
    let typeRate = 0;
    let weightRate = 0;
    let quantityRate = 0;
    let distanceRate = 0;

    // Calculate carrier rate based on the selected carrier
    switch (carrier) {
        case 'Ghana Post':
            carrierRate = 10;
            break;
        case 'DHL':
            carrierRate = 20;
            break;
        // Additional cases
        default:
            carrierRate = 60;
            break;
    }

    // Calculate delivery mode rate based on the selected delivery mode
    switch (delivery_mode) {
        case 'Air':
            deliveryModeRate = 10;
            break;
        case 'Sea':
            deliveryModeRate = 20;
            break;
        // Additional cases
        default:
            deliveryModeRate = 40;
            break;
    }

    // Calculate type rate based on the selected type
    switch (type) {
        case 'Package':
            typeRate = 10;
            break;
        case 'Envelope':
            typeRate = 20;
            break;
        // Additional cases
        default:
            typeRate = 40;
            break;
    }

    // Calculate weight rate based on the weight
    const ratePerKg = 21;
    weightRate = weight * ratePerKg;

    // Calculate quantity rate based on the quantity
    quantityRate = quantity;

    // Calculate distance rate based on the distance
    const ratePerKm = 0.8;
    distanceRate = distance * ratePerKm;

    // Calculate the total shipping cost
    const shippingCost = (weightRate + distanceRate + typeRate + deliveryModeRate + carrierRate) * quantity;

    console.log('Calculated shipping cost:', shippingCost);
    return shippingCost;
};

  // Use useEffect to calculate the shipping cost whenever the form fields change
  useEffect(() => {
    console.log('useEffect triggered with dependencies:', weight, quantity, distance, type, delivery_mode, carrier);

    if (weight && quantity && distance && type && delivery_mode && carrier) {
        const calculatedShippingCost = calculateShippingCost(type, weight, quantity, distance, delivery_mode, carrier);
        setShippingCost(calculatedShippingCost.toFixed(2)); // Round off to 2 decimal places
        console.log('Shipping Cost:', calculatedShippingCost);
    } else {
        setShippingCost('');
        console.log('Shipping Cost:', 0);
    }
}, [weight, quantity, distance, type, delivery_mode, carrier]);

// const testShippingCost = calculateShippingCost('Package', 10, 5, 100, 'Air', 'DHL');
// console.log('Test Shipping Cost:', testShippingCost);


   // Function to calculate the total duty payable based on the CIF value and HS code
   const calculateDuty = (cifValue, hs_code) => {
    const hsData = icumses.find((icums) => icums.hs_code === hs_code);
    console.log('HS Data:', hsData);

    // Initialize dutyData object to store the calculated duties
    const dutyData = {
        importDuty: 0,
        vat: 0,
        nhil: 0,
        otherDutiesAndCharges: 0,
        totalDutyCost: 0,
    };

    if (hsData) {
        // Calculate import duty
        const importDuty = (hsData.import_duty_rate / 100) * cifValue;
        dutyData.importDuty = importDuty;

        // Calculate VAT using the VAT rate and (CIF value + import duty)
        const vat = (hsData.import_duty_vat / 100) * cifValue;
        dutyData.vat = vat;

        // Calculate NHIL using the NHIL rate and (CIF value + import duty)
        const nhil = (hsData.nhil_rate / 100) * cifValue;
        dutyData.nhil = nhil;

        // Calculate other duties and charges
        const otherDutiesAndCharges = (12 / 100) * cifValue;
        dutyData.otherDutiesAndCharges = otherDutiesAndCharges;

        // Calculate total duty cost
        const totalDutyCost = importDuty + vat + nhil + otherDutiesAndCharges;
        dutyData.totalDutyCost = totalDutyCost;

        console.log('Duty Data:', dutyData);
    }

    return dutyData;
  };

  // Calculate duties whenever the CIF value or HS code changes and display the results in the form
  useEffect(() => {
    if (cifValue && hs_code) {
      const data = calculateDuty(cifValue, hs_code);
      setDutyData(data);
    }
  }, [cifValue, hs_code]);

  // Function to calculate the total cost of the shipment
  const calculateTotalCost = (shippingCost, totalDutyCost) => {
  // Calculate the total cost by summing shipping cost and total duty cost
  const calculatedTotalCost = parseFloat(shippingCost) + parseFloat(totalDutyCost);

  // Set the calculated total cost in the state
  setTotalCost(calculatedTotalCost.toFixed(2)); // Round off to 2 decimal places

  console.log('Calculated Total Cost:', calculatedTotalCost);

  return calculatedTotalCost;
};

  // Use useEffect to calculate the total cost whenever the shipping cost or total duty cost changes
  useEffect(() => {
    console.log('useEffect triggered with dependencies:', shippingCost, dutyData.totalDutyCost);
    if (shippingCost && dutyData.totalDutyCost) {
        const calculatedTotalCost = calculateTotalCost(shippingCost, dutyData.totalDutyCost);
        setTotalCost(calculatedTotalCost.toFixed(2)); // Round off to 2 decimal places
        console.log('Total Cost:', calculatedTotalCost);
    } else {
      setTotalCost('');
      console.log('Total Cost:', 0);
    }
  }, [shippingCost, dutyData.totalDutyCost]);

  const createShipment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${URL}/api/shipment/create-shipment`, 
      {
        ...fields,
        userId: currentUser?.data?._id,
        status: 'Pending',
        approvedByAdmin: false,
        senderMail: senderMail,
        senderName: senderName,
        senderPhone: senderPhone,
        shippingCost: shippingCost,
        vatRate: vatRate,
        totalCost: totalCost,
      }, {
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

      setIsShipmentCreated(true);
      console.log('Generated Waybill:', generatedWaybill);

      navigate(`/${currentRole.toLowerCase()}-dashboard/shipment-creation-success`);
      setLoading(false);
    } catch (error) {
      console.error('Error creating shipment:', error);
      toast.error(error?.data || 'Failed to create shipment');
      setLoading(false);
      setIsShipmentCreated(false)
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form fields
    // if (
    //   !senderMail || 
    //   !item || 
    //   !recipientName || 
    //   !recipientPhone || 
    //   !departureDate || 
    //   !origin.country || 
    //   !origin.state || 
    //   !origin.city || 
    //   !destination.country || 
    //   !destination.state || 
    //   !destination.city || 
    //   !currentLocation || 
    //   !estimatedDelivery ||
    //   !type ||
    //   !weight ||
    //   !senderName ||
    //   !senderPhone ||
    //   !recipientEmail ||
    //   !dimensions ||
    //   !distance ||
    //   !shippingCost ||
    //   !vatRate ||
    //   !totalCost
    //   ) {
    //   return toast.error('All fields are required');
    // }

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

  const selectCarrierHandler = (e) => {
    const selectedCarrier = e.target.value;
    setCarrier(selectedCarrier);

    // Reset custom carrier name when a different option than "Other" is selected
    if (selectedCarrier !== 'Other') {
      setCustomCarrier('');
    }
  };

  const selectHsCodeHandler = (e) => {
    setHs_code(e.target.value);
  };

  // Handle changes to the custom carrier input field
  const handleCustomCarrierChange = (e) => {
    setCustomCarrier(e.target.value);
  };

  // Delivery mode handler
  const handleDeliveryModeChange = (e) => {
    setDelivery_mode(e.target.value);
  };

  // Event handlers to constrain users from entering invalid characters
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
        setQuantity(value);
        console.log('Quantity updated:', value);
    } else {
        console.log('Invalid quantity:', e.target.value);
    }
  };

  const handleWeightChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
        setWeight(value);
        console.log('Weight updated:', value);
    } else {
        console.log('Invalid weight:', e.target.value);
    }
  };

  const handleDistanceChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
        setDistance(value);
        console.log('Distance updated:', value);
    } else {
        console.log('Invalid distance:', e.target.value);
    }
  };


    const handleOriginCityChange = (e) => {
      setOriginCity(e.target.value);
  };

  const handleDestinationCityChange = (e) => {
    setDestinationCity(e.target.value);
  };

  const handleCurrentLocationCityChange = (e) => {  
    setCurrentCity(e.target.value);
  };

  const handlePhoneChange = (e) => {
    const re = /^[0-9\b]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      setSenderPhone(e.target.value);
    }
  }

  const handleRecipientPhoneChange = (e) => {
    const re = /^[0-9\b]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      setRecipientPhone(e.target.value);
    }
  }

  // Handler functions for tax calculation
  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  }

  const handleItemInfoChange = (field, value, index) => {
    const updatedItemInfo = [...itemInfo];
    updatedItemInfo[index][field] = value;
    setItemInfo(updatedItemInfo);
  }

  const handleUseDefinedTaxChange = (field, value, index) => {
    const updatedUseDefinedTax = [...userDefinedTax];
    updatedUseDefinedTax[index][field] = value;
    setUserDefinedTax(updatedUseDefinedTax);
  }

  // Function to calculate tax based on the inputs
  const calculateTax = () => {
    const totalCifValue = itemInfo.reduce((acc, item) => acc + item.cifValue, 0);
    const totalFobValue = itemInfo.reduce((acc, item) => acc + item.fob, 0);
    const totalTax = userDefinedTax.reduce((acc, tax) => acc + tax.taxRate, 0);

    const calculatedTax = {
      totalCifValue,
      totalFobValue,
      totalTax,
    };

    setCalculatedTax(calculatedTax);
  }

  return (
    <Container className={classes.shipment_container}>
      <div className={classes.container}>
        <div className={classes.shipment_form}>
          <Typography variant='h4' className={classes.shipment_form_title}>Create Shipment</Typography>
          <form onSubmit={handleSubmit}>
            <Box className={classes.persons_info}>
              <Box className={classes.persons_details}>
                <Typography variant='h6' className={classes.persons_info_title}>Sender Details</Typography>
                <TextField
                  required
                  id='senderName'
                  label='Sender Name'
                  variant='outlined'
                  size='medium'
                  margin='normal'
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className={classes.text}
                />
                <TextField
                  required
                  id='senderMail'
                  label='Sender Email'
                  variant='outlined'
                  size='medium'
                  margin='normal'
                  value={senderMail}
                  onChange={(e) => setSenderMail(e.target.value)}
                  className={classes.text}
                />
                <TextField
                  required
                  id='senderPhone'
                  label='Sender Phone'
                  variant='outlined'
                  size='medium'
                  margin='normal'
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  className={classes.text}
                />
                <TextField
                  required
                  id='senderAddress'
                  label='Sender Address'
                  variant='outlined'
                  size='medium'
                  margin='normal'
                  value={senderAddress}
                  onChange={(e) => setSenderAddress(e.target.value)}
                  className={classes.text}
                />
              </Box>
              <Box className={classes.persons_details}>
                <Typography variant='h6' className={classes.persons_info_title}>Recipient Details</Typography>
                <TextField
                  required
                  id='recipientName'
                  label='Recipient Name'
                  variant='outlined'
                  size='medium'
                  margin='normal'
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className={classes.text}
                />
                <TextField
                  required
                  id='recipientEmail'
                  label='Recipient Email'
                  variant='outlined'
                  size='medium'
                  margin='normal'
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className={classes.text}
                />
                <TextField
                  required
                  id='recipientPhone'
                  label='Recipient Phone'
                  variant='outlined'
                  size='medium'
                  margin='normal'
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  className={classes.text}
                />
                <TextField
                  required
                  id='recipientAddress'
                  label='Recipient Address'
                  variant='outlined'
                  size='medium'
                  margin='normal'
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className={classes.text}
                />
              </Box>
            </Box>
            <Box className={classes.item_info}>
              <TextField
                required
                id='item'
                label='Item'
                variant='outlined'
                size='medium'
                margin='normal'
                value={item}
                onChange={(e) => setItem(e.target.value)}
                className={classes.text}
              />
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
                    className={classes.text}
                  >
                    <MenuItem value="">
                      <em>Select Item Type</em>
                    </MenuItem>
                    <MenuItem value="Package">Package</MenuItem>
                    <MenuItem value="Envelope">Envelope</MenuItem>
                    <MenuItem value="Pallet">Pallet</MenuItem>
                    <MenuItem value="Box">Box</MenuItem>
                    <MenuItem value="Crate">Crate</MenuItem>
                    <MenuItem value="Bag">Bag</MenuItem>
                    <MenuItem value="hand Carry">Hand Carry</MenuItem>
                    <MenuItem value="Expedited">Expedited</MenuItem>
                    <MenuItem value="Overnight">Over Night</MenuItem>
                    <MenuItem value="Priority Mail">Priority Mail</MenuItem>
                    <MenuItem value="Flat Rate">Flat Rate</MenuItem>
                    <MenuItem value="Local Delivery">Local Delivery</MenuItem>
                    <MenuItem value="Storage">Storage</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <TextField
                 required
                  id='quantity'
                  type='number'
                  label='Quantity'
                  variant='outlined'
                  size='medium'
                  margin='normal'
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1" // Ensure the minimum quantity is 1
                  step="1" // Step size of 1 for quantity
                  className={classes.text}
                  inputProps={{
                    min: 1, // Set the minimum value for the input
                    step: 1, // Set the step size
                 }}
              />
              <TextField
                required
                id='weight'
                type='number'
                label='Weight per unit in Kg'
                variant='outlined'
                size='medium'
                margin='normal'
                value={weight}
                onChange={handleWeightChange}
                min="0.1" // Minimum weight per unit
                step="0.1" // Step size of 0.01 for weight
                className={classes.text}
                inputProps={{
                  min: 0.1, // Set the minimum value for the input
                  step: 0.1, // Set the step size
                }}
              />
            </Box>
            <Box className={classes.item_info2}>
              <TextField
                required
                type='number'
                id='distance'
                label='Distance in km'
                variant='outlined'
                size='medium'
                margin='normal'
                value={distance}
                onChange={handleDistanceChange}
                min="0.1" // Minimum distance
                step="0.1" // Step size of 0.01 for distance
                className={classes.text}
                inputProps={{
                    min: 0.1, // Set the minimum value for the input
                    step: 0.1, // Set the step size
                }}
              />
                <div className={classes.select}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="delivery-mode">Delivery Mode</InputLabel>
                    <Select
                      labelId="delivery-mode"
                      id="delivery-mode-select"
                      value={delivery_mode}
                      onChange={handleDeliveryModeChange}
                      label="Delivery Mode"
                      required
                      className={classes.text}
                    >
                      <MenuItem value="">
                        <em>Select Delivery Mode</em>
                      </MenuItem>
                      <MenuItem value="Air">Air</MenuItem>
                      <MenuItem value="Sea">Sea</MenuItem>
                      <MenuItem value="Land">Land</MenuItem>
                      <MenuItem value="Rail">Rail</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <TextField
                required
                id='cifValue'
                label='CIF Value'
                variant='outlined'
                size='medium'
                margin='normal'
                value={cifValue}
                onChange={(e) => setCifValue(e.target.value)}
                className={classes.text}
              />
              <div className={classes.select}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="hs_code">HS Code</InputLabel>
                  <Select
                    labelId="hs_code"
                    id="hs_code-select"
                    value={hs_code}
                    onChange={selectHsCodeHandler}
                    label="HS Code"
                    required
                    className={classes.text}
                  >
                    <MenuItem value="">
                      <em>Select HS Code</em>
                    </MenuItem>
                    {icumses.map((icums) => (
                      <MenuItem key={icums._id} value={icums.hs_code}>{icums.hs_code}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </Box>

            <Box className={classes.dates}>
            <div className={classes.carrier_select}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="carrier-label">Carrier</InputLabel>
                <Select
                  labelId="carrier-label"
                  id="carrier-select"
                  value={carrier}
                  onChange={selectCarrierHandler}
                  label="Carrier"
                  required
                  className={classes.text}
                >
                  <MenuItem value="">
                    <em>Select Carrier</em>
                  </MenuItem>
                  {carriers.map((carrier) => (
                    <MenuItem key={carrier} value={carrier}>{carrier}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className={classes.date_item}>
              <label htmlFor='pickup_date'>Pickup Date</label>
              <TextField
                required
                type='date'
                id='pickup_date'
                // label='Pickup Date'
                variant='outlined'
                size='medium'
                margin='normal'
                value={pickup_date}
                onChange={(e) => setPickup_date(e.target.value)}
                className={classes.text}
              />
            </div>
            <div className={classes.date_item}>
              <label htmlFor='pickup_time'>Pickup Time</label>
              <TextField
                required
                type='time'
                id='pickup_time'
                variant='outlined'
                size='medium'
                margin='normal'
                value={pickup_time}
                onChange={(e) => setPickup_time(e.target.value)}
                className={classes.text}
              />
            </div>
            <div className={classes.date_item}>
              <label htmlFor='departureDate'>Departure Date: </label>
              <TextField
                required
                type='date'
                id='departureDate'
                variant='outlined'
                size='medium'
                margin='normal'
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className={classes.text}
              />
            </div>
            <div className={classes.date_item}>
              <label htmlFor='estimatedDelivery'>Estimated Delivery: </label>
              <TextField
                required
                type='date'
                id='estimatedDelivery'
                variant='outlined'
                size='medium'
                margin='normal'
                value={estimatedDelivery}
                onChange={(e) => setEstimatedDelivery(e.target.value)}
                className={classes.text}
              />
            </div>
          </Box>

            {/* Conditionally render a TextField when "Other" is selected */}
            {carrier === 'Other' && (
              <TextField
                required
                id='customCarrier'
                label='Custom Carrier'
                variant='outlined'
                size='medium'
                margin='normal'
                value={customCarrier}
                onChange={handleCustomCarrierChange}
                className={classes.text}
                // onChange={(e) => onCustomCarrierChange(e.target.value)}
              />
            )}

              <div className={classes.bottom_section}>
              <div className={classes.left_items}>
            <Box marginBottom={2} className={classes.country_states}>
              <Typography variant="subtitle1" gutterBottom>Origin Country</Typography>
              <div className={classes.select_country_states}>
              <CountryDropdown label="Origin" onChange={handleOriginChange} />

              <TextField
                required
                id='originCity'
                label='Origin City'
                variant='outlined'
                fullWidth
                margin='normal'
                value={originCity}
                onChange={handleOriginCityChange}
                className={classes.text}
              />
              </div>
            </Box>

            <Box marginBottom={2} className={classes.country_states}>
              <Typography variant="subtitle1" gutterBottom>Destination Country</Typography>
              <div className={classes.select_country_states}>
              <CountryDropdown label="Destination" onChange={handleDestinationChange} />

              <TextField
                required
                id='destinationCity'
                label='Destination City'
                variant='outlined'
                fullWidth
                margin='normal'
                value={destinationCity}
                onChange={handleDestinationCityChange}
                className={classes.text}
              />
              </div>
            </Box>
            <Box marginBottom={2} className={classes.country_states}>
              <Typography variant="subtitle1" gutterBottom>Current Location</Typography>
              <div className={classes.select_country_states}>
              <CountryDropdown label="Current Location" onChange={handleCurrentLocationChange} />

              <TextField
                required
                id='currentLocationCity'
                label='Current Location City'
                variant='outlined'
                fullWidth
                margin='normal'
                value={currentCity}
                onChange={handleCurrentLocationCityChange}
                className={classes.text}
              />
              </div>
            </Box>
            </div>
            {/* <TextField
              required
              id='userId'
              label='User ID'
              variant='outlined'
              size='medium'
              margin='normal'
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            /> */}
            {/* <div className={classes.estimated_delivery}>
              <label htmlFor='estimatedDelivery'>Estimated Delivery: </label>
              <TextField
                required
                type='date'
                id='estimatedDelivery'
                variant='outlined'
                size='medium'
                margin='normal'
                value={estimatedDelivery}
                onChange={(e) => setEstimatedDelivery(e.target.value)}
              />
            </div> */}

            {/* <h2>Tax Calculator</h2>
            <TextField
              required
              id='currency'
              label='Currency'
              variant='outlined'
              size='medium'
              margin='normal'
              value={currency}
              onChange={handleCurrencyChange}
            />
            <div>
              <Typography variant="h6" gutterBottom>Item Information</Typography>
              {itemInfo.map((item, index) => (
                <div key={index}>
                  <TextField
                    required
                    id='quantity'
                    label='Quantity'
                    variant='outlined'
                    size='medium'
                    margin='normal'
                    value={item.quantity}
                    onChange={(e) => handleItemInfoChange('quantity', e.target.value, index)}
                  />
                  <TextField
                    required
                    id='weight'
                    label='Weight'
                    variant='outlined'
                    size='medium'
                    margin='normal'
                    value={item.weight}
                    onChange={(e) => handleItemInfoChange('weight', e.target.value, index)}
                  />
                  <TextField
                    required
                    id='hs_code'
                    label='HS Code'
                    variant='outlined'
                    size='medium'
                    margin='normal'
                    value={item.hs_code}
                    onChange={(e) => handleItemInfoChange('hs_code', e.target.value, index)}
                  />
                  <TextField
                    required
                    id='cpc'
                    label='CPC'
                    variant='outlined'
                    size='medium'
                    margin='normal'
                    value={item.cpc}
                    onChange={(e) => handleItemInfoChange('cpc', e.target.value, index)}
                  />
                  <TextField
                    required
                    id='origin'
                    label='Origin'
                    variant='outlined'
                    size='medium'
                    margin='normal'
                    value={item.origin}
                    onChange={(e) => handleItemInfoChange('origin', e.target.value, index)}
                  />
                  <TextField
                    required
                    id='cifValue'
                    label='CIF Value'
                    variant='outlined'
                    size='medium'
                    margin='normal'
                    value={item.cifValue}
                    onChange={(e) => handleItemInfoChange('cifValue', e.target.value, index)}
                  />
                  <TextField
                    required
                    id='fob'
                    label='FOB'
                    variant='outlined'
                    size='medium'
                    margin='normal'
                    value={item.fob}
                    onChange={(e) => handleItemInfoChange('fob', e.target.value, index)}
                  />
                  <TextField
                    required
                    id='pkgUnit'
                    label='Package Unit'
                    variant='outlined'
                    size='medium'
                    margin='normal'
                    value={item.pkgUnit}
                    onChange={(e) => handleItemInfoChange('pkgUnit', e.target.value, index)}
                  />
                  <TextField
                    required
                    id='suppUnit1'
                    label='Supplementary Unit 1'
                    variant='outlined'
                    size='medium'
                    margin='normal'
                    value={item.suppUnit1}
                    onChange={(e) => handleItemInfoChange('suppUnit1', e.target.value, index)}
                  />
                </div>
              ))}
              <button onClick={() => setItemInfo([...itemInfo, { quantity: '', weight: '', hs_code: '', cpc: '', origin: '', cifValue: '', fob: '', pkgUnit: '', suppUnit1: '' }])}>Add Item</button>
            </div>
            <div>
              <Typography variant="h6" gutterBottom>User Defined Tax</Typography>
              {userDefinedTax.map((tax, index) => (
                <div key={index}>
                  <TextField
                    required
                    id='quantity'
                    label='Quantity'
                    variant='outlined'
                    size='medium'
                    margin='normal'
                    value={tax.quantity}
                    onChange={(e) => handleUseDefinedTaxChange('quantity', e.target.value, index)}
                  />
                  <TextField
                    required
                    id='taxType'
                    label='Tax Type'
                    variant='outlined'
                    size='medium'
                    margin='normal'
                    value={tax.taxType}
                    onChange={(e) => handleUseDefinedTaxChange('taxType', e.target.value, index)}
                  />
                  <TextField
                    required
                    id='taxRate'
                    label='Tax Rate'
                    variant='outlined'
                    size='medium'
                    margin='normal'
                    value={tax.taxRate}
                    onChange={(e) => handleUseDefinedTaxChange('taxRate', e.target.value, index)}
                  />
                </div>
              ))}
              <button onClick={() => setUserDefinedTax([...userDefinedTax, { quantity: '', taxType: '', taxRate: '' }])}>Add Tax</button>
            </div>
            <button onClick={calculateTax}>Calculate Tax</button>
            {calculatedTax && (
              <div>
                <Typography>Total CIF Value: {calculatedTax.totalCifValue}</Typography>
                <Typography>Total FOB Value: {calculatedTax.totalFobValue}</Typography>
                <Typography>Total Tax: {calculatedTax.totalTax}</Typography>
              </div>
            )} */}
            <div className={classes.right_items}>
            {/* Display calculated duties */}
            <div className={classes.sub_charges}>
            <div>
              <p>Import Duty Rate: {dutyData.importDuty}</p>
              <p>Import Duty VAT: {dutyData.vat}</p>
              <p>NHIL: {dutyData.nhil}</p>
              <p>Other Charges: {dutyData.otherDutiesAndCharges}</p>
              <p>Total Charges: {dutyData.totalDutyCost}</p>
            </div>

            <p>Shipping Cost: {shippingCost}</p>
            </div>
            <div className={classes.total_charge}>
            <p>Total Cost: {totalCost}</p>
            </div>
            <BlueButton type='submit' disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Create Shipment'}
            </BlueButton>
            </div>
            </div>
          </form>
          {/* Render the Waybill component only if shipment creation is successful and shipment data is available */}
          {isShipmentCreated && shipment && (
            <Waybill shipment={shipment} />
          )}
        </div>
      </div>
    </Container>
  );
};

export default CreateShipment;
