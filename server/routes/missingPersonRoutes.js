import express from "express";
import upload from "../middleware/upload.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

import {
  reportMissingPerson,
  getAllMissingReports,
  getMissingReportById,
  updateMissingStatus,
  assignPoliceOfficer,
  markPersonFound,
  getMissingStatistics,
} from "../controllers/missingPersonController.js";

const router = express.Router();

router.post(
  "/report",
  protect,
  authorize("volunteer"),
  upload.single("photo"),
  reportMissingPerson
);

router.get(
  "/",
  protect,
  authorize(
    "volunteer",
    "police",
    "control_room",
    "admin",
    "super_admin"
  ),
  getAllMissingReports
);

router.get(
  "/statistics",
  protect,
  authorize(
    "volunteer",
    "police",
    "control_room",
    "admin",
    "super_admin"
  ),
  getMissingStatistics
);

router.get(
  "/:id",
  protect,
  authorize(
    "volunteer",
    "police",
    "control_room",
    "admin",
    "super_admin"
  ),
  getMissingReportById
);

router.put(
  "/:id/status",
  protect,
  authorize(
    "police",
    "control_room",
    "admin",
    "super_admin"
  ),
  updateMissingStatus
);

router.put(
  "/:id/assign",
  protect,
  authorize(
    "control_room",
    "admin",
    "super_admin"
  ),
  assignPoliceOfficer
);

router.put(
  "/:id/found",
  protect,
  authorize(
    "police",
    "control_room",
    "admin",
    "super_admin"
  ),
  markPersonFound
);

export default router;