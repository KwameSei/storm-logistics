import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import morgan from 'morgan';
import bodyParser from 'body-parser';
import helmet from 'helmet';

import userRoutes from './routes/userRoutes.js';
import shipmentRoutes from './routes/shipmentRoutes.js';
import superAdminRoutes from './routes/superadminRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import courierLocationRoutes from './routes/courierLocationRoutes.js';
import icumsRoutes from './routes/icumsRoutes.js';
import shipmentStatRoutes from './routes/shipmentStatRoutes.js';

dotenv.config();

const app = express();

// Middleswares
app.use(cors());
app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
// app.use(morgan('common'))

// Routes
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// });

app.use('/api/users', userRoutes);
app.use('/api/shipment', shipmentRoutes);
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/shipment-location', courierLocationRoutes);
app.use('/api/icums', icumsRoutes);
app.use('/api/shipment-stat', shipmentStatRoutes);

export default app;