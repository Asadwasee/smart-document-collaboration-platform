import { useEffect, useState } from "react";
import Button from "../common/Button";
import Modal from "../common/Modal";
import ShareModal from "./ShareModal";
import api from "../../api/api";

const DocumentList = ({
  workspaceId,
  refreshTrigger = 0,
  onDocumentChanged,
}) => {
  const [documents, setDocuments] =
    useState([]);

  const [folders, setFolders] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ================= MODAL =================

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [documentTitle, setDocumentTitle] =
    useState("");

  const [selectedFolderId, setSelectedFolderId] =
    useState("");

  const [editingDocument, setEditingDocument] =
    useState(null);

  const [saving, setSaving] =
    useState(false);

  // ================= SHARE =================

  const [sharingDocument, setSharingDocument] =
    useState(null);

  // ================= THREE DOT MENU =================

  const [openMenuId, setOpenMenuId] =
    useState(null);

  // ================= DELETE =================

  const [documentToDelete, setDocumentToDelete] =
    useState(null);

  const [deleting, setDeleting] =
    useState(false);

  // =========================================================
  // LOAD DOCUMENTS + FOLDERS
  // =========================================================

  useEffect(() => {
    if (!workspaceId) {
      setDocuments([]);
      setFolders([]);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          documentsResponse,
          foldersResponse,
        ] = await Promise.all([
          api.get(
            `/documents/workspace/${workspaceId}`
          ),
          api.get(
            `/folders/workspace/${workspaceId}`
          ),
        ]);

        setDocuments(
          documentsResponse.data.documents || []
        );

        setFolders(
          foldersResponse.data.folders || []
        );

      } catch (error) {
        console.error(
          "Failed to load documents:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load documents."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [workspaceId, refreshTrigger]);

  // =========================================================
  // CREATE DOCUMENT MODAL
  // =========================================================

  const openCreateModal = () => {
    setEditingDocument(null);
    setDocumentTitle("");
    setSelectedFolderId("");
    setError("");
    setIsModalOpen(true);
  };

  // =========================================================
  // RENAME DOCUMENT MODAL
  // =========================================================

  const openRenameModal = (document) => {
    setEditingDocument(document);
    setDocumentTitle(document.title);

    setSelectedFolderId(
      document.folder
        ? document.folder.toString()
        : ""
    );

    setError("");
    setOpenMenuId(null);
    setIsModalOpen(true);
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const closeModal = () => {
    if (saving) return;

    setIsModalOpen(false);
    setEditingDocument(null);
    setDocumentTitle("");
    setSelectedFolderId("");
    setError("");
  };

  // =========================================================
  // CREATE / RENAME DOCUMENT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!documentTitle.trim()) return;

    try {
      setSaving(true);
      setError("");

      if (editingDocument) {

        // ================= RENAME / UPDATE =================

        const response = await api.patch(
          `/documents/${editingDocument._id}`,
          {
            title: documentTitle.trim(),
            folderId:
              selectedFolderId || null,
          }
        );

        const updatedDocument =
          response.data.document;

        setDocuments((prev) =>
          prev.map((document) =>
            document._id ===
            updatedDocument._id
              ? updatedDocument
              : document
          )
        );

      } else {

        // ================= CREATE =================

        const response = await api.post(
          "/documents",
          {
            title: documentTitle.trim(),
            content: "",
            workspaceId,
            folderId:
              selectedFolderId || null,
          }
        );

        const createdDocument =
          response.data.document;

        setDocuments((prev) => [
          createdDocument,
          ...prev,
        ]);
      }

      closeModal();

      if (onDocumentChanged) {
        onDocumentChanged();
      }

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
  // DELETE MODAL
  // =========================================================

  const openDeleteModal = (document) => {
    setOpenMenuId(null);
    setDocumentToDelete(document);
  };

  const closeDeleteModal = () => {
    if (deleting) return;

    setDocumentToDelete(null);
  };

  // =========================================================
  // DELETE DOCUMENT
  // =========================================================

  const handleDelete = async () => {
    if (!documentToDelete) return;

    try {
      setDeleting(true);

      await api.delete(
        `/documents/${documentToDelete._id}`
      );

      setDocuments((prev) =>
        prev.filter(
          (document) =>
            document._id !==
            documentToDelete._id
        )
      );

      setDocumentToDelete(null);

      if (onDocumentChanged) {
        onDocumentChanged();
      }

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
  // GET FOLDER NAME
  // =========================================================

  const getFolderName = (folderId) => {
    if (!folderId) return "No folder";

    const folder = folders.find(
      (item) =>
        item._id === folderId.toString()
    );

    return folder?.name || "No folder";
  };

  // =========================================================
  // NO WORKSPACE
  // =========================================================

  if (!workspaceId) {
    return (
      <div>

        <h2 className="text-xl font-semibold text-[#1E293B]">
          Documents
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Open a workspace to view its documents.
        </p>

      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div>

      {/* HEADER */}

      <div className="mb-5 flex items-center justify-between">

        <div>

          <h2 className="text-xl font-semibold text-[#1E293B]">
            Documents
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Create and manage documents in this
            workspace.
          </p>

        </div>

        <Button onClick={openCreateModal}>
          + New Document
        </Button>

      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* LOADING */}

      {loading ? (

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">

          <p className="text-sm text-slate-500">
            Loading documents...
          </p>

        </div>

      ) : documents.length === 0 ? (

        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">

          <div className="text-3xl">
            📄
          </div>

          <p className="mt-3 text-sm font-medium text-slate-700">
            No documents yet
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Create your first document in this
            workspace.
          </p>

        </div>

      ) : (

        <div className="space-y-3">

          {documents.map((document) => (

            <div
              key={document._id}
              className="relative flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm"
            >

              {/* Document info */}

              <div className="flex min-w-0 items-center gap-3">

                <span className="text-xl">
                  📄
                </span>

                <div className="min-w-0">

                  <p className="truncate font-medium text-[#1E293B]">
                    {document.title}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    {getFolderName(
                      document.folder
                    )}
                  </p>

                </div>

              </div>

              {/* ACTIONS */}

              <div className="ml-3 flex shrink-0 items-center gap-2">

                <Button
                  variant="ghost"
                  onClick={() =>
                    console.log(
                      "Open document:",
                      document
                    )
                  }
                >
                  Open
                </Button>

                <Button
                  variant="secondary"
                  onClick={() =>
                    setSharingDocument(
                      document
                    )
                  }
                >
                  Share
                </Button>

                {/* THREE DOT MENU */}

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
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    ⋮
                  </button>

                  {openMenuId ===
                    document._id && (
                    <>

                      <button
                        type="button"
                        aria-label="Close menu"
                        className="fixed inset-0 z-10 cursor-default"
                        onClick={() =>
                          setOpenMenuId(null)
                        }
                      />

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

            </div>

          ))}

        </div>

      )}

      {/* ========================================================= */}
      {/* CREATE / RENAME DOCUMENT MODAL */}
      {/* ========================================================= */}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          editingDocument
            ? "Rename Document"
            : "Create Document"
        }
      >

        <form onSubmit={handleSubmit}>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Document Name
          </label>

          <input
            type="text"
            value={documentTitle}
            onChange={(e) =>
              setDocumentTitle(e.target.value)
            }
            placeholder="e.g. Project Requirements"
            autoFocus
            disabled={saving}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />

          {/* FOLDER DROPDOWN */}

          <label className="mt-5 mb-2 block text-sm font-medium text-slate-700">
            Folder
          </label>

          {folders.length > 0 ? (

            <select
              value={selectedFolderId}
              onChange={(e) =>
                setSelectedFolderId(
                  e.target.value
                )
              }
              disabled={saving}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            >

              <option value="">
                No folder
              </option>

              {folders.map((folder) => (
                <option
                  key={folder._id}
                  value={folder._id}
                >
                  {folder.name}
                </option>
              ))}

            </select>

          ) : (

            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3">

              <p className="text-sm text-slate-500">
                No folders available.
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Create a folder first if you want to
                organize this document.
              </p>

            </div>

          )}

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
              onClick={closeModal}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              loading={saving}
              disabled={
                saving ||
                !documentTitle.trim()
              }
            >
              {editingDocument
                ? "Save Changes"
                : "Create Document"}
            </Button>

          </div>

        </form>

      </Modal>

      {/* ========================================================= */}
      {/* DELETE DOCUMENT MODAL */}
      {/* ========================================================= */}

      <Modal
        isOpen={Boolean(documentToDelete)}
        onClose={closeDeleteModal}
        title="Delete Document"
      >

        <div>

          <div className="rounded-xl bg-red-50 p-4">

            <p className="text-sm font-medium text-red-800">
              Are you sure you want to delete this
              document?
            </p>

            <p className="mt-2 text-sm text-red-600">
              This action cannot be undone.
            </p>

          </div>

          {documentToDelete && (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">

              <p className="text-xs text-slate-400">
                Document
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {documentToDelete.title}
              </p>

            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">

            <Button
              type="button"
              variant="secondary"
              disabled={deleting}
              onClick={closeDeleteModal}
            >
              Cancel
            </Button>

            <Button
              type="button"
              loading={deleting}
              disabled={deleting}
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Document
            </Button>

          </div>

        </div>

      </Modal>

      {/* ========================================================= */}
      {/* SHARE MODAL */}
      {/* ========================================================= */}

      <ShareModal
        isOpen={Boolean(sharingDocument)}
        onClose={() =>
          setSharingDocument(null)
        }
        documentName={
          sharingDocument?.title
        }
      />

    </div>
  );
};

export default DocumentList;