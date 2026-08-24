import { useState } from "react";
import Button from "../common/Button";

const WorkspaceCard = ({ workspace, onRename, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Temporary team data for UI
  const members = workspace.members || [
    { id: 1, name: "Fiza", initials: "F", role: "Owner" },
    { id: 2, name: "Ali", initials: "A", role: "Editor" },
    { id: 3, name: "Sara", initials: "S", role: "Viewer" },
  ];

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg">

      {/* Top accent */}
      <div className="absolute inset-x-0 top-0 h-1 bg-indigo-600 opacity-0 transition group-hover:opacity-100" />

      {/* Header */}
      <div className="flex items-start justify-between">

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-xl">
          📁
        </div>

        {/* Menu */}
        <div className="relative">

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            ⋮
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-10 z-20 w-32 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl">

              <button
                type="button"
                onClick={() => {
                  onRename(workspace);
                  setMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50"
              >
                Rename
              </button>

              <button
                type="button"
                onClick={() => {
                  onDelete(workspace.id);
                  setMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50"
              >
                Delete
              </button>

            </div>
          )}

        </div>
      </div>


      {/* Workspace Information */}
      <div className="mt-5">

        <h3 className="truncate text-lg font-semibold text-slate-900">
          {workspace.name}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Workspace
        </p>

      </div>


      {/* Stats */}
      <div className="mt-5 grid grid-cols-2 gap-3">

        <div className="rounded-xl bg-slate-50 px-3 py-2.5">
          <p className="text-xs text-slate-400">
            Documents
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-700">
            {workspace.documentCount}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 px-3 py-2.5">
          <p className="text-xs text-slate-400">
            Members
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-700">
            {members.length}
          </p>
        </div>

      </div>


      {/* Team Members */}
      <div className="mt-5">

        <div className="mb-2 flex items-center justify-between">

          <span className="text-xs font-medium text-slate-500">
            Team
          </span>

          <button
            type="button"
            onClick={() =>
              console.log("Manage team:", workspace.name)
            }
            className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
          >
            Manage
          </button>

        </div>


        <div className="flex items-center justify-between">

          {/* Avatars */}
          <div className="flex -space-x-2">

            {members.slice(0, 3).map((member) => (
              <div
                key={member.id}
                title={`${member.name} — ${member.role}`}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-indigo-100 text-xs font-semibold text-indigo-600"
              >
                {member.initials}
              </div>
            ))}

            {members.length > 3 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-xs font-semibold text-slate-500">
                +{members.length - 3}
              </div>
            )}

          </div>

          <span className="text-xs text-slate-400">
            {members.length} members
          </span>

        </div>

      </div>


      {/* Open Workspace */}
      <div className="mt-5 border-t border-slate-100 pt-4">

        <Button
          variant="ghost"
          className="w-full justify-between px-2"
          onClick={() =>
            console.log("Open workspace:", workspace.name)
          }
        >
          Open workspace
          <span>→</span>
        </Button>

      </div>

    </div>
  );
};

export default WorkspaceCard;