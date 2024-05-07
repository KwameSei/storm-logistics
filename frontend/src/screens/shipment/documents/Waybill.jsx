import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Barcode from 'react-barcode';
import ReactToPrint from 'react-to-print';
import Logo from '../../../assets/storm-logo.jpg';
import { getShipmentFailure, getShipment } from '../../../state-management/shipmentState/shipmentSlice';
import classes from './documents.module.scss';
import { BlueButton } from '../../../components/ButtonStyled';

const Waybill = () => {
  const componentRef = useRef();
  const { id } = useParams();
  const dispatch = useDispatch();
  // const [shipmentData, setShipmentData] = useState(null);
  const [waybillNumber, setWaybillNumber] = useState('');

  const URL = import.meta.env.VITE_SERVER_URL;
  const token = useSelector(state => state.user.token);
  const shipmentError = useSelector(state => state.shipment.error);
  const shipment = useSelector(state => state.shipment.shipment);
  console.log('Shipment: ', shipment);
  
  // Function to generate the waybill number
  const generateWaybillNumber = () => {
    // Logic to generate the waybill number
    const name = 'STORM';
    const random = Math.floor(Math.random() * 100000).toString().padStart(10, '0'); // Random 10 digit number
    const waybillNumberGenerated = `${name}-${random}`;
    setWaybillNumber(waybillNumberGenerated);
  }
  
  // Fetch shipment data
  const fetchShipmentData = async () => {
    try {
      const response = await axios.get(`${URL}/api/shipment/get-shipment-byId/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const shipmentData = response.data.data;
      console.log('Shipment data: ', shipmentData);

      if (shipmentData) {
        dispatch(getShipment(shipmentData));
        generateWaybillNumber();
      } else {
        toast.error('No shipment found');
      }
    } catch (error) {
      console.error('Error fetching shipment data: ', error);
      toast.error(error.message);
      dispatch(getShipmentFailure(error.message));
    }
  }

  useEffect(() => {
    if (id) {
      fetchShipmentData();
    }
  }, [id]);

  if (shipmentError) {
    return <div>{shipmentError}</div>;
  }

  if (!shipment) {
    return <div>Loading...</div>;
  }

  const {
    senderName,
    senderMail,
    senderPhone,
    senderAddress,
    recipientName,
    recipientEmail,
    recipientPhone,
    recipientAddress,
    item,
    quantity,
    type,
    weight,
    distance,
    shippingCost,
    vatRate,
    totalCost,
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
    status,
    cifValue,
    hs_code,
    carrier_reference_number,
    trackingNumber,
  } = shipment;

  // Encoding data for the barcode
  const barcodeData = {
    waybillNumber: waybillNumber,
    trackingNumber: shipment.trackingNumber,
    cifValue: shipment.cifValue,
    hs_code: shipment.hs_code.hs_code,
  }

  // Barcode options
  const barcodeOptions = {
    width: 0.222,
    height: 50,
    format: 'CODE128',  // CODE128, CODE39, EAN13, EAN8, ITF14, UPCA, UPCE
    displayValue: false,
    background: '#ffffff',
    lineColor: '#000000', // color examples 'red', '#F00', '#FF0000', '#FF0000FF'
    // margin: 10,
    // marginTop: 10,
    // marginBottom: 10,
    // marginLeft: 10,
    // marginRight: 10,
    // fontSize: 20,
    // fontOptions: 'bold',
    // textMargin: 10,
    // font: 'monospace',
    // textAlign: 'center',
    // textPosition: 'bottom',
    // textMargin: 2,
    // fontSize: 20,
    // textMargin: 10,
    // background: '#ffffff',
  }

  // Barcode value
  const barcodeValue = JSON.stringify(barcodeData);

  // Convert pickup_date and pickup_time strings to Date objects
  const pickupDate = new Date(pickup_date);
  const pickupTime = new Date(pickup_time);
  const DeliveryDate = new Date(estimatedDelivery)
  const DepartureDate = new Date(departureDate)

  // Format the date and time strings
  const formattedPickupDate = pickupDate.toLocaleDateString();
  const formattedDeliveryDate = DeliveryDate.toLocaleDateString();
  const formattedDepartureDate = DepartureDate.toLocaleDateString();
  const formattedPickupTime = pickupTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={classes.waybill}>
      <ReactToPrint
        className={classes.print_button}
        trigger={() => (
          <BlueButton
            className={classes.button}
            style={{ width: '15%', margin: '2rem 0', padding: '0.5rem 1rem' }}
          >
            Print Waybill
          </BlueButton>
        )}
        content={() => componentRef.current}
      />
      <div ref={componentRef}>
      <div className={classes.waybill_container}>
        {/* <img src={Logo} alt='watermark' className={classes.watermark_image} /> */}
      <div className={classes.watermark}>
          {/* <img src={Logo} alt="logo" /> */}
      <div className={classes.waybill_section1}>
        <div className={classes.waybill_logo}>
          <img src={Logo} alt="logo" />
        </div>
        <div className={classes.bar_code}>
          <Barcode value={barcodeValue} {...barcodeOptions} />
          <h3>{waybillNumber}</h3>
          <h3>Account's Copy</h3>
        </div>
        <div className={classes.sub_section1}>
          <p>Pickup Date: <br /> {formattedPickupDate}</p>
          <p>Origin: <br /> {origin.country}, {origin.state}, {originCity}</p>
          <p>Carrier: <br /> {carrier}</p>
          <p>Carrier Reference: <br /> {carrier_reference_number}</p>
        </div>
        <div className={classes.sub_section2}>
          <p>Pickup Time: <br /> {formattedPickupTime}</p>
          <p>Destination: <br /> {destination.country}, {destination.state}, {destinationCity}</p>
          <p>Courier: <br /> Storm Logistics</p>
          <p>Tracking Number: <br /> {trackingNumber}</p>
        </div>
        <div className={classes.sub_section3}>
          <p>Delivery Date: <br /> {formattedDeliveryDate}</p>
          <p>Current Location: <br /> {currentLocation.country}, {currentLocation.state}, {currentCity}</p>
          <p>Departure Date: <br /> {formattedDepartureDate}</p>
          <p className={classes.custom_carrier}>Custom Carrier: <br /> {customCarrier}</p>
        </div>
      </div>
      <div className={classes.waybill_section2}>
        <div className={classes.sub_sections1}>
          <p className={classes.persons}>Sender</p>
          <p className={classes.persons_name}>{senderName}</p>
          <p className={classes.email}>Email</p>
          <p className={classes.persons_email}>{senderMail}</p>
          <p className={classes.phone}>Phone</p>
          <p className={classes.persons_phone}>{senderPhone}</p>
          <p className={classes.persons_address}>{senderAddress}</p>
        </div>
        <div className={classes.sub_sections1}>
          <p className={classes.persons}>Recipient</p>
          <p className={classes.persons_name}>{recipientName}</p>
          <p className={classes.email}>Email</p>
          <p className={classes.persons_email}>{recipientEmail}</p>
          <p className={classes.phone}>Phone</p>
          <p className={classes.persons_phone}>{recipientPhone}</p>
          <p className={classes.persons_address}>{recipientAddress}</p>
        </div>
      </div>
      <div className={classes.waybill_section3}>
        <p className={classes.shipment_type}>
          Product: <br />
          {item}
        </p>
        <p className={classes.quantity}>Quantity: {quantity}</p>
        <p className={classes.weight}>Weight: {weight}</p>
        <p className={classes.distance}>Distance: {distance}</p>
        <p className={classes.delivery_mode}>Delivery Mode: {delivery_mode}</p>
        <p className={classes.delivery_type}>Delivery Type: {type}</p>
        <p className={classes.status}>Status: {status}</p>
      </div>
      <div className={classes.waybill_section4}>
        <p className={classes.shipping_cost}>Shipping Cost: <br /> {shippingCost}</p>
        <p className={classes.total_cost}>Total Cost: <br /> {totalCost}</p>
        <p className={classes.cif_value}>CIF Value: <br /> {cifValue}</p>
        <p className={classes.hs_code}>HS Code: <br /> {hs_code.hs_code}</p>
        <p className={classes.description}>Description: <br /> {hs_code.description}</p>
      </div>
        </div>
      </div>

      <div className={classes.waybill_container}>
      <div className={classes.watermark}>
          {/* <img src={Logo} alt="logo" /> */}
      <div className={classes.waybill_section1}>
        <div className={classes.waybill_logo}>
          <img src={Logo} alt="logo" />
        </div>
        <div className={classes.bar_code}>
          <Barcode value={barcodeValue} {...barcodeOptions} />
          <h3>{waybillNumber}</h3>
          <h3>Sender's Copy</h3>
        </div>
        <div className={classes.sub_section1}>
          <p>Pickup Date: <br /> {formattedPickupDate}</p>
          <p>Origin: <br /> {origin.country}, {origin.state}, {originCity}</p>
          <p>Carrier: <br /> {carrier}</p>
          <p>Carrier Reference: <br /> {carrier_reference_number}</p>
        </div>
        <div className={classes.sub_section2}>
          <p>Pickup Time: <br /> {formattedPickupTime}</p>
          <p>Destination: <br /> {destination.country}, {destination.state}, {destinationCity}</p>
          <p>Courier: <br /> Storm Logistics</p>
          <p>Tracking Number: <br /> {trackingNumber}</p>
        </div>
        <div className={classes.sub_section3}>
          <p>Delivery Date: <br /> {formattedDeliveryDate}</p>
          <p>Current Location: <br /> {currentLocation.country}, {currentLocation.state}, {currentCity}</p>
          <p>Departure Date: <br /> {formattedDepartureDate}</p>
          <p className={classes.custom_carrier}>Custom Carrier: <br /> {customCarrier}</p>
        </div>
      </div>
      <div className={classes.waybill_section2}>
        <div className={classes.sub_sections1}>
          <p className={classes.persons}>Sender</p>
          <p className={classes.persons_name}>{senderName}</p>
          <p className={classes.email}>Email</p>
          <p className={classes.persons_email}>{senderMail}</p>
          <p className={classes.phone}>Phone</p>
          <p className={classes.persons_phone}>{senderPhone}</p>
          <p className={classes.persons_address}>{senderAddress}</p>
        </div>
        <div className={classes.sub_sections1}>
          <p className={classes.persons}>Recipient</p>
          <p className={classes.persons_name}>{recipientName}</p>
          <p className={classes.email}>Email</p>
          <p className={classes.persons_email}>{recipientEmail}</p>
          <p className={classes.phone}>Phone</p>
          <p className={classes.persons_phone}>{recipientPhone}</p>
          <p className={classes.persons_address}>{recipientAddress}</p>
        </div>
      </div>
      <div className={classes.waybill_section3}>
        <p className={classes.shipment_type}>
          Product: <br />
          {item}
        </p>
        <p className={classes.quantity}>Quantity: {quantity}</p>
        <p className={classes.weight}>Weight: {weight}</p>
        <p className={classes.distance}>Distance: {distance}</p>
        <p className={classes.delivery_mode}>Delivery Mode: {delivery_mode}</p>
        <p className={classes.delivery_type}>Delivery Type: {type}</p>
        <p className={classes.status}>Status: {status}</p>
      </div>
      <div className={classes.waybill_section4}>
        <p className={classes.shipping_cost}>Shipping Cost: <br /> {shippingCost}</p>
        <p className={classes.total_cost}>Total Cost: <br /> {totalCost}</p>
        <p className={classes.cif_value}>CIF Value: <br /> {cifValue}</p>
        <p className={classes.hs_code}>HS Code: <br /> {hs_code.hs_code}</p>
        <p className={classes.description}>Description: <br /> {hs_code.description}</p>
      </div>
        </div>
      </div>

      <div className={classes.waybill_container}>
      <div className={classes.watermark}>
          {/* <img src={Logo} alt="logo" /> */}
      <div className={classes.waybill_section1}>
        <div className={classes.waybill_logo}>
          <img src={Logo} alt="logo" />
        </div>
        <div className={classes.bar_code}>
          <Barcode value={barcodeValue} {...barcodeOptions} />
          <h3>{waybillNumber}</h3>
          <h3>Recipient's Copy</h3>
        </div>
        <div className={classes.sub_section1}>
          <p>Pickup Date: <br /> {formattedPickupDate}</p>
          <p>Origin: <br /> {origin.country}, {origin.state}, {originCity}</p>
          <p>Carrier: <br /> {carrier}</p>
          <p>Carrier Reference: <br /> {carrier_reference_number}</p>
        </div>
        <div className={classes.sub_section2}>
          <p>Pickup Time: <br /> {formattedPickupTime}</p>
          <p>Destination: <br /> {destination.country}, {destination.state}, {destinationCity}</p>
          <p>Courier: <br /> Storm Logistics</p>
          <p>Tracking Number: <br /> {trackingNumber}</p>
        </div>
        <div className={classes.sub_section3}>
          <p>Delivery Date: <br /> {formattedDeliveryDate}</p>
          <p>Current Location: <br /> {currentLocation.country}, {currentLocation.state}, {currentCity}</p>
          <p>Departure Date: <br /> {formattedDepartureDate}</p>
          <p className={classes.custom_carrier}>Custom Carrier: <br /> {customCarrier}</p>
        </div>
      </div>
      <div className={classes.waybill_section2}>
        <div className={classes.sub_sections1}>
          <p className={classes.persons}>Sender</p>
          <p className={classes.persons_name}>{senderName}</p>
          <p className={classes.email}>Email</p>
          <p className={classes.persons_email}>{senderMail}</p>
          <p className={classes.phone}>Phone</p>
          <p className={classes.persons_phone}>{senderPhone}</p>
          <p className={classes.persons_address}>{senderAddress}</p>
        </div>
        <div className={classes.sub_sections1}>
          <p className={classes.persons}>Recipient</p>
          <p className={classes.persons_name}>{recipientName}</p>
          <p className={classes.email}>Email</p>
          <p className={classes.persons_email}>{recipientEmail}</p>
          <p className={classes.phone}>Phone</p>
          <p className={classes.persons_phone}>{recipientPhone}</p>
          <p className={classes.persons_address}>{recipientAddress}</p>
        </div>
      </div>
      <div className={classes.waybill_section3}>
        <p className={classes.shipment_type}>
          Product: <br />
          {item}
        </p>
        <p className={classes.quantity}>Quantity: {quantity}</p>
        <p className={classes.weight}>Weight: {weight}</p>
        <p className={classes.distance}>Distance: {distance}</p>
        <p className={classes.delivery_mode}>Delivery Mode: {delivery_mode}</p>
        <p className={classes.delivery_type}>Delivery Type: {type}</p>
        <p className={classes.status}>Status: {status}</p>
      </div>
      <div className={classes.waybill_section4}>
        <p className={classes.shipping_cost}>Shipping Cost: <br /> {shippingCost}</p>
        <p className={classes.total_cost}>Total Cost: <br /> {totalCost}</p>
        <p className={classes.cif_value}>CIF Value: <br /> {cifValue}</p>
        <p className={classes.hs_code}>HS Code: <br /> {hs_code.hs_code}</p>
        <p className={classes.description}>Description: <br /> {hs_code.description}</p>
      </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Waybill;