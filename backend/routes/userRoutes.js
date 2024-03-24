import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/register-user/:role', registerUser);
router.post('/login-user/:role', loginUser);

export default router;