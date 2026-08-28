import express from "express";
import {
  createComment,
  getComments,
  resolveComment,
  deleteComment,
} from "../controllers/commentController.js";
// Note: Aliyan ke auth middleware se `protect` import karein
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createComment);
router.get("/document/:documentId", protect, getComments);
router.patch("/:id/resolve", protect, resolveComment);
router.delete("/:id", protect, deleteComment);

export default router;