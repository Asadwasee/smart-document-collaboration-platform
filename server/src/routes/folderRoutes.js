import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  createFolder,
  deleteFolder,
  getFolderById,
  getFoldersByWorkspace,
  updateFolder,
} from "../controllers/folderController.js";

const router = Router();

router.use(requireAuth);

router.post("/", createFolder);
router.get("/workspace/:workspaceId", getFoldersByWorkspace);
router.get("/:id", getFolderById);
router.patch("/:id", updateFolder);
router.delete("/:id", deleteFolder);

export default router;
