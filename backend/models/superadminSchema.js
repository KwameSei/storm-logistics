import mongoose from "mongoose";

const superadminSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required']
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  phone: {
    type: String,
  },
  image: {
    url: String,
    public_id: String
  },
  image_mimetype: String,
  role: {
    type: String,
    default: 'SuperAdmin'
  }
},
{
  timestamps: true
});

const SuperAdmin = mongoose.model('superadmin', superadminSchema);

export default SuperAdmin;