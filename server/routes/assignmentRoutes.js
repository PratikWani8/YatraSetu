import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  getAssignments,
  updateAssignmentStatus,
} from "../controllers/assignmentController.js";

const router = express.Router();

router.use(protect);

router.get(
  "/",
  getAssignments
);

router.patch(
  "/:id/status",
  updateAssignmentStatus
);

export default router;