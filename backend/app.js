import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import userRoutes from './routes/userRoutes.js';
import shipmentRoutes from './routes/shipmentRoutes.js';

dotenv.config();

const app = express();

// Middleswares
app.use(cors());
app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))

// Routes
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// });

app.use('/api/users', userRoutes);
app.use('/api/shipment', shipmentRoutes);


export default app;