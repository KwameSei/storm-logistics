import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  forgotPassword,
  resetPassword,
  getAdminById,
  getAdmins,
  getAdminGeographicalLocations,
  updateAdmin,
  updateAdminProfileImage,
  updateAdminRole,
  deleteAdmin,
  deleteAdminProfileImage,
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/register-admin/:role", registerAdmin);
router.post("/login-admin/:role", loginAdmin);
router.get("/admin-profile/:id", getAdminProfile);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resetToken", resetPassword);
router.get("/admin/:id", getAdminById);
router.get("/admins", getAdmins);
router.get("/admin-geographical-locations", getAdminGeographicalLocations);
router.put("/admin/:id", updateAdmin);
router.put("/admin-profile-image/:id", updateAdminProfileImage);
router.put("/admin-role/:id", updateAdminRole);
router.delete("/admin/:id", deleteAdmin);
router.delete("/admin-profile-image/:id", deleteAdminProfileImage);

export default router;