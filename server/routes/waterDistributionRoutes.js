import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  createWaterDistribution,
  getWaterDistributions,
  getWaterDistribution,
  updateWaterDistribution,
  deleteWaterDistribution,
} from "../controllers/waterDistributionController.js";

const router = express.Router();

router.use(protect);

/* Create */

router.post(
  "/",
  createWaterDistribution
);

/* Get All */

router.get(
  "/",
  getWaterDistributions
);

/* Get Single */

router.get(
  "/:id",
  getWaterDistribution
);

/* Update */

router.put(
  "/:id",
  updateWaterDistribution
);

/* Delete */

router.delete(
  "/:id",
  deleteWaterDistribution
);

export default router;