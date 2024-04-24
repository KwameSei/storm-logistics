import express from 'express';
import {
  approveShipment,
  createShipment,
  trackShipment,
  getAllShipments,
  getShipmentById,
  updateShipment,
  deleteShipmentById,
  updateCurrentLocation,
  getPendingShipments
} from '../controllers/shipmentController.js';

import { calculateShipmentCost } from '../utils/calculateShipmentCost.js';

import { superAdminAuth, userAuth, authorization } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-shipment', userAuth, superAdminAuth, authorization(['SuperAdmin', 'User']), createShipment);
router.get('/track/:trackingNumber', trackShipment);
router.get('/get-all-shipments', getAllShipments);
router.get('/get-shipment-byId/:id', getShipmentById);
router.get('/get-pending-shipments', superAdminAuth, authorization(['SuperAdmin']), getPendingShipments);
// router.put('/approve-shipment/:id', superAdminAuth, authorization(['SuperAdmin']), approveShipment);
router.put('/approve-shipment/:id', approveShipment);
router.put('/update-shipment/:id', updateShipment);
router.put('/update-current-location/:trackingNumber', superAdminAuth, authorization(['SuperAdmin']), updateCurrentLocation);
router.delete('/delete-shipment/:id', deleteShipmentById);
router.post('/calculate-shipment-cost', calculateShipmentCost);

export default router;