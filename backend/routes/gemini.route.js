import express from "express";
import { askGemini } from "../controllers/gemini.controller.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, askGemini);

export default router;
