import { useState } from "react";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import FolderList from "../../components/workspace/FolderList";
import DocumentList from "../../components/workspace/DocumentList";
import WorkspaceCard from "../../components/workspace/WorkspaceCard";

const WorkSpace = () => {
  // ================= WORKSPACES =================

  const [workspaces, setWorkspaces] = useState([
    {
      id: 1,
      name: "My Projects",
      documentCount: 5,
      members: [
        {
          id: 1,
          name: "Fiza",
          initials: "F",
          role: "Owner",
        },
        {
          id: 2,
          name: "Ali",
          initials: "A",
          role: "Editor",
        },
        {
          id: 3,
          name: "Sara",
          initials: "S",
          role: "Viewer",
        },
        {
          id: 4,
          name: "Ahmed",
          initials: "A",
          role: "Editor",
        },
        {
          id: 5,
          name: "Zara",
          initials: "Z",
          role: "Viewer",
        },
      ],
    },

    {
      id: 2,
      name: "University",
      documentCount: 3,
      members: [
        {
          id: 1,
          name: "Fiza",
          initials: "F",
          role: "Owner",
        },
        {
          id: 2,
          name: "Ali",
          initials: "A",
          role: "Editor",
        },
      ],
    },

    {
      id: 3,
      name: "Personal",
      documentCount: 2,
      members: [
        {
          id: 1,
          name: "Fiza",
          initials: "F",
          role: "Owner",
        },
      ],
    },
  ]);

  // ================= CREATE WORKSPACE =================

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");

  const handleCreateWorkspace = (e) => {
    e.preventDefault();

    if (!workspaceName.trim()) return;

    const newWorkspace = {
      id: Date.now(),
      name: workspaceName.trim(),
      documentCount: 0,

      // Creator becomes Owner
      members: [
        {
          id: Date.now(),
          name: "Fiza",
          initials: "F",
          role: "Owner",
        },
      ],
    };

    setWorkspaces((prevWorkspaces) => [
      ...prevWorkspaces,
      newWorkspace,
    ]);

    setWorkspaceName("");
    setIsModalOpen(false);
  };

  // ================= RENAME =================

  const handleRename = (workspace) => {
    const newName = window.prompt(
      "Enter new workspace name:",
      workspace.name
    );

    if (!newName || !newName.trim()) return;

    setWorkspaces((prevWorkspaces) =>
      prevWorkspaces.map((item) =>
        item.id === workspace.id
          ? {
              ...item,
              name: newName.trim(),
            }
          : item
      )
    );
  };

  // ================= DELETE =================

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this workspace?"
    );

    if (!confirmDelete) return;

    setWorkspaces((prevWorkspaces) =>
      prevWorkspaces.filter(
        (workspace) => workspace.id !== id
      )
    );
  };

  // ================= UI =================

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-7">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            {/* Heading */}
            <div>

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-xl text-white shadow-sm">
                  📁
                </div>

                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Workspaces
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Organize your documents and collaborate with your team.
                  </p>
                </div>

              </div>

            </div>

            {/* Create Button */}
            <Button onClick={() => setIsModalOpen(true)}>
              + New Workspace
            </Button>

          </div>

        </div>
      </div>


      {/* ================================================= */}
      {/* MAIN CONTENT */}
      {/* ================================================= */}

      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* ================================================= */}
        {/* WORKSPACE SECTION */}
        {/* ================================================= */}

        <section>

          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Your Workspaces
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Access your projects, folders and team documents.
              </p>
            </div>

            {/* Workspace Count */}
            <span className="w-fit rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600">
              {workspaces.length}{" "}
              {workspaces.length === 1
                ? "workspace"
                : "workspaces"}
            </span>

          </div>


          {/* Workspace Cards */}

          {workspaces.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {workspaces.map((workspace) => (
                <WorkspaceCard
                  key={workspace.id}
                  workspace={workspace}
                  onRename={handleRename}
                  onDelete={handleDelete}
                />
              ))}

            </div>
          ) : (

            /* Empty State */

            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
                📁
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                No workspaces yet
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
                Create your first workspace to start organizing documents and collaborating with your team.
              </p>

              <div className="mt-5">
                <Button onClick={() => setIsModalOpen(true)}>
                  + Create Workspace
                </Button>
              </div>

            </div>
          )}

        </section>


        {/* ================================================= */}
        {/* FOLDERS */}
        {/* ================================================= */}

        <section className="mt-10">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <FolderList />

          </div>

        </section>


        {/* ================================================= */}
        {/* DOCUMENTS */}
        {/* ================================================= */}

        <section className="mt-6">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <DocumentList />

          </div>

        </section>

      </main>


      {/* ================================================= */}
      {/* CREATE WORKSPACE MODAL */}
      {/* ================================================= */}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
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
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />

          <p className="mt-2 text-xs text-slate-400">
            You will automatically become the owner of this workspace.
          </p>


          {/* Buttons */}

          <div className="mt-6 flex justify-end gap-3">

            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setWorkspaceName("");
              }}
            >
              Cancel
            </Button>

            <Button type="submit">
              Create Workspace
            </Button>

          </div>

        </form>

      </Modal>

    </div>
  );
};

export default WorkSpace;