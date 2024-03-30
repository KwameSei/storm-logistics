import express from 'express';
import { loginSuperAdmin, registerSuperAdmin } from '../controllers/superadminController.js';

const router = express.Router();

router.post('/register-superadmin/:role', registerSuperAdmin);
router.post('/login-superadmin/:role', loginSuperAdmin);

export default router;