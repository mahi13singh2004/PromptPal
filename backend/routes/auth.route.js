import express from "express";
import {
  signup,
  login,
  logout,
  checkAuth,
  updateAssistantDetails,
} from "../controllers/auth.controller.js";
import verifyToken from "../middlewares/verifyToken.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/checkAuth", verifyToken, checkAuth);
router.put(
  "/update-assistant",
  verifyToken,
  upload.single("assistantImage"),
  updateAssistantDetails
);
export default router;
