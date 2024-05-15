import express from "express";
import {
  approveAgent,
  registerAgent,
  loginAgent,
  getAgentProfile,
  getPendingAgents,
  forgotPassword,
  resetPassword,
  getAgentById,
  getAgents,
  getAgentGeographicalLocations,
  updateAgent,
  updateAgentProfileImage,
  updateAgentRole,
  deleteAgent,
  deleteAgentProfileImage,
} from "../controllers/agentController.js";

const router = express.Router();

router.post("/register-agent/:role", registerAgent);
router.post("/login-agent/:role", loginAgent);
router.get("/pending-agents", getPendingAgents);
router.put("/approve-agent/:id", approveAgent);
router.get("/agent-profile/:id", getAgentProfile);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resetToken", resetPassword);
router.get("/agent/:id", getAgentById);
router.get("/agents", getAgents);
router.get("/agent-geographical-locations", getAgentGeographicalLocations);
router.put("/agent/:id", updateAgent);
router.put("/agent-profile-image/:id", updateAgentProfileImage);
router.put("/agent-role/:id", updateAgentRole);
router.delete("/agent/:id", deleteAgent);
router.delete("/agent-profile-image/:id", deleteAgentProfileImage);

export default router;