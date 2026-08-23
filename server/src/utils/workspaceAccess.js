import { Workspace } from "../models/Workspace.js";
import { hasPermission, WorkspaceRoles } from "./permissions.js";
import { badRequest, forbidden, isValidObjectId, notFound } from "./validation.js";

export const getUserWorkspaceRole = (workspace, userId) => {
  const normalizedUserId = userId.toString();

  if (workspace.owner.toString() === normalizedUserId) {
    return WorkspaceRoles.OWNER;
  }

  const member = workspace.members.find((entry) => entry.user.toString() === normalizedUserId);
  return member?.role || null;
};

export const assertWorkspaceAccess = async (workspaceId, userId, action) => {
  if (!isValidObjectId(workspaceId)) {
    throw badRequest("Invalid workspace id.");
  }

  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw notFound("Workspace not found.");
  }

  const role = getUserWorkspaceRole(workspace, userId);
  if (!role || !hasPermission(role, action)) {
    throw forbidden("You do not have permission for this action.");
  }

  return { workspace, role };
};
