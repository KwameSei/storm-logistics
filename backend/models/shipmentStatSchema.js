import mongoose from 'mongoose';

const shipmentStatSchema = new mongoose.Schema({
  shipmentId: String,
  yearly_sales_total: Number,
  yearly_total_sold_units: Number,
  year: Number,
  monthly_data: [
    {
      month: String,
      monthly_sales_total: Number,
      monthly_total_sold_units: Number
    }
  ],
  daily_data: [
    {
      date: String,
      daily_sales_total: Number,
      daily_total_sold_units: Number
    }
  ],
  hourly_data: [
    {
      hour: String,
      hourly_sales_total: Number,
      hourly_total_sold_units: Number
    }
  ]
}, {
  timestamps: true
});

const ShipmentStat = mongoose.model('ShipmentStat', shipmentStatSchema);

export default ShipmentStat;