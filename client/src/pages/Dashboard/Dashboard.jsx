import { Link } from "react-router-dom";

import {
  Clock3,
  FileText,
  Folder,
  MoreHorizontal,
  Plus,
  Star,
  Users,
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import SectionHeader from "../../components/common/SectionHeader";
import Button from "../../components/common/Button";

const recentDocuments = [
  {
    id: 1,
    title: "Project Requirements",
    workspace: "Internship Project",
    updated: "2 minutes ago",
    owner: "You",
  },
  {
    id: 2,
    title: "Meeting Notes",
    workspace: "Team Workspace",
    updated: "1 hour ago",
    owner: "Aliyan",
  },
  {
    id: 3,
    title: "Research Document",
    workspace: "Personal",
    updated: "3 hours ago",
    owner: "You",
  },
];

const stats = [
  {
    label: "My Documents",
    value: "12",
    icon: FileText,
    path: "/documents",
  },
  {
    label: "Shared with Me",
    value: "8",
    icon: Users,
    path: "/shared",
  },
  {
    label: "Favorites",
    value: "5",
    icon: Star,
    path: "/favorites",
  },
  {
    label: "Workspaces",
    value: "3",
    icon: Folder,
    path: "/workspace",
  },
];

function Dashboard() {
  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-[#4F46E5]">
              Welcome back
            </p>

            <h1 className="mt-1 text-2xl font-semibold text-[#1E293B] sm:text-3xl">
              Good afternoon, Afreen
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Here's what's happening with your documents.
            </p>
          </div>

          <Button>
            <Plus size={18} className="mr-2" />
            New Document
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Link 
              key={stat.label}
              to={stat.path}
              className="block rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-[#4F46E5]">
                    <Icon size={20} />
                  </div>

                  <span className="text-2xl font-semibold text-[#1E293B]">
                    {stat.value}
                  </span>
                </div>

                <p className="mt-4 text-sm text-slate-500">
                  {stat.label}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Main content */}
        <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_320px]">

          {/* Recent Documents */}
          <section>
            <SectionHeader
              title="Recent Documents"
              action={
                <button
                  type="button"
                  className="text-sm font-medium text-[#4F46E5] hover:text-[#3730A3]"
                >
                  View all
                </button>
              }
            />

            <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
              {recentDocuments.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center gap-4 border-b border-[#E2E8F0] p-4 last:border-b-0 hover:bg-slate-50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-[#4F46E5]">
                    <FileText size={19} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-medium text-[#1E293B]">
                      {document.title}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {document.workspace} · {document.owner}
                    </p>
                  </div>

                  <div className="hidden items-center gap-1.5 text-xs text-slate-400 sm:flex">
                    <Clock3 size={14} />
                    {document.updated}
                  </div>

                  <button
                    type="button"
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    aria-label={`More options for ${document.title}`}
                  >
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Activity */}
          <section>
            <SectionHeader title="Recent Activity" />

            <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
              <div className="space-y-5">

                <ActivityItem
                  name="Aliyan"
                  action="updated"
                  document="Project Requirements"
                  time="10 minutes ago"
                />

                <ActivityItem
                  name="Fiza"
                  action="commented on"
                  document="Meeting Notes"
                  time="1 hour ago"
                />

                <ActivityItem
                  name="Wasif"
                  action="shared"
                  document="Research Document"
                  time="3 hours ago"
                />

              </div>
            </div>
          </section>

        </div>
      </div>
    </DashboardLayout>
  );
}

function ActivityItem({
  name,
  action,
  document,
  time,
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-[#4F46E5]">
        {name.charAt(0)}
      </div>

      <div className="min-w-0">
        <p className="text-sm text-[#1E293B]">
          <span className="font-medium">{name}</span>{" "}
          {action}{" "}
          <span className="font-medium">{document}</span>
        </p>

        <p className="mt-1 text-xs text-slate-400">
          {time}
        </p>
      </div>
    </div>
  );
}

export default Dashboard;