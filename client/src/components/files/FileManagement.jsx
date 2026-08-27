import { useRef, useState } from "react";
import {
  Upload,
  Folder,
  FolderPlus,
  FileText,
  FileImage,
  FileSpreadsheet,
  File,
  Download,
  Pencil,
  Trash2,
  MoreVertical,
  Search,
  X,
  Check,
  ChevronDown,
  FolderOpen,
} from "lucide-react";

const initialFiles = [
  {
    id: 1,
    name: "Project Requirements.pdf",
    type: "pdf",
    size: "2.4 MB",
    folder: "Documents",
    updated: "Today",
  },
  {
    id: 2,
    name: "UI Design.png",
    type: "image",
    size: "1.8 MB",
    folder: "Design",
    updated: "Yesterday",
  },
  {
    id: 3,
    name: "Team Data.xlsx",
    type: "excel",
    size: "540 KB",
    folder: "Documents",
    updated: "2 days ago",
  },
  {
    id: 4,
    name: "Meeting Notes.docx",
    type: "doc",
    size: "890 KB",
    folder: "Documents",
    updated: "3 days ago",
  },
];

const initialFolders = [
  {
    id: 1,
    name: "Documents",
  },
  {
    id: 2,
    name: "Design",
  },
];

const getFileIcon = (type) => {
  if (type === "image") {
    return <FileImage size={22} className="text-purple-500" />;
  }

  if (type === "excel") {
    return <FileSpreadsheet size={22} className="text-green-600" />;
  }

  if (type === "pdf") {
    return <FileText size={22} className="text-red-500" />;
  }

  if (type === "doc") {
    return <FileText size={22} className="text-blue-500" />;
  }

  return <File size={22} className="text-slate-500" />;
};

const getFileType = (fileName) => {
  const extension = fileName.split(".").pop()?.toLowerCase();

  if (["png", "jpg", "jpeg", "gif", "webp"].includes(extension)) {
    return "image";
  }

  if (["xlsx", "xls", "csv"].includes(extension)) {
    return "excel";
  }

  if (extension === "pdf") {
    return "pdf";
  }

  if (["doc", "docx"].includes(extension)) {
    return "doc";
  }

  return "file";
};

const FileManagement = () => {
  const fileInputRef = useRef(null);

  const [files, setFiles] = useState(initialFiles);
  const [folders, setFolders] = useState(initialFolders);

  const [selectedFolder, setSelectedFolder] = useState("All Files");

  const [search, setSearch] = useState("");

  const [openMenu, setOpenMenu] = useState(null);

  const [editingFile, setEditingFile] = useState(null);
  const [newFileName, setNewFileName] = useState("");

  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const [moveFile, setMoveFile] = useState(null);

  // =========================
  // UPLOAD FILE
  // =========================

  const handleUpload = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (!selectedFiles.length) return;

    const uploadedFiles = selectedFiles.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      type: getFileType(file.name),
      size: formatFileSize(file.size),
      folder:
        selectedFolder === "All Files"
          ? "Documents"
          : selectedFolder,
      updated: "Just now",
      originalFile: file,
    }));

    setFiles((prev) => [...uploadedFiles, ...prev]);

    event.target.value = "";
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // =========================
  // DOWNLOAD
  // =========================

  const handleDownload = (file) => {
    if (!file.originalFile) {
      alert(`Download "${file.name}" will be connected to the backend API.`);
      return;
    }

    const url = URL.createObjectURL(file.originalFile);

    const link = document.createElement("a");

    link.href = url;
    link.download = file.name;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this file?"
    );

    if (!confirmDelete) return;

    setFiles((prev) => prev.filter((file) => file.id !== id));

    setOpenMenu(null);
  };

  // =========================
  // RENAME
  // =========================

  const startRename = (file) => {
    setEditingFile(file.id);
    setNewFileName(file.name);
    setOpenMenu(null);
  };

  const saveRename = (id) => {
    if (!newFileName.trim()) return;

    setFiles((prev) =>
      prev.map((file) =>
        file.id === id
          ? {
              ...file,
              name: newFileName.trim(),
            }
          : file
      )
    );

    setEditingFile(null);
    setNewFileName("");
  };

  // =========================
  // CREATE FOLDER
  // =========================

  const createFolder = () => {
    const name = newFolderName.trim();

    if (!name) return;

    const alreadyExists = folders.some(
      (folder) => folder.name.toLowerCase() === name.toLowerCase()
    );

    if (alreadyExists) {
      alert("Folder already exists.");
      return;
    }

    setFolders((prev) => [
      ...prev,
      {
        id: Date.now(),
        name,
      },
    ]);

    setNewFolderName("");
    setShowNewFolder(false);
  };

  // =========================
  // MOVE FILE
  // =========================

  const handleMoveFile = (folderName) => {
    if (!moveFile) return;

    setFiles((prev) =>
      prev.map((file) =>
        file.id === moveFile.id
          ? {
              ...file,
              folder: folderName,
            }
          : file
      )
    );

    setMoveFile(null);
  };

  // =========================
  // FILTER
  // =========================

  const filteredFiles = files.filter((file) => {
    const matchesFolder =
      selectedFolder === "All Files" ||
      file.folder === selectedFolder;

    const matchesSearch = file.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesFolder && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">

      {/* ================= HEADER ================= */}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            File Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Upload, organize and manage your files.
          </p>
        </div>

        <div className="flex gap-2">

          {/* New Folder */}

          <button
            onClick={() => setShowNewFolder(true)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <FolderPlus size={18} />
            New Folder
          </button>

          {/* Upload */}

          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleUpload}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Upload size={18} />
            Upload Files
          </button>
        </div>
      </div>

      {/* ================= MAIN CARD ================= */}

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

        {/* ================= TOOLBAR ================= */}

        <div className="flex flex-col gap-4 border-b border-slate-200 p-4 md:flex-row md:items-center md:justify-between">

          {/* Search */}

          <div className="relative w-full md:max-w-md">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search files..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* File Count */}

          <div className="text-sm text-slate-500">
            {filteredFiles.length} file
            {filteredFiles.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* ================= CONTENT ================= */}

        <div className="flex flex-col md:flex-row">

          {/* ================= FOLDER SIDEBAR ================= */}

          <aside className="w-full border-b border-slate-200 p-4 md:w-60 md:border-b-0 md:border-r">

            <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Folders
            </p>

            <div className="space-y-1">

              {/* All Files */}

              <button
                onClick={() => setSelectedFolder("All Files")}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                  selectedFolder === "All Files"
                    ? "bg-indigo-50 font-medium text-indigo-600"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <FolderOpen size={18} />
                All Files

                <span className="ml-auto text-xs text-slate-400">
                  {files.length}
                </span>
              </button>

              {/* Folders */}

              {folders.map((folder) => {
                const folderCount = files.filter(
                  (file) => file.folder === folder.name
                ).length;

                return (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolder(folder.name)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                      selectedFolder === folder.name
                        ? "bg-indigo-50 font-medium text-indigo-600"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Folder size={18} />

                    <span className="truncate">
                      {folder.name}
                    </span>

                    <span className="ml-auto text-xs text-slate-400">
                      {folderCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* ================= FILE LIST ================= */}

          <section className="min-w-0 flex-1">

            {/* Table Header */}

            <div className="hidden grid-cols-[minmax(0,1fr)_120px_130px_50px] border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400 md:grid">
              <span>Name</span>
              <span>Size</span>
              <span>Updated</span>
              <span></span>
            </div>

            {/* Files */}

            {filteredFiles.length > 0 ? (
              <div className="divide-y divide-slate-100">

                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className="group relative grid gap-3 px-4 py-4 transition hover:bg-slate-50 md:grid-cols-[minmax(0,1fr)_120px_130px_50px] md:items-center md:px-5"
                  >

                    {/* FILE NAME */}

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                        {getFileIcon(file.type)}
                      </div>

                      <div className="min-w-0 flex-1">

                        {editingFile === file.id ? (
                          <div className="flex items-center gap-2">

                            <input
                              autoFocus
                              value={newFileName}
                              onChange={(e) =>
                                setNewFileName(e.target.value)
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  saveRename(file.id);
                                }

                                if (e.key === "Escape") {
                                  setEditingFile(null);
                                }
                              }}
                              className="h-9 w-full rounded-md border border-indigo-300 px-2 text-sm outline-none focus:ring-2 focus:ring-indigo-100"
                            />

                            <button
                              onClick={() => saveRename(file.id)}
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-green-50 text-green-600 hover:bg-green-100"
                            >
                              <Check size={16} />
                            </button>

                            <button
                              onClick={() => setEditingFile(null)}
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500 hover:bg-slate-200"
                            >
                              <X size={16} />
                            </button>

                          </div>
                        ) : (
                          <>
                            <p className="truncate text-sm font-medium text-slate-700">
                              {file.name}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              {file.folder}
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* SIZE */}

                    <div className="hidden text-sm text-slate-500 md:block">
                      {file.size}
                    </div>

                    {/* UPDATED */}

                    <div className="hidden text-sm text-slate-500 md:block">
                      {file.updated}
                    </div>

                    {/* MENU */}

                    <div className="relative flex justify-end">

                      <button
                        onClick={() =>
                          setOpenMenu(
                            openMenu === file.id
                              ? null
                              : file.id
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-md text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {openMenu === file.id && (
                        <div className="absolute right-0 top-10 z-30 w-44 rounded-lg border border-slate-200 bg-white p-1.5 shadow-xl">

                          {/* Download */}

                          <button
                            onClick={() => {
                              handleDownload(file);
                              setOpenMenu(null);
                            }}
                            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                          >
                            <Download size={16} />
                            Download
                          </button>

                          {/* Rename */}

                          <button
                            onClick={() => startRename(file)}
                            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                          >
                            <Pencil size={16} />
                            Rename
                          </button>

                          {/* Move */}

                          <button
                            onClick={() => {
                              setMoveFile(file);
                              setOpenMenu(null);
                            }}
                            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                          >
                            <Folder size={16} />
                            Move to folder
                          </button>

                          <div className="my-1 border-t border-slate-100" />

                          {/* Delete */}

                          <button
                            onClick={() => handleDelete(file.id)}
                            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>

                        </div>
                      )}
                    </div>

                    {/* MOBILE INFO */}

                    <div className="ml-13 flex gap-3 text-xs text-slate-400 md:hidden">
                      <span>{file.size}</span>
                      <span>•</span>
                      <span>{file.updated}</span>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              /* EMPTY STATE */

              <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">

                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                  <FolderOpen
                    size={30}
                    className="text-slate-400"
                  />
                </div>

                <h3 className="font-semibold text-slate-700">
                  No files found
                </h3>

                <p className="mt-1 max-w-sm text-sm text-slate-400">
                  Upload a file or choose another folder to see
                  your files here.
                </p>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  <Upload size={17} />
                  Upload File
                </button>

              </div>
            )}
          </section>
        </div>
      </div>

      {/* ================= NEW FOLDER MODAL ================= */}

      {showNewFolder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">

          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">

            <div className="mb-5 flex items-center justify-between">

              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Create New Folder
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Give your folder a name.
                </p>
              </div>

              <button
                onClick={() => setShowNewFolder(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>

            </div>

            <input
              autoFocus
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  createFolder();
                }
              }}
              placeholder="e.g. Project Files"
              className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />

            <div className="mt-5 flex justify-end gap-2">

              <button
                onClick={() => setShowNewFolder(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={createFolder}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Create Folder
              </button>

            </div>
          </div>
        </div>
      )}

      {/* ================= MOVE FILE MODAL ================= */}

      {moveFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">

          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">

            <div className="mb-5 flex items-start justify-between">

              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Move File
                </h2>

                <p className="mt-1 truncate text-sm text-slate-400">
                  {moveFile.name}
                </p>
              </div>

              <button
                onClick={() => setMoveFile(null)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>

            </div>

            <div className="space-y-2">

              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => handleMoveFile(folder.name)}
                  className="flex w-full items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 text-left text-sm text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                >
                  <Folder size={19} />
                  {folder.name}

                  <ChevronDown
                    size={16}
                    className="ml-auto -rotate-90"
                  />
                </button>
              ))}

            </div>

            <button
              onClick={() => setMoveFile(null)}
              className="mt-5 w-full rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default FileManagement;