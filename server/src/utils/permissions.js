export const WorkspaceRoles = {
  OWNER: "owner",
  EDITOR: "editor",
  COMMENTER: "commenter",
  VIEWER: "viewer",
};

export const PermissionActions = {
  WORKSPACE_READ: "workspace:read",
  WORKSPACE_UPDATE: "workspace:update",
  WORKSPACE_DELETE: "workspace:delete",
  WORKSPACE_MANAGE_MEMBERS: "workspace:manage_members",
  FOLDER_CREATE: "folder:create",
  FOLDER_READ: "folder:read",
  FOLDER_UPDATE: "folder:update",
  FOLDER_DELETE: "folder:delete",
  DOCUMENT_CREATE: "document:create",
  DOCUMENT_READ: "document:read",
  DOCUMENT_COMMENT: "document:comment",
  DOCUMENT_UPDATE: "document:update",
  DOCUMENT_DELETE: "document:delete",
};

const baseReadActions = [
  PermissionActions.WORKSPACE_READ,
  PermissionActions.FOLDER_READ,
  PermissionActions.DOCUMENT_READ,
];

const commenterActions = [...baseReadActions, PermissionActions.DOCUMENT_COMMENT];

const editorActions = [
  ...baseReadActions,
  PermissionActions.FOLDER_CREATE,
  PermissionActions.FOLDER_UPDATE,
  PermissionActions.FOLDER_DELETE,
  PermissionActions.DOCUMENT_CREATE,
  PermissionActions.DOCUMENT_COMMENT,
  PermissionActions.DOCUMENT_UPDATE,
  PermissionActions.DOCUMENT_DELETE,
];

const rolePermissions = {
  [WorkspaceRoles.OWNER]: new Set(Object.values(PermissionActions)),
  [WorkspaceRoles.EDITOR]: new Set(editorActions),
  [WorkspaceRoles.COMMENTER]: new Set(commenterActions),
  [WorkspaceRoles.VIEWER]: new Set(baseReadActions),
};

export const hasPermission = (role, action) => {
  const permissions = rolePermissions[role];
  return Boolean(permissions && permissions.has(action));
};
