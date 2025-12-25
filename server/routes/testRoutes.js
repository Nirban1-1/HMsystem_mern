// routes/testRoutes.js
import express from "express";
import { searchTests } from "../controllers/testController.js";

const router = express.Router();

// make search public so autosuggest works without needing auth token
router.get("/search", searchTests);
export default router;
