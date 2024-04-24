import mongoose from "mongoose";

const icumsSchema = new mongoose.Schema({
  hs_code: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
  },
  hs_head_code: {
    type: String,
    required: true
  },
  qty_unit_code: {
    type: String,
  },
  import_duty_rate: {
    type: Number,
  },
  import_duty_vat: {
    type: Number,
  },
  import_duty_excise: {
    type: Number,
  },
  export_duty_rate: {
    type: Number,
  },
  nhil_rate: {
    type: Number,
  },
}, {timestamps: true});

const Icums = mongoose.model("Icums", icumsSchema);

export default Icums;