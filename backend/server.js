import app from './app.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5050;
const DATABASE = process.env.DB_URL;

// Connect to MongoDB
mongoose.connect(DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to mongoDB');

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  });
}).catch((error) => {
  console.log(error.message)
})

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });