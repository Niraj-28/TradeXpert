import express from "express";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { registerUser, loginUser } = require("../controllers/authController.cjs");

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

export default router;