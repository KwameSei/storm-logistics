import express from 'express';

import {
  createShipmentLocation,
  getAllShipmentLocations,
  getShipmentLocationById,
  updateShipmentLocationById,
  deleteShipmentLocationById
} from '../controllers/courierLocationController.js';

const router = express.Router();

router.post('/create-shipment-location', createShipmentLocation);
router.put('/update-shipment-location', updateShipmentLocationById);
router.get('/get-all-shipment-locations', getAllShipmentLocations);
router.get('/get-shipment-location/:id', getShipmentLocationById);
router.delete('/delete-shipment-location/:id', deleteShipmentLocationById)

export default router;