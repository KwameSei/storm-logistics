import express from 'express';
import {
  createLocation,
  getAllLocations,
  getLocationById,
  updateLocationById,
  deleteLocationById
} from '../controllers/locationController.js';

const router = express.Router();

router.post('/create-location', createLocation);
router.put('/update-location/:id', updateLocationById);
router.get('/get-all-locations', getAllLocations);
router.get('/get-location/:id', getLocationById);
router.delete('/delete-location/:id', deleteLocationById);

export default router;