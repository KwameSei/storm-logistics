import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please enter your username'],
    unique: true,
    minlength: [3, 'Username should be at least 3 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email address'],
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be at least 6 characters']
  },
  address: {
    type: String
  },
  phone: {
    type: String,
  },
  role: {
    type: String,
    default: 'User'
  },
  image: {
    url: String,
    public_id: String
  },
  image_mimetype: String
}, {
  timestamps: true
})

const User = mongoose.model('User', userSchema)

export default User;