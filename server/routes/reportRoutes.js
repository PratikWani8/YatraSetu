import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  getOverview,
  getCharts,
  getRecentActivities,
} from "../controllers/reportController.js";

const router =
  express.Router();

router.use(protect);

/* Overview */
router.get(
  "/overview",
  getOverview
);

/* Charts */
router.get(
  "/charts",
  getCharts
);

/* Recent Activities */
router.get(
  "/recent-activities",
  getRecentActivities
);

export default router;