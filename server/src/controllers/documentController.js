import { Document } from "../models/Document.js";
import { Folder } from "../models/Folder.js";
import { DocumentVersion } from "../models/DocumentVersion.js";
import { createDocumentSnapshot } from "../utils/documentVersioning.js";
import { PermissionActions } from "../utils/permissions.js";
import { assertWorkspaceAccess } from "../utils/workspaceAccess.js";
import { badRequest, isNonEmptyString, isValidObjectId, notFound } from "../utils/validation.js";

const assertFolderInWorkspace = async (folderId, workspaceId) => {
  const folder = await Folder.findOne({ _id: folderId, workspace: workspaceId });

  if (!folder) {
    throw notFound("Folder not found in this workspace.");
  }

  return folder;
};

export const createDocument = async (req, res, next) => {
  try {
    const { title, content = "", workspaceId, folderId = null } = req.body;

    if (!isNonEmptyString(title)) {
      throw badRequest("Document title is required.");
    }

    if (!isNonEmptyString(workspaceId) || !isValidObjectId(workspaceId)) {
      throw badRequest("Valid workspaceId is required.");
    }

    if (typeof content !== "string") {
      throw badRequest("content must be a string.");
    }

    await assertWorkspaceAccess(workspaceId, req.user.id, PermissionActions.DOCUMENT_CREATE);

    let folder = null;
    if (folderId !== null) {
      if (!isNonEmptyString(folderId) || !isValidObjectId(folderId)) {
        throw badRequest("Invalid folderId.");
      }

      folder = await assertFolderInWorkspace(folderId, workspaceId);
    }

    const document = await Document.create({
      title: title.trim(),
      content,
      workspace: workspaceId,
      folder: folder ? folder._id : null,
      owner: req.user.id,
    });

    console.log("Document before snapshot:", {
  id: document._id,
  title: document.title,
  content: document.content,
  workspace: document.workspace,
  folder: document.folder,
});

await createDocumentSnapshot({
  document,
  changedBy: req.user.id,
  changeType: "create",
});

    return res.status(201).json({ document });
  } catch (error) {
    next(error);
  }
};

export const getDocumentsByWorkspace = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;

    if (!isValidObjectId(workspaceId)) {
      throw badRequest("Invalid workspace id.");
    }

    await assertWorkspaceAccess(workspaceId, req.user.id, PermissionActions.DOCUMENT_READ);

    const documents = await Document.find({ workspace: workspaceId }).sort({ updatedAt: -1 });
    return res.json({ documents });
  } catch (error) {
    next(error);
  }
};

export const getDocumentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      throw badRequest("Invalid document id.");
    }

    const document = await Document.findById(id);
    if (!document) {
      throw notFound("Document not found.");
    }

    await assertWorkspaceAccess(document.workspace, req.user.id, PermissionActions.DOCUMENT_READ);

    return res.json({ document });
  } catch (error) {
    next(error);
  }
};

export const updateDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, folderId } = req.body;

    if (!isValidObjectId(id)) {
      throw badRequest("Invalid document id.");
    }

    const document = await Document.findById(id);
    if (!document) {
      throw notFound("Document not found.");
    }

    await assertWorkspaceAccess(document.workspace, req.user.id, PermissionActions.DOCUMENT_UPDATE);

    const allowedFields = ["title", "content", "folderId"];
    const requestKeys = Object.keys(req.body || {});

    if (requestKeys.length === 0) {
      throw badRequest("At least one field is required for update.");
    }

    const invalidKey = requestKeys.find((key) => !allowedFields.includes(key));
    if (invalidKey) {
      throw badRequest(`Unsupported field: ${invalidKey}`);
    }

    let hasChange = false;

    if (title !== undefined) {
      if (!isNonEmptyString(title)) {
        throw badRequest("Document title cannot be empty.");
      }

      const normalizedTitle = title.trim();
      if (document.title !== normalizedTitle) {
        document.title = normalizedTitle;
        hasChange = true;
      }
    }

    if (content !== undefined) {
      if (typeof content !== "string") {
        throw badRequest("content must be a string.");
      }

      if (document.content !== content) {
        document.content = content;
        hasChange = true;
      }
    }

    if (folderId !== undefined) {
      if (folderId === null) {
        if (document.folder !== null) {
          document.folder = null;
          hasChange = true;
        }
      } else {
        if (!isNonEmptyString(folderId) || !isValidObjectId(folderId)) {
          throw badRequest("Invalid folderId.");
        }

        const folder = await assertFolderInWorkspace(folderId, document.workspace);
        const currentFolderId = document.folder ? document.folder.toString() : null;
        if (currentFolderId !== folder._id.toString()) {
          document.folder = folder._id;
          hasChange = true;
        }
      }
    }

    if (!hasChange) {
      return res.json({ document, message: "No changes detected." });
    }

    await document.save();

    await createDocumentSnapshot({
      document,
      changedBy: req.user.id,
      changeType: "update",
    });

    return res.json({ document });
  } catch (error) {
    next(error);
  }
};

export const deleteDocument = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      throw badRequest("Invalid document id.");
    }

    const document = await Document.findById(id);
    if (!document) {
      throw notFound("Document not found.");
    }

    await assertWorkspaceAccess(document.workspace, req.user.id, PermissionActions.DOCUMENT_DELETE);

    await DocumentVersion.deleteMany({ document: document._id });
    await document.deleteOne();
    return res.json({ message: "Document deleted successfully." });
  } catch (error) {
    next(error);
  }
};

export const getDocumentVersions = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      throw badRequest("Invalid document id.");
    }

    const document = await Document.findById(id);
    if (!document) {
      throw notFound("Document not found.");
    }

    await assertWorkspaceAccess(document.workspace, req.user.id, PermissionActions.DOCUMENT_READ);

    const versions = await DocumentVersion.find({ document: document._id })
      .select("versionNumber changeType changedBy sourceVersion createdAt")
      .populate("changedBy", "name email")
      .sort({ versionNumber: -1 });

    return res.json({ versions });
  } catch (error) {
    next(error);
  }
};

export const restoreDocumentVersion = async (req, res, next) => {
  try {
    const { id, versionId } = req.params;

    if (!isValidObjectId(id) || !isValidObjectId(versionId)) {
      throw badRequest("Invalid document/version id.");
    }

    const document = await Document.findById(id);
    if (!document) {
      throw notFound("Document not found.");
    }

    await assertWorkspaceAccess(document.workspace, req.user.id, PermissionActions.DOCUMENT_UPDATE);

    const version = await DocumentVersion.findOne({ _id: versionId, document: document._id });

    if (!version) {
      throw notFound("Version not found for this document.");
    }

    if (version.snapshot.folder) {
      await assertFolderInWorkspace(version.snapshot.folder, document.workspace);
    }

    document.title = version.snapshot.title;
    document.content = version.snapshot.content;
    document.folder = version.snapshot.folder || null;
    await document.save();

    await createDocumentSnapshot({
      document,
      changedBy: req.user.id,
      changeType: "restore",
      sourceVersion: version._id,
    });

    return res.json({ message: "Document restored successfully.", document });
  } catch (error) {
    next(error);
  }
};
