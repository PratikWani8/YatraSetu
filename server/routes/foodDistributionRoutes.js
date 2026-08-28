import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  createFoodDistribution,
  getFoodDistributions,
  getFoodDistribution,
  updateFoodDistribution,
  deleteFoodDistribution,
} from "../controllers/foodDistributionController.js";

const router = express.Router();

router.use(protect);

/* Create */

router.post(
  "/",
  createFoodDistribution
);

/* Get All */

router.get(
  "/",
  getFoodDistributions
);

/* Get Single */

router.get(
  "/:id",
  getFoodDistribution
);

/* Update */

router.put(
  "/:id",
  updateFoodDistribution
);

/* Delete */

router.delete(
  "/:id",
  deleteFoodDistribution
);

export default router;