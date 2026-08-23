import { Folder } from "../models/Folder.js";
import { Document } from "../models/Document.js";
import { DocumentVersion } from "../models/DocumentVersion.js";
import { PermissionActions } from "../utils/permissions.js";
import { assertWorkspaceAccess } from "../utils/workspaceAccess.js";
import { badRequest, isValidObjectId, notFound } from "../utils/validation.js";

const collectDescendantFolderIds = async (workspaceId, rootFolderId) => {
  const allIds = [rootFolderId.toString()];
  const queue = [rootFolderId.toString()];

  while (queue.length > 0) {
    const currentId = queue.shift();
    const children = await Folder.find({ workspace: workspaceId, parentFolder: currentId }).select("_id");

    for (const child of children) {
      const childId = child._id.toString();
      allIds.push(childId);
      queue.push(childId);
    }
  }

  return allIds;
};

export const createFolder = async (req, res, next) => {
  try {
    const { name, workspaceId, parentFolderId = null } = req.body;

    if (!name || !name.trim()) {
      throw badRequest("Folder name is required.");
    }

    if (!workspaceId || !isValidObjectId(workspaceId)) {
      throw badRequest("Valid workspaceId is required.");
    }

    await assertWorkspaceAccess(workspaceId, req.user.id, PermissionActions.FOLDER_CREATE);

    let parentFolder = null;
    if (parentFolderId !== null) {
      if (!isValidObjectId(parentFolderId)) {
        throw badRequest("Invalid parentFolderId.");
      }

      parentFolder = await Folder.findOne({
        _id: parentFolderId,
        workspace: workspaceId,
      });

      if (!parentFolder) {
        throw notFound("Parent folder not found in this workspace.");
      }
    }

    const folder = await Folder.create({
      name: name.trim(),
      workspace: workspaceId,
      parentFolder: parentFolder ? parentFolder._id : null,
      owner: req.user.id,
    });

    return res.status(201).json({ folder });
  } catch (error) {
    next(error);
  }
};

export const getFoldersByWorkspace = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;

    if (!isValidObjectId(workspaceId)) {
      throw badRequest("Invalid workspace id.");
    }

    await assertWorkspaceAccess(workspaceId, req.user.id, PermissionActions.FOLDER_READ);

    const folders = await Folder.find({ workspace: workspaceId }).sort({ createdAt: -1 });
    return res.json({ folders });
  } catch (error) {
    next(error);
  }
};

export const getFolderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      throw badRequest("Invalid folder id.");
    }

    const folder = await Folder.findById(id);
    if (!folder) {
      throw notFound("Folder not found.");
    }

    await assertWorkspaceAccess(folder.workspace, req.user.id, PermissionActions.FOLDER_READ);

    return res.json({ folder });
  } catch (error) {
    next(error);
  }
};

export const updateFolder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, parentFolderId } = req.body;

    if (!isValidObjectId(id)) {
      throw badRequest("Invalid folder id.");
    }

    const folder = await Folder.findById(id);
    if (!folder) {
      throw notFound("Folder not found.");
    }

    await assertWorkspaceAccess(folder.workspace, req.user.id, PermissionActions.FOLDER_UPDATE);

    if (typeof name === "string") {
      if (!name.trim()) {
        throw badRequest("Folder name cannot be empty.");
      }

      folder.name = name.trim();
    }

    if (parentFolderId !== undefined) {
      if (parentFolderId === null) {
        folder.parentFolder = null;
      } else {
        if (!isValidObjectId(parentFolderId)) {
          throw badRequest("Invalid parentFolderId.");
        }

        if (parentFolderId === id) {
          throw badRequest("Folder cannot be parent of itself.");
        }

        const newParent = await Folder.findOne({
          _id: parentFolderId,
          workspace: folder.workspace,
        });

        if (!newParent) {
          throw notFound("Parent folder not found in this workspace.");
        }

        const descendants = await collectDescendantFolderIds(folder.workspace, folder._id);
        if (descendants.includes(parentFolderId)) {
          throw badRequest("Cannot move folder into one of its descendants.");
        }

        folder.parentFolder = newParent._id;
      }
    }

    await folder.save();
    return res.json({ folder });
  } catch (error) {
    next(error);
  }
};

export const deleteFolder = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      throw badRequest("Invalid folder id.");
    }

    const folder = await Folder.findById(id);
    if (!folder) {
      throw notFound("Folder not found.");
    }

    await assertWorkspaceAccess(folder.workspace, req.user.id, PermissionActions.FOLDER_DELETE);

    const folderIds = await collectDescendantFolderIds(folder.workspace, folder._id);
    const documentIds = await Document.find({ workspace: folder.workspace, folder: { $in: folderIds } }).distinct("_id");

    await DocumentVersion.deleteMany({ document: { $in: documentIds } });
    await Document.deleteMany({ workspace: folder.workspace, folder: { $in: folderIds } });
    await Folder.deleteMany({ workspace: folder.workspace, _id: { $in: folderIds } });

    return res.json({ message: "Folder deleted successfully." });
  } catch (error) {
    next(error);
  }
};
