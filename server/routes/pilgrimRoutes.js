import express from "express";
import upload from "../middleware/upload.js";
import { protect } from "../middleware/authMiddleware.js";

import {
  registerPilgrim,
  checkAadhaar,
  getAllPilgrims,
  getPilgrimById,
  updatePilgrim,
  deletePilgrim,
  getPilgrimDashboard,
} from "../controllers/pilgrimController.js";

const router = express.Router();

router.post(
  "/register",
  protect,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "aadhaarImage", maxCount: 1 },
  ]),
  registerPilgrim
);

router.post("/check-aadhaar", checkAadhaar);

router.get("/", getAllPilgrims);

router.get("/dashboard", protect, getPilgrimDashboard);

router.get("/:id", getPilgrimById);

router.put(
  "/:id",
  upload.fields([
    {
      name: "photo",
      maxCount: 1,
    },
    {
      name: "aadhaarImage",
      maxCount: 1,
    },
  ]),
  updatePilgrim
);

router.delete("/:id", deletePilgrim);

export default router;