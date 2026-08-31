import test from 'node:test';
import assert from 'node:assert/strict';

import { DocumentVersion } from '../src/models/DocumentVersion.js';
import { createDocumentSnapshot } from '../src/utils/documentVersioning.js';
import { PermissionActions, WorkspaceRoles, hasPermission } from '../src/utils/permissions.js';

test('commenter can comment but cannot edit documents', () => {
  assert.equal(hasPermission(WorkspaceRoles.COMMENTER, PermissionActions.DOCUMENT_COMMENT), true);
  assert.equal(hasPermission(WorkspaceRoles.COMMENTER, PermissionActions.DOCUMENT_UPDATE), false);
  assert.equal(hasPermission(WorkspaceRoles.VIEWER, PermissionActions.DOCUMENT_COMMENT), false);
  assert.equal(hasPermission(WorkspaceRoles.OWNER, PermissionActions.DOCUMENT_DELETE), true);
});

test('document snapshots increment version numbers and store restoreable content', async () => {
  const originalFindOne = DocumentVersion.findOne;
  const originalCreate = DocumentVersion.create;

  try {
    DocumentVersion.findOne = () => ({
      select: () => ({
        sort: () => ({
          lean: async () => ({ versionNumber: 3 }),
        }),
      }),
    });
    DocumentVersion.create = async (payload) => payload;

    const snapshot = await createDocumentSnapshot({
      document: {
        _id: '67d63af5ad8f69b34d8b01f5',
        workspace: '67d63af5ad8f69b34d8b01f6',
        title: 'Quarterly Plan',
        content: 'Updated notes',
        folder: '67d63af5ad8f69b34d8b01f7',
      },
      changedBy: '67d63af5ad8f69b34d8b01f8',
      changeType: 'update',
    });

    assert.equal(snapshot.versionNumber, 4);
    assert.equal(snapshot.changeType, 'update');
    assert.equal(snapshot.snapshot.title, 'Quarterly Plan');
    assert.equal(snapshot.snapshot.content, 'Updated notes');
    assert.equal(snapshot.snapshot.folder.toString(), '67d63af5ad8f69b34d8b01f7');
  } finally {
    DocumentVersion.findOne = originalFindOne;
    DocumentVersion.create = originalCreate;
  }
});
