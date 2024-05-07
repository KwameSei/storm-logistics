import express from 'express';

import {
  createShipmentStat,
  findAllShipmentStats,
  findOneShipmentStat,
  updateShipmentStat,
  removeShipmentStat,
  removeAllShipmentStats,
  findAllByShipmentId,
  findAllByYear,
  findAllByMonth,
  findAllByDate,
  findAllByHour
} from '../controllers/shipmentStatController.js';

const router = express.Router();

router.post('/create-shipment-stat', createShipmentStat);
router.get('/get-all-shipment-stats', findAllShipmentStats);
router.get('/get-single-shipment-stat/:id', findOneShipmentStat);
router.put('/update-shipment-stat/:id', updateShipmentStat);
router.delete('/delete-shipment-stat/:id', removeShipmentStat);
router.delete('/delete-all-shipment-stats', removeAllShipmentStats);
router.get('/get-all-by-shipment-id/:shipmentId', findAllByShipmentId);
router.get('/get-all-by-year/:year', findAllByYear);
router.get('/get-all-by-month/:month', findAllByMonth);
router.get('/get-all-by-date/:date', findAllByDate);
router.get('/get-all-by-hour/:hour', findAllByHour);

export default router;
