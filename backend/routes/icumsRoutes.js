import express from 'express';
import {
  getAllIcums,
  getSingleIcums,
  createIcums,
  updateIcums,
  deleteIcums,
  // calculateImportDuty
} from '../controllers/icumsController.js';

const router = express.Router();

router.get('/get-all-icums', getAllIcums);
router.get('/get-single-icums/:hsCode', getSingleIcums);
router.post('/create-icums', createIcums);
router.put('/update-icums/:hsCode', updateIcums);
router.delete('/delete-icums/:hsCode', deleteIcums);
// router.post('/calculate-duty', calculateImportDuty);

export default router;