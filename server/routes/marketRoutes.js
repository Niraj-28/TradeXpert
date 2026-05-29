import express from "express";

import { searchInstruments } from "../services/instrumentService.mjs";

const router = express.Router();

router.get(
  "/search",
  (req, res) => {
    const query = req.query.q;

    const results =
      searchInstruments(query);

    res.json(results);
  }
);

export default router;