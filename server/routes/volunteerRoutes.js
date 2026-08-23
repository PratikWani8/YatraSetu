import express from "express";
import upload from "../middleware/uploadVolunteer.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  getVolunteerProfile,
  updateVolunteerProfile,
  deleteVolunteerProfile,
} from "../controllers/volunteerController.js";

import { getVolunteerDashboard } from "../controllers/volunteerDashboardController.js";

const router = express.Router();

router.get(
  "/profile",
  protect,
  getVolunteerProfile
);

router.put(
  "/profile",
  protect,
  upload.fields([
    {
      name: "profilePhoto",
      maxCount: 1,
    },
    {
      name: "aadhaarDocument",
      maxCount: 1,
    },
    {
      name: "volunteerIdDocument",
      maxCount: 1,
    },
  ]),
  updateVolunteerProfile
);

router.delete(
  "/profile",
  protect,
  deleteVolunteerProfile
);

router.get(
  "/dashboard",
  protect,
  getVolunteerDashboard
);

export default router;