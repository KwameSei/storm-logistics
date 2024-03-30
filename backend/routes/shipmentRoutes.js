import express from 'express';
import {
  createShipment,
  trackShipment,
  getAllShipments,
  getShipmentById,
  updateShipment,
  deleteShipmentById,
  updateCurrentLocation
} from '../controllers/shipmentController.js';

const router = express.Router();

router.post('/create-shipment', createShipment);
router.get('/track/:trackingNumber', trackShipment);
router.get('/get-all-shipments', getAllShipments);
router.get('/get-Shipment-byId/:id', getShipmentById);
router.put('/update-shipment/:id', updateShipment);
router.put('/update-current-location/:trackingNumber', updateCurrentLocation);
router.delete('/delete-shipment/:id', deleteShipmentById);

export default router;