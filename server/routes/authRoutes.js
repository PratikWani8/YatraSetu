import express from "express";

import {
  register,
  registerVolunteer,
  login,
  volunteerLogin,
  getMe,
  logout,
} from "../controllers/authController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* Public */
router.post("/register", register);
router.post("/login", login);
router.post("/volunteer/register", registerVolunteer);
router.post("/volunteer/login", volunteerLogin);

/* Protected */
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

export default router;