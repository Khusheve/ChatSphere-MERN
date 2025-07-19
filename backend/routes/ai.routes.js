import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { aiReply } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/reply", protectRoute, aiReply);

export default router;
