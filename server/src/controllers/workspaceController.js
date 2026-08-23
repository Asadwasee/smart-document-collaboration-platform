import { Workspace } from "../models/Workspace.js";
import { Folder } from "../models/Folder.js";
import { Document } from "../models/Document.js";
import { DocumentVersion } from "../models/DocumentVersion.js";
import { User } from "../models/User.js";
import { PermissionActions, WorkspaceRoles } from "../utils/permissions.js";
import { assertWorkspaceAccess } from "../utils/workspaceAccess.js";
import { badRequest, isValidObjectId, notFound } from "../utils/validation.js";

export const createWorkspace = async (req, res, next) => {
  try {
    const { name, description = "" } = req.body;

    if (!name || !name.trim()) {
      throw badRequest("Workspace name is required.");
    }

    const workspace = await Workspace.create({
      name: name.trim(),
      description,
      owner: req.user.id,
      members: [],
    });

    return res.status(201).json({ workspace });
  } catch (error) {
    next(error);
  }
};

export const getWorkspaces = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const workspaces = await Workspace.find({
      $or: [{ owner: userId }, { "members.user": userId }],
    }).sort({ createdAt: -1 });

    return res.json({ workspaces });
  } catch (error) {
    next(error);
  }
};

export const getWorkspaceById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { workspace, role } = await assertWorkspaceAccess(id, req.user.id, PermissionActions.WORKSPACE_READ);

    return res.json({ workspace, role });
  } catch (error) {
    next(error);
  }
};

export const updateWorkspace = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const { workspace } = await assertWorkspaceAccess(id, req.user.id, PermissionActions.WORKSPACE_UPDATE);

    if (typeof name === "string") {
      if (!name.trim()) {
        throw badRequest("Workspace name cannot be empty.");
      }

      workspace.name = name.trim();
    }

    if (typeof description === "string") {
      workspace.description = description;
    }

    await workspace.save();
    return res.json({ workspace });
  } catch (error) {
    next(error);
  }
};

export const deleteWorkspace = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { workspace } = await assertWorkspaceAccess(id, req.user.id, PermissionActions.WORKSPACE_DELETE);

    await DocumentVersion.deleteMany({ workspace: workspace._id });
    await Document.deleteMany({ workspace: workspace._id });
    await Folder.deleteMany({ workspace: workspace._id });
    await workspace.deleteOne();

    return res.json({ message: "Workspace deleted successfully." });
  } catch (error) {
    next(error);
  }
};

const allowedMemberRoles = [WorkspaceRoles.EDITOR, WorkspaceRoles.COMMENTER, WorkspaceRoles.VIEWER];

export const addWorkspaceMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, role = WorkspaceRoles.VIEWER } = req.body;

    if (!email || typeof email !== "string") {
      throw badRequest("Member email is required.");
    }

    if (!allowedMemberRoles.includes(role)) {
      throw badRequest("Role must be editor, commenter, or viewer.");
    }

    const { workspace } = await assertWorkspaceAccess(
      id,
      req.user.id,
      PermissionActions.WORKSPACE_MANAGE_MEMBERS
    );

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      throw notFound("User not found for the provided email.");
    }

    if (workspace.owner.toString() === user._id.toString()) {
      throw badRequest("Owner role is fixed and cannot be added as member.");
    }

    const existingIndex = workspace.members.findIndex(
      (entry) => entry.user.toString() === user._id.toString()
    );

    if (existingIndex >= 0) {
      workspace.members[existingIndex].role = role;
    } else {
      workspace.members.push({
        user: user._id,
        role,
      });
    }

    await workspace.save();

    return res.json({
      message: "Member access updated.",
      member: {
        user: user._id,
        email: user.email,
        name: user.name,
        role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateWorkspaceMemberRole = async (req, res, next) => {
  try {
    const { id, memberId } = req.params;
    const { role } = req.body;

    if (!isValidObjectId(memberId)) {
      throw badRequest("Invalid member id.");
    }

    if (!allowedMemberRoles.includes(role)) {
      throw badRequest("Role must be editor, commenter, or viewer.");
    }

    const { workspace } = await assertWorkspaceAccess(
      id,
      req.user.id,
      PermissionActions.WORKSPACE_MANAGE_MEMBERS
    );

    const member = workspace.members.find((entry) => entry.user.toString() === memberId);

    if (!member) {
      throw notFound("Member not found in this workspace.");
    }

    member.role = role;
    await workspace.save();

    return res.json({ message: "Member role updated.", member });
  } catch (error) {
    next(error);
  }
};

export const removeWorkspaceMember = async (req, res, next) => {
  try {
    const { id, memberId } = req.params;

    if (!isValidObjectId(memberId)) {
      throw badRequest("Invalid member id.");
    }

    const { workspace } = await assertWorkspaceAccess(
      id,
      req.user.id,
      PermissionActions.WORKSPACE_MANAGE_MEMBERS
    );

    const beforeCount = workspace.members.length;
    workspace.members = workspace.members.filter((entry) => entry.user.toString() !== memberId);

    if (beforeCount === workspace.members.length) {
      throw notFound("Member not found in this workspace.");
    }

    await workspace.save();
    return res.json({ message: "Member removed from workspace." });
  } catch (error) {
    next(error);
  }
};
