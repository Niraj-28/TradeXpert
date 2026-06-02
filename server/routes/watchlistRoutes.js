import express from "express";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { getWatchlist, addToWatchlist, removeFromWatchlist } = require("../controllers/watchlistController.cjs");
const protect = require("../middleware/authMiddleware.cjs");

const router = express.Router();

router.get("/", protect, getWatchlist);
router.post("/", protect, addToWatchlist);
router.delete("/:id", protect, removeFromWatchlist);

export default router;