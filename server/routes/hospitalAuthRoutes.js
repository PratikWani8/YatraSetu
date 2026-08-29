import express from "express";
import { registerHospital, loginHospital, getHospitalProfile } from "../controllers/hospitalAuthController.js";

const router = express.Router();

// Register Hospital
router.post("/register", registerHospital);

// Login Hospital
router.post("/login", loginHospital);

router.get("/profile", getHospitalProfile)

export default router;