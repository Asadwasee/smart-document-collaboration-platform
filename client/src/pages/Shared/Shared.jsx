import {
  Clock3,
  FileText,
  MoreHorizontal,
  Search,
  UserRound,
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";

const sharedDocuments = [
  {
    id: 1,
    title: "Meeting Notes",
    owner: "Aliyan",
    workspace: "Team Workspace",
    role: "Editor",
    updated: "1 hour ago",
  },
  {
    id: 2,
    title: "Project Proposal",
    owner: "Fiza",
    workspace: "Internship Project",
    role: "Commenter",
    updated: "Yesterday",
  },
  {
    id: 3,
    title: "Research Document",
    owner: "Wasif",
    workspace: "Research Team",
    role: "Viewer",
    updated: "2 days ago",
  },
];

function Shared() {
  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-medium text-[#4F46E5]">
            Collaboration
          </p>

          <h1 className="mt-1 text-2xl font-semibold text-[#1E293B] sm:text-3xl">
            Shared with Me
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Documents that other users have shared with you.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-xl">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search shared documents..."
              className="w-full rounded-xl border border-[#E2E8F0] bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        {/* Documents */}
        <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">

          {sharedDocuments.map((document) => (
            <div
              key={document.id}
              className="flex flex-col gap-4 border-b border-[#E2E8F0] p-5 last:border-b-0 hover:bg-slate-50 sm:flex-row sm:items-center"
            >
              {/* Icon */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-[#4F46E5]">
                <FileText size={20} />
              </div>

              {/* Document info */}
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-[#1E293B]">
                  {document.title}
                </h3>

                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <UserRound size={13} />
                    {document.owner}
                  </span>

                  <span>{document.workspace}</span>

                  <span className="flex items-center gap-1">
                    <Clock3 size={13} />
                    {document.updated}
                  </span>
                </div>
              </div>

              {/* Permission */}
              <span
                className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                  document.role === "Editor"
                    ? "bg-indigo-50 text-[#4F46E5]"
                    : document.role === "Commenter"
                    ? "bg-teal-50 text-teal-600"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {document.role}
              </span>

              {/* Menu */}
              <button
                type="button"
                className="w-fit rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label={`More options for ${document.title}`}
              >
                <MoreHorizontal size={18} />
              </button>
            </div>
          ))}
        </div>

        <p className="mt-4 text-sm text-slate-400">
          {sharedDocuments.length} shared documents
        </p>
      </div>
    </DashboardLayout>
  );
}

export default Shared;