import express from "express";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const authMiddleware = require("../middleware/authMiddleware.cjs");
const { placeTrade, getTrades } = require("../controllers/tradeController.cjs");

const router = express.Router();

// PLACE TRADE
router.post("/place", authMiddleware, placeTrade);

// GET TRADES
router.get("/history", authMiddleware, getTrades);

export default router;