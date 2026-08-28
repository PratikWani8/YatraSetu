import express from "express";
import { registerNGO, loginNGO, getVolunteers, } from "../controllers/ngoController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerNGO);
router.post("/login", loginNGO);

router.get(
  "/volunteers",
  protect,
  getVolunteers
);

export default router;