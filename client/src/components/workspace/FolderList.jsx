import { useEffect, useState } from "react";
import Button from "../common/Button";
import Modal from "../common/Modal";
import api from "../../api/api";

const FolderList = ({
  workspaceId,
  refreshTrigger = 0,
  onFolderDeleted,
}) => {
  const [folders, setFolders] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Create / rename
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [folderName, setFolderName] =
    useState("");

  const [editingFolder, setEditingFolder] =
    useState(null);

  const [saving, setSaving] = useState(false);

  // Three dot menu
  const [openMenuId, setOpenMenuId] =
    useState(null);

  // Delete modal
  const [folderToDelete, setFolderToDelete] =
    useState(null);

  const [deleting, setDeleting] =
    useState(false);

  // ================= LOAD FOLDERS =================

  useEffect(() => {
    if (!workspaceId) {
      setFolders([]);
      return;
    }

    const loadFolders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/folders/workspace/${workspaceId}`
        );

        setFolders(
          response.data.folders || []
        );
      } catch (error) {
        console.error(
          "Failed to load folders:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load folders."
        );
      } finally {
        setLoading(false);
      }
    };

    loadFolders();
  }, [workspaceId, refreshTrigger]);

  // ================= OPEN CREATE =================

  const openCreateModal = () => {
    setEditingFolder(null);
    setFolderName("");
    setError("");
    setIsModalOpen(true);
  };

  // ================= OPEN RENAME =================

  const openRenameModal = (folder) => {
    setEditingFolder(folder);
    setFolderName(folder.name);
    setError("");
    setOpenMenuId(null);
    setIsModalOpen(true);
  };

  // ================= CLOSE MODAL =================

  const closeModal = () => {
    if (saving) return;

    setIsModalOpen(false);
    setEditingFolder(null);
    setFolderName("");
    setError("");
  };

  // ================= CREATE / RENAME =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!folderName.trim()) return;

    try {
      setSaving(true);
      setError("");

      if (editingFolder) {

        // ================= RENAME =================

        const response = await api.patch(
          `/folders/${editingFolder._id}`,
          {
            name: folderName.trim(),
          }
        );

        const updatedFolder =
          response.data.folder;

        setFolders((prev) =>
          prev.map((folder) =>
            folder._id === updatedFolder._id
              ? updatedFolder
              : folder
          )
        );

      } else {

        // ================= CREATE =================

        const response = await api.post(
          "/folders",
          {
            name: folderName.trim(),
            workspaceId,
            parentFolderId: null,
          }
        );

        const createdFolder =
          response.data.folder;

        setFolders((prev) => [
          createdFolder,
          ...prev,
        ]);
      }

      closeModal();

    } catch (error) {
      console.error(
        "Failed to save folder:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to save folder."
      );
    } finally {
      setSaving(false);
    }
  };

  // ================= OPEN DELETE =================

  const openDeleteModal = (folder) => {
    setOpenMenuId(null);
    setFolderToDelete(folder);
  };

  // ================= CLOSE DELETE =================

  const closeDeleteModal = () => {
    if (deleting) return;

    setFolderToDelete(null);
  };

  // ================= DELETE =================

  const handleDelete = async () => {
    if (!folderToDelete) return;

    try {
      setDeleting(true);

      await api.delete(
        `/folders/${folderToDelete._id}`
      );

      setFolders((prev) =>
        prev.filter(
          (folder) =>
            folder._id !==
            folderToDelete._id
        )
      );

      setFolderToDelete(null);

      // Tell parent so documents refresh
      if (onFolderDeleted) {
        onFolderDeleted();
      }

    } catch (error) {
      console.error(
        "Failed to delete folder:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete folder."
      );
    } finally {
      setDeleting(false);
    }
  };

  // ================= UI =================

  if (!workspaceId) {
    return (
      <div>

        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-xl font-semibold text-[#1E293B]">
              Folders
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Open a workspace to view its folders.
            </p>
          </div>

        </div>

      </div>
    );
  }

  return (
    <div>

      {/* HEADER */}

      <div className="mb-5 flex items-center justify-between">

        <div>

          <h2 className="text-xl font-semibold text-[#1E293B]">
            Folders
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Organize documents into folders.
          </p>

        </div>

        <Button onClick={openCreateModal}>
          + New Folder
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
            Loading folders...
          </p>
        </div>

      ) : folders.length === 0 ? (

        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">

          <div className="text-3xl">
            📁
          </div>

          <p className="mt-3 text-sm font-medium text-slate-700">
            No folders yet
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Create a folder to organize your
            documents.
          </p>

        </div>

      ) : (

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {folders.map((folder) => (

            <div
              key={folder._id}
              className="relative flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm"
            >

              <div className="flex min-w-0 items-center gap-3">

                <span className="text-2xl">
                  📁
                </span>

                <div className="min-w-0">

                  <p className="truncate font-medium text-[#1E293B]">
                    {folder.name}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Folder
                  </p>

                </div>

              </div>

              {/* THREE DOTS */}

              <div className="relative ml-3 shrink-0">

                <button
                  type="button"
                  onClick={() =>
                    setOpenMenuId(
                      openMenuId ===
                        folder._id
                        ? null
                        : folder._id
                    )
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  ⋮
                </button>

                {openMenuId ===
                  folder._id && (
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
                            folder
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
                            folder
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

          ))}

        </div>

      )}

      {/* ========================================================= */}
      {/* CREATE / RENAME MODAL */}
      {/* ========================================================= */}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          editingFolder
            ? "Rename Folder"
            : "Create Folder"
        }
      >

        <form onSubmit={handleSubmit}>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Folder Name
          </label>

          <input
            type="text"
            value={folderName}
            onChange={(e) =>
              setFolderName(e.target.value)
            }
            placeholder="e.g. Project Documents"
            autoFocus
            disabled={saving}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

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
                !folderName.trim()
              }
            >
              {editingFolder
                ? "Save Changes"
                : "Create Folder"}
            </Button>

          </div>

        </form>

      </Modal>

      {/* ========================================================= */}
      {/* DELETE MODAL */}
      {/* ========================================================= */}

      <Modal
        isOpen={Boolean(folderToDelete)}
        onClose={closeDeleteModal}
        title="Delete Folder"
      >

        <div>

          <div className="rounded-xl bg-red-50 p-4">

            <p className="text-sm font-medium text-red-800">
              Delete this folder?
            </p>

            <p className="mt-2 text-sm text-red-600">
              All documents inside this folder
              will also be permanently deleted.
            </p>

          </div>

          {folderToDelete && (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">

              <p className="text-xs text-slate-400">
                Folder
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {folderToDelete.name}
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
              Delete Folder
            </Button>

          </div>

        </div>

      </Modal>

    </div>
  );
};

export default FolderList;