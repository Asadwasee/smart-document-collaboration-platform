import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  addWorkspaceMember,
  createWorkspace,
  deleteWorkspace,
  getWorkspaceById,
  getWorkspaces,
  removeWorkspaceMember,
  updateWorkspace,
  updateWorkspaceMemberRole,
} from "../controllers/workspaceController.js";

const router = Router();

router.use(requireAuth);

router.post("/", createWorkspace);
router.get("/", getWorkspaces);
router.get("/:id", getWorkspaceById);
router.patch("/:id", updateWorkspace);
router.delete("/:id", deleteWorkspace);
router.post("/:id/members", addWorkspaceMember);
router.patch("/:id/members/:memberId", updateWorkspaceMemberRole);
router.delete("/:id/members/:memberId", removeWorkspaceMember);

export default router;
