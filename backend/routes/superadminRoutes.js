import express from 'express';
import {
  loginSuperAdmin,
  registerSuperAdmin,
  getAllSuperAdmins,
  getSingleSuperAdmin
} from '../controllers/superadminController.js';

const router = express.Router();

router.post('/register-superadmin/:role', registerSuperAdmin);
router.post('/login-superadmin/:role', loginSuperAdmin);
router.get('/get-all-superadmins', getAllSuperAdmins);
router.get('/get-single-superadmin/:id', getSingleSuperAdmin);

export default router;