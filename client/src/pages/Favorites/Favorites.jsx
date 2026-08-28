import {
  Clock3,
  FileText,
  Folder,
  MoreHorizontal,
  Search,
  Star,
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";

const favoriteItems = [
  {
    id: 1,
    type: "document",
    title: "Project Requirements",
    location: "Internship Project",
    updated: "2 minutes ago",
  },
  {
    id: 2,
    type: "document",
    title: "Final Year Project",
    location: "University",
    updated: "Yesterday",
  },
  {
    id: 3,
    type: "folder",
    title: "Important Documents",
    location: "Personal",
    updated: "3 days ago",
  },
];

function Favorites() {
  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-medium text-[#4F46E5]">
            Saved items
          </p>

          <h1 className="mt-1 flex items-center gap-2 text-2xl font-semibold text-[#1E293B] sm:text-3xl">
            Favorites
            <Star
              size={24}
              className="fill-yellow-400 text-yellow-400"
            />
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Quickly access documents and folders you have marked as favorites.
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
              placeholder="Search favorites..."
              className="w-full rounded-xl border border-[#E2E8F0] bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        {/* Favorites */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favoriteItems.map((item) => {
            const isFolder = item.type === "folder";

            return (
              <div
                key={item.id}
                className="group rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-[#4F46E5]">
                    {isFolder ? (
                      <Folder size={20} />
                    ) : (
                      <FileText size={20} />
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <Star
                      size={17}
                      className="fill-yellow-400 text-yellow-400"
                    />

                    <button
                      type="button"
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                      aria-label={`More options for ${item.title}`}
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </div>

                <h3 className="mt-5 truncate text-sm font-semibold text-[#1E293B]">
                  {item.title}
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  {item.location}
                </p>

                <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock3 size={14} />
                  {item.updated}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-5 text-sm text-slate-400">
          {favoriteItems.length} favorite items
        </p>
      </div>
    </DashboardLayout>
  );
}

export default Favorites;