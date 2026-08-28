import express from "express";
import { uploadFile, deleteFile } from "../controllers/fileController.js";
import { upload } from "../config/cloudinary.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/upload", protect, upload.single("file"), uploadFile);
router.post("/delete", protect, deleteFile);

export default router;