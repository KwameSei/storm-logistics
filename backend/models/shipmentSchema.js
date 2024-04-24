import mongoose, { trusted } from "mongoose";

const shipmentSchema = new mongoose.Schema({

  trackingNumber: {
    type: String,
    unique: true,
    // required: true
  },
  item: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['Document', 'Parcel', 'Container', 'Package', 'Envelope', 'Hand Carry', 'Express', 'Same Day', 'Overnight', 'Priority Mail', 'Local Delivery', 'Storage'],
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  // dimensions: {
  //   length: { type: Number, required: true },
  //   width: { type: Number, required: true },
  //   height: { type: Number, required: true }
  // },
  distance: {
    type: Number,
    required: true
  },
  shippingCost: {
    type: Number,
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  senderMail: {
    type: String,
    required: true
  },
  senderAddress: {
    type: String,
    required: true
  },
  senderPhone: {
    type: String,
    required: true
  },
  recipientName: {
    type: String,
    required: true
  },
  recipientEmail: {
    type: String,
    required: true
  },
  recipientPhone: {
    type: String,
    required: true
  },
  recipientAddress: {
    type: String,
    required: trusted
  },
  departureDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Approved', 'In Transit', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  origin: {
    country: { type: String, required: true },
    state: { type: String, required: true },
  },
  originCity: {
    'type': String,
    'required': true
  },
  destination: {
    country: { type: String, required: true },
    state: { type: String, required: true },
  },
  destinationCity: {
    'type': String,
    'required': true
  },
  estimatedDelivery: {
    type: Date
  },
  currentLocation: {
    country: { type: String, required: true },
    state: { type: String, required: true },
  },
  currentCity: {
    'type': String,
    'required': true
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  payments: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Payment' 
  }],
  approvedByAdmin: { 
    type: Boolean, 
    default: false 
  },
  pickup_time: {
    type: Date
  },
  pickup_date: {
    type: Date
  },
  delivery_mode: {
    type: String,
    enum: ['Land', 'Sea', 'Air', 'Rail'],
    default: 'Land',
    required: true, // Add required if you want to make it a mandatory field
  },
  carrier: {
    type: String,
    enum: [
      'Ghana Post',
      'DHL',
      'FedEx',
      'UPS',
      'USPS',
      'TNT',
      'Aramex',
      'Delta Air Freight',
      'Emirates SkyCargo',
      'Cathay Pacific Cargo',
      'Korean Air Cargo',
      'Turkish Airlines Cargo',
      'Air France Cargo',
      'Cargolux',
      'China Airlines Cargo',
      'ANA Cargo',
      'Asiana Cargo',
      'EVA Air Cargo',
      'IAG Cargo',
      'KLM Cargo',
      'LATAM Cargo', 
      'Nippon Cargo Airlines',
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
      'Qantas Freight',
      'Qatar Airways Cargo',
      'Saudia Cargo',
      'Singapore Airlines Cargo',
      'South African Airways Cargo',
      'Swiss WorldCargo',
      'Thai Cargo',
      'Turkish Airlines Cargo',
      'United Cargo',
      'UPS Airlines',
      'Vietnam Airlines Cargo',
      'Virgin Atlantic Cargo',
      'Volga-Dnepr Airlines',
      'XiamenAir Cargo',
      'Yangtze River Express',
      'Zimex Aviation',
      'Other'
    ],
    default: 'Other',
    required: true
  },
  carrier_reference_number: {
    type: String
  },
  hs_code: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Icums',
    required: true
  },
  cifValue: {
    type: Number,
    required: true
  },
  import_duty_rate: {
    type: Number,
    default: 0
  },
  vatRate: {
    type: Number,
    default: 0
  },
  otherDutiesAndCharge: {
    type: Number,
    default: 0
  },
  totalCost: {
    type: Number,
    required: true
  },
}, { timestamps: true });

// Middleware to generate the courier ID before saving
shipmentSchema.pre('save', function (next) {
  const shipment = this;

  if (!shipment.trackingNumber){
  // Generate a unique ID using any desired method (e.g., UUID)
  shipment.trackingNumber = generateUniquetrackingNumber();
  }

  // Check if the carrier already has a reference number
  if (!carrierReferenceMapping[shipment.carrier]) {
    // Generate a unique reference number and store it in the mapping object
    carrierReferenceMapping[shipment.carrier] = generateUniqueCarrierReferenceNumber(shipment.carrier);
  }

  // Assign the generated reference number to the shipment
  shipment.carrier_reference_number = carrierReferenceMapping[shipment.carrier];

  next();
});

// Function to generate a unique courier ID (example using UUID)
function generateUniquetrackingNumber() {
  return 'COURIER_' + Math.random().toString(36).substring(2, 9);
}

// Carrier constant reference number generation
// Creating a mapping object carriers and their reference numbers
const carrierReferenceMapping = {};

// Function to generate a unique carrier reference number
function generateUniqueCarrierReferenceNumber(carrier) {
  return carrier + '_' + Math.random().toString(36).substring(2, 9);
}

const Shipment = mongoose.model('Shipment', shipmentSchema);

export default Shipment;