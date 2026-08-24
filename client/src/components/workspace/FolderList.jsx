import { useState } from "react";
import Button from "../common/Button";
import Modal from "../common/Modal";

const FolderList = () => {
  const [folders, setFolders] = useState([
    { id: 1, name: "Projects" },
    { id: 2, name: "Documents" },
    { id: 3, name: "Personal" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [folderName, setFolderName] = useState("");

  const [editingFolder, setEditingFolder] = useState(null);

  // CREATE
  const handleCreateFolder = (e) => {
    e.preventDefault();

    if (!folderName.trim()) return;

    if (editingFolder) {
      // UPDATE
      setFolders((prev) =>
        prev.map((folder) =>
          folder.id === editingFolder.id
            ? { ...folder, name: folderName.trim() }
            : folder
        )
      );

      setEditingFolder(null);
    } else {
      // CREATE
      setFolders((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: folderName.trim(),
        },
      ]);
    }

    setFolderName("");
    setIsModalOpen(false);
  };

  // RENAME
  const handleRename = (folder) => {
    setEditingFolder(folder);
    setFolderName(folder.name);
    setIsModalOpen(true);
  };

  // DELETE
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this folder?"
    );

    if (!confirmDelete) return;

    setFolders((prev) => prev.filter((folder) => folder.id !== id));
  };

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#1E293B]">
          Folders
        </h2>

        <Button
          onClick={() => {
            setEditingFolder(null);
            setFolderName("");
            setIsModalOpen(true);
          }}
        >
          + New Folder
        </Button>
      </div>

      {/* Folder Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {folders.map((folder) => (
          <div
            key={folder.id}
            className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📁</span>

              <span className="font-medium text-[#1E293B]">
                {folder.name}
              </span>
            </div>

            <div className="relative">
              <button
                type="button"
                className="text-xl text-slate-400 hover:text-slate-700"
                onClick={() => {
                  const action = window.prompt(
                    "Type 'rename' or 'delete':"
                  );

                  if (action === "rename") {
                    handleRename(folder);
                  }

                  if (action === "delete") {
                    handleDelete(folder.id);
                  }
                }}
              >
                ⋮
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Rename Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingFolder(null);
          setFolderName("");
        }}
        title={editingFolder ? "Rename Folder" : "Create Folder"}
      >
        <form onSubmit={handleCreateFolder}>
          <label className="mb-2 block text-sm font-medium text-[#1E293B]">
            Folder Name
          </label>

          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Enter folder name"
            className="w-full rounded-lg border border-[#E2E8F0] px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#4F46E5]"
          />

          <div className="mt-5 flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setEditingFolder(null);
                setFolderName("");
              }}
            >
              Cancel
            </Button>

            <Button type="submit">
              {editingFolder ? "Save Changes" : "Create Folder"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FolderList;