import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  // updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/register-user/:role', registerUser);
router.post('/login-user/:role', loginUser);
router.get('/user-profile', getUserProfile);
// router.put('/update-user-profile', updateUserProfile);
router.get('/get-all-users', getUsers);
router.delete('/delete-user/:id', deleteUser);
router.get('/get-user/:id', getUserById);
router.put('/update-user/:id', updateUser);


export default router;