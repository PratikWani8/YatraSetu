import express from "express";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

import {
  scanQRCode,
  getMyScans,
  getAllScans,
  qrStats,
} from "../controllers/qrScanController.js";

const router = express.Router();

// Scan QR 
router.get(
  "/scan/:pilgrimId",
  protect,
  authorize(
    "volunteer",
    "medical",
    "police",
    "admin",
    "control_room"
  ),
  scanQRCode
);

// My History 
router.get(
  "/my-history",
  protect,
  authorize("volunteer"),
  getMyScans
);

// Admin History 
router.get(
  "/history",
  protect,
  authorize(
    "admin",
    "control_room",
    "super_admin"
  ),
  getAllScans
);

// Statistics 
router.get(
  "/stats",
  protect,
  authorize(
    "admin",
    "control_room",
    "super_admin"
  ),
  qrStats
);

export default router;