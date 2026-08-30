import { useEffect, useState } from "react";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import FolderList from "../../components/workspace/FolderList";
import DocumentList from "../../components/workspace/DocumentList";
import WorkspaceCard from "../../components/workspace/WorkspaceCard";
import api from "../../api/api";

const WorkSpace = () => {
  // ================= WORKSPACES =================

  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= CREATE WORKSPACE =================

  const [isCreateModalOpen, setIsCreateModalOpen] =
    useState(false);

  const [workspaceName, setWorkspaceName] =
    useState("");

  const [creatingWorkspace, setCreatingWorkspace] =
    useState(false);

  // ================= SELECTED WORKSPACE =================

  const [selectedWorkspace, setSelectedWorkspace] =
    useState(null);

  // ================= REFRESH =================

  const [refreshKey, setRefreshKey] = useState(0);

  // ================= RENAME WORKSPACE =================

  const [workspaceToRename, setWorkspaceToRename] =
    useState(null);

  const [renameWorkspaceName, setRenameWorkspaceName] =
    useState("");

  const [renamingWorkspace, setRenamingWorkspace] =
    useState(false);

  // ================= DELETE WORKSPACE =================

  const [workspaceToDelete, setWorkspaceToDelete] =
    useState(null);

  const [deletingWorkspace, setDeletingWorkspace] =
    useState(false);

  // ================= LOAD WORKSPACES =================

  useEffect(() => {
    const loadWorkspaces = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/workspaces");

        setWorkspaces(
          response.data.workspaces || []
        );
      } catch (error) {
        console.error(
          "Failed to load workspaces:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load workspaces. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadWorkspaces();
  }, [refreshKey]);

  // ================= CREATE WORKSPACE =================

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();

    if (!workspaceName.trim()) return;

    try {
      setCreatingWorkspace(true);
      setError("");

      const response = await api.post("/workspaces", {
        name: workspaceName.trim(),
        description: "",
      });

      const createdWorkspace =
        response.data.workspace;

      setWorkspaces((prev) => [
        createdWorkspace,
        ...prev,
      ]);

      setWorkspaceName("");
      setIsCreateModalOpen(false);

      // Automatically open newly created workspace
      setSelectedWorkspace(createdWorkspace);

      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error(
        "Failed to create workspace:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to create workspace."
      );
    } finally {
      setCreatingWorkspace(false);
    }
  };

  // ================= OPEN WORKSPACE =================

  const handleOpenWorkspace = (workspace) => {
    setSelectedWorkspace(workspace);

    setRefreshKey((prev) => prev + 1);
  };

  // ================= RENAME WORKSPACE =================

  const openRenameWorkspace = (workspace) => {
    setWorkspaceToRename(workspace);
    setRenameWorkspaceName(workspace.name);
  };

  const closeRenameWorkspace = () => {
    if (renamingWorkspace) return;

    setWorkspaceToRename(null);
    setRenameWorkspaceName("");
  };

  const handleRenameWorkspace = async (e) => {
    e.preventDefault();

    if (!workspaceToRename) return;

    if (!renameWorkspaceName.trim()) return;

    try {
      setRenamingWorkspace(true);

      const response = await api.patch(
        `/workspaces/${workspaceToRename._id}`,
        {
          name: renameWorkspaceName.trim(),
        }
      );

      const updatedWorkspace =
        response.data.workspace;

      setWorkspaces((prev) =>
        prev.map((workspace) =>
          workspace._id === updatedWorkspace._id
            ? updatedWorkspace
            : workspace
        )
      );

      if (
        selectedWorkspace?._id ===
        updatedWorkspace._id
      ) {
        setSelectedWorkspace(updatedWorkspace);
      }

      closeRenameWorkspace();
    } catch (error) {
      console.error(
        "Failed to rename workspace:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to rename workspace."
      );
    } finally {
      setRenamingWorkspace(false);
    }
  };

  // ================= DELETE WORKSPACE =================

  const openDeleteWorkspace = (workspace) => {
    setWorkspaceToDelete(workspace);
  };

  const closeDeleteWorkspace = () => {
    if (deletingWorkspace) return;

    setWorkspaceToDelete(null);
  };

  const handleDeleteWorkspace = async () => {
    if (!workspaceToDelete) return;

    try {
      setDeletingWorkspace(true);

      await api.delete(
        `/workspaces/${workspaceToDelete._id}`
      );

      const deletedId = workspaceToDelete._id;

      setWorkspaces((prev) =>
        prev.filter(
          (workspace) =>
            workspace._id !== deletedId
        )
      );

      if (
        selectedWorkspace?._id === deletedId
      ) {
        setSelectedWorkspace(null);
      }

      setWorkspaceToDelete(null);

      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error(
        "Failed to delete workspace:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete workspace."
      );
    } finally {
      setDeletingWorkspace(false);
    }
  };

  // ================= FOLDER DELETED =================

  const handleFolderDeleted = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // ================= DOCUMENT CHANGED =================

  const handleDocumentChanged = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // ================= UI =================

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* ================= HEADER ================= */}

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-7">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-xl text-white shadow-sm">
                📁
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Workspaces
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Organize your documents and
                  collaborate with your team.
                </p>
              </div>

            </div>

            <Button
              onClick={() => {
                setWorkspaceName("");
                setError("");
                setIsCreateModalOpen(true);
              }}
            >
              + New Workspace
            </Button>

          </div>

        </div>
      </div>

      {/* ================= MAIN ================= */}

      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* ================= WORKSPACES ================= */}

        <section>

          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Your Workspaces
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Access your projects, folders and
                team documents.
              </p>
            </div>

            <span className="w-fit rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600">
              {workspaces.length}{" "}
              {workspaces.length === 1
                ? "workspace"
                : "workspaces"}
            </span>

          </div>

          {error && (
            <div className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {loading ? (

            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">
              <p className="text-sm text-slate-500">
                Loading workspaces...
              </p>
            </div>

          ) : workspaces.length > 0 ? (

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {workspaces.map((workspace) => (
                <WorkspaceCard
                  key={workspace._id}
                  workspace={workspace}
                  onOpen={handleOpenWorkspace}
                  onRename={openRenameWorkspace}
                  onDelete={openDeleteWorkspace}
                />
              ))}

            </div>

          ) : (

            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
                📁
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                No workspaces yet
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
                Create your first workspace to start
                organizing documents and collaborating
                with your team.
              </p>

              <div className="mt-5">

                <Button
                  onClick={() => {
                    setWorkspaceName("");
                    setError("");
                    setIsCreateModalOpen(true);
                  }}
                >
                  + Create Workspace
                </Button>

              </div>

            </div>

          )}

        </section>

        {/* ================= SELECTED WORKSPACE ================= */}

        {selectedWorkspace && (
          <>
            <div className="mt-8 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs font-medium text-indigo-500">
                    OPEN WORKSPACE
                  </p>

                  <p className="mt-1 text-sm font-semibold text-indigo-900">
                    {selectedWorkspace.name}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedWorkspace(null)
                  }
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                >
                  Close
                </button>

              </div>

            </div>

            {/* ================= FOLDERS ================= */}

            <section className="mt-8">

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <FolderList
                  workspaceId={
                    selectedWorkspace._id
                  }
                  refreshTrigger={refreshKey}
                  onFolderDeleted={
                    handleFolderDeleted
                  }
                />

              </div>

            </section>

            {/* ================= DOCUMENTS ================= */}

            <section className="mt-6">

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <DocumentList
                  workspaceId={
                    selectedWorkspace._id
                  }
                  refreshTrigger={refreshKey}
                  onDocumentChanged={
                    handleDocumentChanged
                  }
                />

              </div>

            </section>
          </>
        )}

        {!selectedWorkspace && (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">

            <div className="text-3xl">
              📂
            </div>

            <h3 className="mt-3 text-lg font-semibold text-slate-800">
              Select a workspace
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Click "Open workspace" on a workspace
              above to view its folders and documents.
            </p>

          </div>
        )}

      </main>

      {/* ========================================================= */}
      {/* CREATE WORKSPACE MODAL */}
      {/* ========================================================= */}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          if (creatingWorkspace) return;

          setIsCreateModalOpen(false);
          setWorkspaceName("");
        }}
        title="Create Workspace"
      >

        <form onSubmit={handleCreateWorkspace}>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Workspace Name
          </label>

          <input
            type="text"
            value={workspaceName}
            onChange={(e) =>
              setWorkspaceName(e.target.value)
            }
            placeholder="e.g. Marketing Project"
            autoFocus
            disabled={creatingWorkspace}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />

          <p className="mt-2 text-xs text-slate-400">
            You will automatically become the owner
            of this workspace.
          </p>

          <div className="mt-6 flex justify-end gap-3">

            <Button
              type="button"
              variant="secondary"
              disabled={creatingWorkspace}
              onClick={() => {
                setIsCreateModalOpen(false);
                setWorkspaceName("");
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              loading={creatingWorkspace}
              disabled={
                creatingWorkspace ||
                !workspaceName.trim()
              }
            >
              Create Workspace
            </Button>

          </div>

        </form>

      </Modal>

      {/* ========================================================= */}
      {/* RENAME WORKSPACE MODAL */}
      {/* ========================================================= */}

      <Modal
        isOpen={Boolean(workspaceToRename)}
        onClose={closeRenameWorkspace}
        title="Rename Workspace"
      >

        <form onSubmit={handleRenameWorkspace}>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Workspace Name
          </label>

          <input
            type="text"
            value={renameWorkspaceName}
            onChange={(e) =>
              setRenameWorkspaceName(e.target.value)
            }
            autoFocus
            disabled={renamingWorkspace}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />

          <div className="mt-6 flex justify-end gap-3">

            <Button
              type="button"
              variant="secondary"
              disabled={renamingWorkspace}
              onClick={closeRenameWorkspace}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              loading={renamingWorkspace}
              disabled={
                renamingWorkspace ||
                !renameWorkspaceName.trim()
              }
            >
              Save Changes
            </Button>

          </div>

        </form>

      </Modal>

      {/* ========================================================= */}
      {/* DELETE WORKSPACE MODAL */}
      {/* ========================================================= */}

      <Modal
        isOpen={Boolean(workspaceToDelete)}
        onClose={closeDeleteWorkspace}
        title="Delete Workspace"
      >

        <div>

          <div className="rounded-xl bg-red-50 p-4">

            <p className="text-sm font-medium text-red-800">
              Are you sure you want to delete this
              workspace?
            </p>

            <p className="mt-2 text-sm text-red-600">
              This will permanently delete the
              workspace, its folders, documents and
              document versions.
            </p>

          </div>

          {workspaceToDelete && (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">

              <p className="text-xs text-slate-400">
                Workspace
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {workspaceToDelete.name}
              </p>

            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">

            <Button
              type="button"
              variant="secondary"
              disabled={deletingWorkspace}
              onClick={closeDeleteWorkspace}
            >
              Cancel
            </Button>

            <Button
              type="button"
              loading={deletingWorkspace}
              disabled={deletingWorkspace}
              onClick={handleDeleteWorkspace}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Workspace
            </Button>

          </div>

        </div>

      </Modal>

    </div>
  );
};

export default WorkSpace;