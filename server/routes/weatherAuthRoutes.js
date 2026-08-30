import express from "express";

import {
  registerWeatherOfficer,
  loginWeatherOfficer,
  getWeatherOfficerProfile,
} from "../controllers/weatherAuthController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* Register */

router.post(
  "/register",
  registerWeatherOfficer
);

/* Login */

router.post(
  "/login",
  loginWeatherOfficer
);

/* Profile */

router.get(
  "/profile",
  protect,
  authorize("weather_officer"),
  getWeatherOfficerProfile
);

export default router;