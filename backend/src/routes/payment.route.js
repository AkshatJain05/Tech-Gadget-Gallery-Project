import express from "express";
import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ✅ Create Order
router.post("/create-order", auth,async (req, res) => {
  
});

export default router;
