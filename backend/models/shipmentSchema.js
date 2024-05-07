import mongoose, { trusted } from "mongoose";
import ShipmentStat from './shipmentStatSchema.js';
import OverallStats from "./overallStats.js";

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

// Middleware to update shipment statistics
shipmentSchema.post('save', async function (shipment) {
  try {
    // Find the shipment statistics by shipment ID
    const shipmentStat = await ShipmentStat.findOneAndUpdate(
      { year: new Date().getFullYear(), shipmentId: shipment._id },
      {
        $inc: {
          yearly_sales_total: shipment.totalCost,
          yearly_total_sold_units: shipment.quantity
        },
        $addToSet: {
          'monthly_data': {
            month: getMonthName(new Date().getMonth()),
            monthly_sales_total: shipment.totalCost,
            monthly_total_sold_units: shipment.quantity
          },
          'daily_data': {
            date: formatDate(new Date()),
            daily_sales_total: shipment.totalCost,
            daily_total_sold_units: shipment.quantity
          },
          'hourly_data': {
            hour: new Date().getHours().toString(),
            hourly_sales_total: shipment.totalCost,
            hourly_total_sold_units: shipment.quantity
          }
        }
      },
      { upsert: true, new: true }
    );

    // Save the updated shipment statistics
    await shipmentStat.save();
  } catch (error) {
    console.error("Error updating shipment statistics:", error);
    error.status(500).json({
      success: false,
      status: 500,
      message: error.message
    });
  }
});

// Middleware to update shipment statistics after deleting a shipment
shipmentSchema.post('remove', async function (shipment) {
  try {
    // Find the shipment statistics by shipment ID
    const shipmentStat = await ShipmentStat.findOneAndUpdate(
      { year: new Date().getFullYear(), shipmentId: shipment._id },
      {
        $inc: {
          yearly_sales_total: -shipment.totalCost,
          yearly_total_sold_units: -shipment.quantity
        },
        $pull: {
          'monthly_data': { month: getMonthName(new Date().getMonth()) },
          'daily_data': { date: formatDate(new Date()) },
          'hourly_data': { hour: new Date().getHours().toString() }
        }
      },
      { new: true } // Return the modified document rather than the original
    );

    // Save the updated shipment statistics
    await shipmentStat.save();
  } catch (error) {
    console.error("Error updating shipment statistics after deleting shipment:", error);
    error.status(500).json({
      success: false,
      status: 500,
      message: error.message
    });
  }
});

// Get month name
const getMonthName = (monthIndex) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return months[monthIndex];
};

// Format date as 'DD/MM/YYYY'
const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

// Middleware to update overall statistics
shipmentSchema.post('save', async function (shipment) {
  try {
    // Get the current year
    const currentYear = new Date().getFullYear();
    
    // Find or create the overall statistics document for the current year
    let overallStats = await OverallStats.findOne({ year: currentYear });
    
    if (!overallStats) {
      overallStats = new OverallStats({
        year: currentYear,
        totalShipments: 0,  // Initialize the total shipments to 0
        totalSubShipmentCosts: shipment.shippingCost,
        totalShipmentPayments: shipment.totalCost,
        totalShipmentTrackings: 1,
        yearlyPaymentTotal: shipment.totalCost,
        yearlyTotalPaidUnits: shipment.quantity,

        monthlyPaymentData: [
          {
            month: getMonthName(new Date().getMonth()),
            totalPayment: shipment.totalCost,
            totalPaidUnits: shipment.quantity,
            totalShipments: shipment.quantity,
            totalShippingCost: shipment.shippingCost
          }
        ],

        dailyPaymentData: [
          {
            day: formatDate(new Date()),
            totalPayment: shipment.totalCost,
            totalPaidUnits: shipment.quantity,
            totalShipments: shipment.quantity,
            totalShippingCost: shipment.shippingCost
          }
        ]
      });
    } else {
      // Update the overall statistics document for the current year
      overallStats.totalShipments += 1;
      overallStats.totalSubShipmentCosts += shipment.shippingCost;
      overallStats.totalShipmentPayments += shipment.totalCost;
      overallStats.totalShipmentTrackings += 1;
      overallStats.yearlyPaymentTotal += shipment.totalCost;
      overallStats.yearlyTotalPaidUnits += shipment.quantity;

      // Check if the monthly data for the current month already exists
      const currentMonthData = overallStats.monthlyPaymentData.find(data => data.month === getMonthName(new Date().getMonth()));

      if (currentMonthData) {
        // Update the monthly data for the current month
        currentMonthData.totalPayment += shipment.totalCost;
        currentMonthData.totalPaidUnits += shipment.quantity;
        currentMonthData.totalShipments += shipment.quantity;
        currentMonthData.totalShippingCost += shipment.shippingCost;
      } else {
        // Add the monthly data for the current month
        overallStats.monthlyPaymentData.push({
          month: getMonthName(new Date().getMonth()),
          totalPayment: shipment.totalCost,
          totalPaidUnits: shipment.quantity,
          totalShipments: shipment.quantity,
          totalShippingCost: shipment.shippingCost
        });
      }

      // Check if the daily data for the current day already exists
      const currentDayData = overallStats.dailyPaymentData.find(data => data.day === formatDate(new Date()));

      if (currentDayData) {
        // Update the daily data for the current day
        currentDayData.totalPayment += shipment.totalCost;
        currentDayData.totalPaidUnits += shipment.quantity;
        currentDayData.totalShipments += shipment.quantity;
        currentDayData.totalShippingCost += shipment.shippingCost;
      } else {
        // Add the daily data for the current day
        overallStats.dailyPaymentData.push({
          day: formatDate(new Date()),
          totalPayment: shipment.totalCost,
          totalPaidUnits: shipment.quantity,
          totalShipments: shipment.quantity,
          totalShippingCost: shipment.shippingCost
        });
      }
    }

    // Save the updated overall statistics
    await overallStats.save();
  } catch (error) {
    console.error("Error updating overall statistics:", error);
    error.status(500).json({
      success: false,
      status: 500,
      message: error.message
    });
  }
});

// Middleware to update overall statistics after deleting a shipment
shipmentSchema.post('remove', async function (shipment) {
  try {
    // Get the current year
    const currentYear = new Date().getFullYear();
    
    // Find the overall statistics document for the current year
    let overallStats = await OverallStats.findOne({ year: currentYear });
    
    if (overallStats) {
      // Update the overall statistics document for the current year
      overallStats.totalShipments -= 1;
      overallStats.totalSubShipmentCosts -= shipment.shippingCost;
      overallStats.totalShipmentPayments -= shipment.totalCost;
      overallStats.totalShipmentTrackings -= 1;
      overallStats.yearlyPaymentTotal -= shipment.totalCost;
      overallStats.yearlyTotalPaidUnits -= shipment.quantity;

      // Check if the monthly data for the current month already exists
      const currentMonthData = overallStats.monthlyPaymentData.find(data => data.month === getMonthName(new Date().getMonth()));

      if (currentMonthData) {
        // Update the monthly data for the current month
        currentMonthData.totalPayment -= shipment.totalCost;
        currentMonthData.totalPaidUnits -= shipment.quantity;
        currentMonthData.totalShipments -= shipment.quantity;
        currentMonthData.totalShippingCost -= shipment.shippingCost;
      }

      // Check if the daily data for the current day already exists
      const currentDayData = overallStats.dailyPaymentData.find(data => data.day === formatDate(new Date()));

      if (currentDayData) {
        // Update the daily data for the current day
        currentDayData.totalPayment -= shipment.totalCost;
        currentDayData.totalPaidUnits -= shipment.quantity;
        currentDayData.totalShipments -= shipment.quantity;
        currentDayData.totalShippingCost -= shipment.shippingCost;
      }

      // Save the updated overall statistics
      await overallStats.save();
    }
  } catch (error) {
    console.error("Error updating overall statistics after deleting shipment:", error);
    error.status(500).json({
      success: false,
      status: 500,
      message: error.message
    });
  }
});

const Shipment = mongoose.model('Shipment', shipmentSchema);

export default Shipment;