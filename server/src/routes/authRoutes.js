import { Router } from "express";
import {
  forgotPassword,
  getCurrentUser,
  login,
  logout,
  logoutAllSessions,
  refreshSession,
  resendVerificationEmail,
  resetPassword,
  signup,
  verifyEmail,
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/refresh", refreshSession);
router.post("/logout", logout);
router.post("/logout-all", requireAuth, logoutAllSessions);
router.get("/me", requireAuth, getCurrentUser);

export default router;
