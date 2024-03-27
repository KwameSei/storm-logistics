import express from 'express';
import { createShipment } from '../controllers/shipmentController.js';

const router = express.Router();

router.post('/create-shipment', createShipment);

export default router;