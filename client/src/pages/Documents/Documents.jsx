import {
  Clock3,
  FileText,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Button from "../../components/common/Button";

const documents = [
  {
    id: 1,
    title: "Project Requirements",
    workspace: "Internship Project",
    updated: "2 minutes ago",
    size: "24 KB",
  },
  {
    id: 2,
    title: "Research Document",
    workspace: "Personal",
    updated: "3 hours ago",
    size: "42 KB",
  },
  {
    id: 3,
    title: "Final Year Project",
    workspace: "University",
    updated: "Yesterday",
    size: "86 KB",
  },
  {
    id: 4,
    title: "Meeting Notes",
    workspace: "Team Workspace",
    updated: "2 days ago",
    size: "18 KB",
  },
];

function Documents() {
  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-[#4F46E5]">
              Documents
            </p>

            <h1 className="mt-1 text-2xl font-semibold text-[#1E293B] sm:text-3xl">
              My Documents
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage and organize the documents you have created.
            </p>
          </div>

          <Button>
            <Plus size={18} className="mr-2" />
            New Document
          </Button>
        </div>

        {/* Search / Filter */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search your documents..."
              className="w-full rounded-xl border border-[#E2E8F0] bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <select className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-slate-600 outline-none focus:border-[#4F46E5]">
            <option>All Workspaces</option>
            <option>Internship Project</option>
            <option>University</option>
            <option>Personal</option>
          </select>
        </div>

        {/* Documents */}
        <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">

          {/* Table Header */}
          <div className="hidden border-b border-[#E2E8F0] bg-slate-50 px-5 py-3 text-xs font-medium uppercase tracking-wide text-slate-500 sm:grid sm:grid-cols-[1fr_200px_150px_40px]">
            <span>Document</span>
            <span>Workspace</span>
            <span>Last Updated</span>
            <span />
          </div>

          {documents.map((document) => (
            <div
              key={document.id}
              className="flex flex-col gap-3 border-b border-[#E2E8F0] p-4 last:border-b-0 hover:bg-slate-50 sm:grid sm:grid-cols-[1fr_200px_150px_40px] sm:items-center sm:px-5"
            >
              {/* Document */}
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-[#4F46E5]">
                  <FileText size={19} />
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-sm font-medium text-[#1E293B]">
                    {document.title}
                  </h3>

                  <p className="mt-1 text-xs text-slate-400">
                    {document.size}
                  </p>
                </div>
              </div>

              {/* Workspace */}
              <span className="text-sm text-slate-500">
                {document.workspace}
              </span>

              {/* Updated */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Clock3 size={14} />
                {document.updated}
              </div>

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

        {/* Count */}
        <p className="mt-4 text-sm text-slate-400">
          {documents.length} documents
        </p>
      </div>
    </DashboardLayout>
  );
}

export default Documents;