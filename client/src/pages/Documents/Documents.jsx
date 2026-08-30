import { useEffect, useMemo, useState } from "react";
import {
Clock3,
FileText,
MoreHorizontal,
Plus,
Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import api from "../../api/api";

function Documents() {
const navigate = useNavigate();

// ================= DATA =================

const [documents, setDocuments] = useState([]);
const [workspaces, setWorkspaces] = useState([]);
const [folders, setFolders] = useState([]);

// ================= STATES =================

const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const [searchQuery, setSearchQuery] = useState("");
const [selectedWorkspace, setSelectedWorkspace] =
useState("");

// ================= CREATE / RENAME =================

const [isModalOpen, setIsModalOpen] = useState(false);
const [documentTitle, setDocumentTitle] = useState("");
const [selectedFolderId, setSelectedFolderId] =
useState("");
const [selectedWorkspaceId, setSelectedWorkspaceId] =
useState("");
const [editingDocument, setEditingDocument] =
useState(null);
const [saving, setSaving] = useState(false);

// ================= MENU =================

const [openMenuId, setOpenMenuId] = useState(null);

// ================= DELETE =================

const [documentToDelete, setDocumentToDelete] =
useState(null);
const [deleting, setDeleting] = useState(false);

// =========================================================
// LOAD WORKSPACES + DOCUMENTS
// =========================================================

const loadData = async () => {
try {
setLoading(true);
setError("");

  // -----------------------------------------
  // Get user's workspaces
  // -----------------------------------------

  const workspaceResponse =
    await api.get("/workspaces");

  const loadedWorkspaces =
    workspaceResponse.data.workspaces || [];

  setWorkspaces(loadedWorkspaces);

  // -----------------------------------------
  // Get documents from every workspace
  // -----------------------------------------

  if (loadedWorkspaces.length === 0) {
    setDocuments([]);
    setFolders([]);
    return;
  }

  const documentRequests =
    loadedWorkspaces.map((workspace) =>
      api.get(
        `/documents/workspace/${workspace._id}`
      )
    );

  const folderRequests =
    loadedWorkspaces.map((workspace) =>
      api.get(
        `/folders/workspace/${workspace._id}`
      )
    );

  const [
    documentResponses,
    folderResponses,
  ] = await Promise.all([
    Promise.all(documentRequests),
    Promise.all(folderRequests),
  ]);

  // -----------------------------------------
  // Combine documents
  // -----------------------------------------

  const allDocuments =
    documentResponses.flatMap(
      (response, index) => {
        const workspace =
          loadedWorkspaces[index];

        return (
          response.data.documents || []
        ).map((document) => ({
          ...document,
          workspaceName:
            workspace.name,
          workspaceId:
            workspace._id,
        }));
      }
    );

  // -----------------------------------------
  // Combine folders
  // -----------------------------------------

  const allFolders =
    folderResponses.flatMap(
      (response, index) => {
        const workspace =
          loadedWorkspaces[index];

        return (
          response.data.folders || []
        ).map((folder) => ({
          ...folder,
          workspaceName:
            workspace.name,
          workspaceId:
            workspace._id,
        }));
      }
    );

  setDocuments(allDocuments);
  setFolders(allFolders);
} catch (error) {
  console.error(
    "Failed to load documents:",
    error
  );

  setError(
    error.response?.data?.message ||
      "Failed to load documents. Please try again."
  );
} finally {
  setLoading(false);
}


};

useEffect(() => {
loadData();
}, []);

// =========================================================
// FOLDER NAME
// =========================================================

const getFolderName = (folderId) => {
if (!folderId) {
return null;
}

const folder = folders.find(
  (item) =>
    item._id === folderId.toString()
);

return folder?.name || null;


};

// =========================================================
// FILTER DOCUMENTS
// =========================================================

const filteredDocuments = useMemo(() => {
const query =
searchQuery.trim().toLowerCase();


return documents.filter((document) => {
  const matchesSearch =
    !query ||
    document.title
      ?.toLowerCase()
      .includes(query);

  const matchesWorkspace =
    !selectedWorkspace ||
    document.workspaceId ===
      selectedWorkspace;

  return (
    matchesSearch &&
    matchesWorkspace
  );
});


}, [
documents,
searchQuery,
selectedWorkspace,
]);

// =========================================================
// FORMAT UPDATED TIME
// =========================================================

const formatUpdatedTime = (date) => {
if (!date) {
return "Unknown";
}

const updatedDate = new Date(date);

if (Number.isNaN(updatedDate.getTime())) {
  return "Unknown";
}

const now = new Date();

const difference =
  now.getTime() -
  updatedDate.getTime();

const seconds = Math.floor(
  difference / 1000
);

if (seconds < 60) {
  return "Just now";
}

const minutes = Math.floor(
  seconds / 60
);

if (minutes < 60) {
  return `${minutes} ${
    minutes === 1
      ? "minute"
      : "minutes"
  } ago`;
}

const hours = Math.floor(
  minutes / 60
);

if (hours < 24) {
  return `${hours} ${
    hours === 1
      ? "hour"
      : "hours"
  } ago`;
}

const days = Math.floor(
  hours / 24
);

if (days < 7) {
  return `${days} ${
    days === 1
      ? "day"
      : "days"
  } ago`;
}

return updatedDate.toLocaleDateString();


};

// =========================================================
// OPEN CREATE MODAL
// =========================================================

const openCreateModal = () => {
setEditingDocument(null);
setDocumentTitle("");
setSelectedFolderId("");


// If a workspace filter is selected,
// use it automatically.
setSelectedWorkspaceId(
  selectedWorkspace || ""
);

setError("");
setIsModalOpen(true);


};

// =========================================================
// OPEN RENAME MODAL
// =========================================================

const openRenameModal = (document) => {
setOpenMenuId(null);


setEditingDocument(document);
setDocumentTitle(document.title || "");

setSelectedWorkspaceId(
  document.workspaceId || ""
);

setSelectedFolderId(
  document.folder
    ? document.folder.toString()
    : ""
);

setError("");
setIsModalOpen(true);


};

// =========================================================
// CLOSE MODAL
// =========================================================

const closeModal = () => {
if (saving) {
return;
}


setIsModalOpen(false);
setEditingDocument(null);
setDocumentTitle("");
setSelectedFolderId("");
setSelectedWorkspaceId("");
setError("");


};

// =========================================================
// FOLDERS FOR SELECTED WORKSPACE
// =========================================================

const availableFolders = useMemo(() => {
if (!selectedWorkspaceId) {
return [];
}


return folders.filter(
  (folder) =>
    folder.workspaceId ===
    selectedWorkspaceId
);


}, [
folders,
selectedWorkspaceId,
]);

// =========================================================
// CREATE / UPDATE DOCUMENT
// =========================================================

const handleSubmit = async (event) => {
event.preventDefault();


if (!documentTitle.trim()) {
  return;
}

// Creating a new document requires workspace.
if (
  !editingDocument &&
  !selectedWorkspaceId
) {
  setError(
    "Please select a workspace."
  );
  return;
}

try {
  setSaving(true);
  setError("");

  // =========================================
  // UPDATE EXISTING DOCUMENT
  // =========================================

  if (editingDocument) {
    const response = await api.patch(
      `/documents/${editingDocument._id}`,
      {
        title:
          documentTitle.trim(),
        folderId:
          selectedFolderId || null,
      }
    );

    const updatedDocument =
      response.data.document;

    setDocuments((previous) =>
      previous.map((document) =>
        document._id ===
        updatedDocument._id
          ? {
              ...document,
              ...updatedDocument,
              workspaceName:
                document.workspaceName,
              workspaceId:
                document.workspaceId,
            }
          : document
      )
    );
  }

  // =========================================
  // CREATE NEW DOCUMENT
  // =========================================

  else {
    const response = await api.post(
      "/documents",
      {
        title:
          documentTitle.trim(),
        content: "",
        workspaceId:
          selectedWorkspaceId,
        folderId:
          selectedFolderId || null,
      }
    );

    const createdDocument =
      response.data.document;

    const workspace =
      workspaces.find(
        (item) =>
          item._id ===
          selectedWorkspaceId
      );

    setDocuments((previous) => [
      {
        ...createdDocument,
        workspaceName:
          workspace?.name ||
          "Unknown workspace",
        workspaceId:
          selectedWorkspaceId,
      },
      ...previous,
    ]);
  }

  closeModal();
} catch (error) {
  console.error(
    "Failed to save document:",
    error
  );

  setError(
    error.response?.data?.message ||
      "Failed to save document."
  );
} finally {
  setSaving(false);
}


};

// =========================================================
// DELETE
// =========================================================

const openDeleteModal = (document) => {
setOpenMenuId(null);
setDocumentToDelete(document);
};

const closeDeleteModal = () => {
if (deleting) {
return;
}


setDocumentToDelete(null);


};

const handleDelete = async () => {
if (!documentToDelete) {
return;
}


try {
  setDeleting(true);
  setError("");

  await api.delete(
    `/documents/${documentToDelete._id}`
  );

  setDocuments((previous) =>
    previous.filter(
      (document) =>
        document._id !==
        documentToDelete._id
    )
  );

  setDocumentToDelete(null);
} catch (error) {
  console.error(
    "Failed to delete document:",
    error
  );

  setError(
    error.response?.data?.message ||
      "Failed to delete document."
  );
} finally {
  setDeleting(false);
}


};

// =========================================================
// OPEN DOCUMENT
// =========================================================

const handleOpenDocument = (document) => {
navigate(
`/editor/${document._id}`
);
};

// =========================================================
// UI
// =========================================================

return ( <DashboardLayout> <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">


    {/* ========================================= */}
    {/* HEADER */}
    {/* ========================================= */}

    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

      <div>
        <p className="text-sm font-medium text-[#4F46E5]">
          Documents
        </p>

        <h1 className="mt-1 text-2xl font-semibold text-[#1E293B] sm:text-3xl">
          My Documents
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage and organize the documents
          you have created.
        </p>
      </div>

      <Button
        onClick={openCreateModal}
        disabled={
          workspaces.length === 0
        }
      >
        <Plus
          size={18}
          className="mr-2"
        />
        New Document
      </Button>

    </div>

    {/* ========================================= */}
    {/* ERROR */}
    {/* ========================================= */}

    {error && (
      <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
        {error}
      </div>
    )}

    {/* ========================================= */}
    {/* SEARCH / FILTER */}
    {/* ========================================= */}

    <div className="mb-6 flex flex-col gap-3 sm:flex-row">

      <div className="relative flex-1">

        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          value={searchQuery}
          onChange={(event) =>
            setSearchQuery(
              event.target.value
            )
          }
          placeholder="Search your documents..."
          className="w-full rounded-xl border border-[#E2E8F0] bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100"
        />

      </div>

      <select
        value={selectedWorkspace}
        onChange={(event) =>
          setSelectedWorkspace(
            event.target.value
          )
        }
        className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-slate-600 outline-none focus:border-[#4F46E5]"
      >

        <option value="">
          All Workspaces
        </option>

        {workspaces.map(
          (workspace) => (
            <option
              key={workspace._id}
              value={workspace._id}
            >
              {workspace.name}
            </option>
          )
        )}

      </select>

    </div>

    {/* ========================================= */}
    {/* LOADING */}
    {/* ========================================= */}

    {loading ? (
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-12 text-center">

        <p className="text-sm text-slate-500">
          Loading documents...
        </p>

      </div>
    ) : (
      <>
        {/* ===================================== */}
        {/* DOCUMENT TABLE */}
        {/* ===================================== */}

        <div className="overflow-visible rounded-xl border border-[#E2E8F0] bg-white">

          {/* TABLE HEADER */}

          <div className="hidden border-b border-[#E2E8F0] bg-slate-50 px-5 py-3 text-xs font-medium uppercase tracking-wide text-slate-500 sm:grid sm:grid-cols-[1fr_200px_150px_40px]">

            <span>
              Document
            </span>

            <span>
              Workspace
            </span>

            <span>
              Last Updated
            </span>

            <span />

          </div>

          {/* EMPTY */}

          {filteredDocuments.length ===
          0 ? (
            <div className="px-6 py-14 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-[#4F46E5]">
                <FileText
                  size={25}
                />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-800">
                {documents.length ===
                0
                  ? "No documents yet"
                  : "No documents found"}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                {documents.length ===
                0
                  ? "Create your first document to get started."
                  : "Try changing your search or workspace filter."}
              </p>

              {documents.length ===
                0 &&
                workspaces.length >
                  0 && (
                  <div className="mt-5">
                    <Button
                      onClick={
                        openCreateModal
                      }
                    >
                      <Plus
                        size={18}
                        className="mr-2"
                      />
                      New Document
                    </Button>
                  </div>
                )}

            </div>
          ) : (
            filteredDocuments.map(
              (document) => (
                <div
                  key={
                    document._id
                  }
                  className="flex flex-col gap-3 border-b border-[#E2E8F0] p-4 last:border-b-0 hover:bg-slate-50 sm:grid sm:grid-cols-[1fr_200px_150px_40px] sm:items-center sm:px-5"
                >

                  {/* DOCUMENT */}

                  <button
                    type="button"
                    onClick={() =>
                      handleOpenDocument(
                        document
                      )
                    }
                    className="flex min-w-0 items-center gap-3 text-left"
                  >

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-[#4F46E5]">
                      <FileText
                        size={19}
                      />
                    </div>

                    <div className="min-w-0">

                      <h3 className="truncate text-sm font-medium text-[#1E293B] hover:text-[#4F46E5]">
                        {
                          document.title
                        }
                      </h3>

                      {getFolderName(
                        document.folder
                      ) && (
                        <p className="mt-1 text-xs text-slate-400">
                          {getFolderName(
                            document.folder
                          )}
                        </p>
                      )}

                    </div>

                  </button>

                  {/* WORKSPACE */}

                  <span className="text-sm text-slate-500">
                    {
                      document.workspaceName
                    }
                  </span>

                  {/* UPDATED */}

                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock3
                      size={14}
                    />

                    {formatUpdatedTime(
                      document.updatedAt
                    )}
                  </div>

                  {/* MENU */}

                  <div className="relative">

                    <button
                      type="button"
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId ===
                            document._id
                            ? null
                            : document._id
                        )
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                      aria-label={`More options for ${document.title}`}
                    >
                      <MoreHorizontal
                        size={18}
                      />
                    </button>

                    {openMenuId ===
                      document._id && (
                      <>
                        {/* CLICK OUTSIDE */}

                        <button
                          type="button"
                          aria-label="Close menu"
                          className="fixed inset-0 z-10 cursor-default"
                          onClick={() =>
                            setOpenMenuId(
                              null
                            )
                          }
                        />

                        {/* MENU */}

                        <div className="absolute right-0 top-9 z-20 w-32 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl">

                          <button
                            type="button"
                            onClick={() =>
                              openRenameModal(
                                document
                              )
                            }
                            className="w-full px-4 py-2.5 text-left text-sm text-slate-600 hover:bg-slate-50"
                          >
                            Rename
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openDeleteModal(
                                document
                              )
                            }
                            className="w-full px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-50"
                          >
                            Delete
                          </button>

                        </div>
                      </>
                    )}

                  </div>

                </div>
              )
            )
          )}

        </div>

        {/* COUNT */}

        <p className="mt-4 text-sm text-slate-400">
          {filteredDocuments.length}{" "}
          {filteredDocuments.length ===
          1
            ? "document"
            : "documents"}
        </p>
      </>
    )}

  </div>

  {/* ===================================================== */}
  {/* CREATE / RENAME DOCUMENT MODAL */}
  {/* ===================================================== */}

  <Modal
    isOpen={isModalOpen}
    onClose={closeModal}
    title={
      editingDocument
        ? "Rename Document"
        : "Create Document"
    }
  >

    <form
      onSubmit={handleSubmit}
    >

      {/* DOCUMENT NAME */}

      <label className="mb-2 block text-sm font-medium text-slate-700">
        Document Name
      </label>

      <input
        type="text"
        value={documentTitle}
        onChange={(event) =>
          setDocumentTitle(
            event.target.value
          )
        }
        placeholder="e.g. Project Requirements"
        autoFocus
        disabled={saving}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
      />

      {/* WORKSPACE */}

      {!editingDocument && (
        <>
          <label className="mt-5 mb-2 block text-sm font-medium text-slate-700">
            Workspace
          </label>

          <select
            value={
              selectedWorkspaceId
            }
            onChange={(event) => {
              setSelectedWorkspaceId(
                event.target.value
              );
              setSelectedFolderId(
                ""
              );
            }}
            disabled={saving}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          >

            <option value="">
              Select workspace
            </option>

            {workspaces.map(
              (workspace) => (
                <option
                  key={
                    workspace._id
                  }
                  value={
                    workspace._id
                  }
                >
                  {
                    workspace.name
                  }
                </option>
              )
            )}

          </select>
        </>
      )}

      {/* FOLDER */}

      <label className="mt-5 mb-2 block text-sm font-medium text-slate-700">
        Folder
      </label>

      {selectedWorkspaceId ? (
        availableFolders.length >
        0 ? (
          <select
            value={
              selectedFolderId
            }
            onChange={(event) =>
              setSelectedFolderId(
                event.target.value
              )
            }
            disabled={saving}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          >

            <option value="">
              No folder
            </option>

            {availableFolders.map(
              (folder) => (
                <option
                  key={
                    folder._id
                  }
                  value={
                    folder._id
                  }
                >
                  {
                    folder.name
                  }
                </option>
              )
            )}

          </select>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3">

            <p className="text-sm text-slate-500">
              No folders available
              in this workspace.
            </p>

          </div>
        )
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3">

          <p className="text-sm text-slate-500">
            Select a workspace first.
          </p>

        </div>
      )}

      {/* ERROR */}

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* FOOTER */}

      <div className="mt-6 flex justify-end gap-3">

        <Button
          type="button"
          variant="secondary"
          disabled={saving}
          onClick={
            closeModal
          }
        >
          Cancel
        </Button>

        <Button
          type="submit"
          loading={saving}
          disabled={
            saving ||
            !documentTitle.trim() ||
            (!editingDocument &&
              !selectedWorkspaceId)
          }
        >
          {editingDocument
            ? "Save Changes"
            : "Create Document"}
        </Button>

      </div>

    </form>

  </Modal>

  {/* ===================================================== */}
  {/* DELETE DOCUMENT MODAL */}
  {/* ===================================================== */}

  <Modal
    isOpen={Boolean(
      documentToDelete
    )}
    onClose={
      closeDeleteModal
    }
    title="Delete Document"
  >

    <div>

      <div className="rounded-xl bg-red-50 p-4">

        <p className="text-sm font-medium text-red-800">
          Are you sure you want to
          delete this document?
        </p>

        <p className="mt-2 text-sm text-red-600">
          This action cannot be
          undone.
        </p>

      </div>

      {documentToDelete && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">

          <p className="text-xs text-slate-400">
            Document
          </p>

          <p className="mt-1 font-semibold text-slate-800">
            {
              documentToDelete.title
            }
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {
              documentToDelete.workspaceName
            }
          </p>

        </div>
      )}

      <div className="mt-6 flex justify-end gap-3">

        <Button
          type="button"
          variant="secondary"
          disabled={deleting}
          onClick={
            closeDeleteModal
          }
        >
          Cancel
        </Button>

        <Button
          type="button"
          loading={deleting}
          disabled={deleting}
          onClick={
            handleDelete
          }
          className="bg-red-600 hover:bg-red-700"
        >
          Delete Document
        </Button>

      </div>

    </div>

  </Modal>
</DashboardLayout>

);
}

export default Documents;
