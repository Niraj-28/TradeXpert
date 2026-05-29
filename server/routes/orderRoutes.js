import express from "express";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const protect = require("../middleware/authMiddleware.cjs");
const { placeOrder, getOrders } = require("../controllers/orderController.cjs");

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/", protect, getOrders);

export default router;