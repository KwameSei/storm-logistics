import mongoose from 'mongoose';

const overallStatsSchema = new mongoose.Schema({
    shipmentId: {
      type: String,
    },
    totalUsers: {
        type: Number,
        default: 0
    },
    totalUsersPerYear: {
        type: Number,
        default: 0
    },
    totalUsersPerMonth: {
      type: Number,
      default: 0
  },
    monthlyUsersData: [
      {
        month: {
          type: String,
          required: true
        },
        totalUsers: {
          type: Number,
          default: 0
        }
      }
    ],
    dailyUsersData: [
      {
        day: {
          type: String,
          required: true
        },
        totalUsers: {
          type: Number,
          default: 0
        }
      }
    ],
    totalUsersPerDay: {
        type: Number,
        default: 0
    },
    totalAdmins: {
        type: Number,
        default: 0
    },
    totalSuperAdmins: {
        type: Number,
        default: 0
    },
    totalShipments: {
        type: Number,
        default: 0
    },
    preferredCarrier: {
        type: String,
        default: ''
    },
    totalDeliveredShipments: {
        type: Number,
        default: 0
    },
    totalPendingShipments: {
        type: Number,
        default: 0
    },
    totalShipmentLocations: {
        type: Number,
        default: 0
    },
    totalSubShipmentCosts: {
        type: Number,
        default: 0
    },
    totalShipmentPayments: {
        type: Number,
        default: 0
    },
    totalShipmentTrackings: {
        type: Number,
        default: 0
    },
    yearlyPaymentTotal: {
      type: Number,
      default: 0
    },
    yearlyTotalPaidUnits: {
      type: Number,
      default: 0
    },
    year: {
      type: Number,
      default: 0
    },
    monthlyPaymentData: [
      {
        month: {
          type: String,
          required: true
        },
        totalPayment: {
          type: Number,
          default: 0
        },
        totalPaidUnits: {
          type: Number,
          default: 0
        },
        totalShipments: {
          type: Number,
          default: 0
        },
        totalShippingCost: {
          type: Number,
          default: 0
        }
      }
    ],
    dailyPaymentData: [
      {
        day: {
          type: String,
          required: true
        },
        totalPayment: {
          type: Number,
          default: 0
        },
        totalPaidUnits: {
          type: Number,
          default: 0
        }
      }
    ],
},
{
  timestamps: true
});

const OverallStats = mongoose.model('OverallStats', overallStatsSchema);

export default OverallStats;