import express from "express";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const protect = require("../middleware/authMiddleware.cjs");
const { getHoldings } = require("../controllers/holdingController.cjs");

const router = express.Router();

router.get("/", protect, getHoldings);

export default router;