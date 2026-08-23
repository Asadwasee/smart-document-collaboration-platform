import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  createDocument,
  deleteDocument,
  getDocumentById,
  getDocumentVersions,
  getDocumentsByWorkspace,
  restoreDocumentVersion,
  updateDocument,
} from "../controllers/documentController.js";

const router = Router();

router.use(requireAuth);

router.post("/", createDocument);
router.get("/workspace/:workspaceId", getDocumentsByWorkspace);
router.get("/:id", getDocumentById);
router.get("/:id/versions", getDocumentVersions);
router.post("/:id/versions/:versionId/restore", restoreDocumentVersion);
router.patch("/:id", updateDocument);
router.delete("/:id", deleteDocument);

export default router;
