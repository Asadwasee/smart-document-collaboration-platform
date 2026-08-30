import { useEffect, useState } from "react";
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
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";

function Dashboard() {
  const { user } = useAuth();

  const [workspaces, setWorkspaces] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showNewDocumentModal, setShowNewDocumentModal] = useState(false);
const [newDocumentTitle, setNewDocumentTitle] = useState("");
const [selectedWorkspace, setSelectedWorkspace] = useState("");
const [creatingDocument, setCreatingDocument] = useState(false);
const [createError, setCreateError] = useState("");

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return "Good morning";
    }

    if (hour < 18) {
      return "Good afternoon";
    }

    return "Good evening";
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        // Get all workspaces belonging to the logged-in user
        const workspaceResponse = await api.get("/workspaces");

        const userWorkspaces = workspaceResponse.data.workspaces || [];

        setWorkspaces(userWorkspaces);

        // Get documents from each workspace
        const documentResponses = await Promise.all(
          userWorkspaces.map((workspace) =>
            api.get(`/documents/workspace/${workspace._id}`)
          )
        );

        // Combine documents from all workspaces
        const allDocuments = documentResponses.flatMap(
          (response) => response.data.documents || []
        );

        // Sort newest documents first
        allDocuments.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() -
            new Date(a.updatedAt).getTime()
        );

        setDocuments(allDocuments);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const formatRelativeTime = (date) => {
    const seconds = Math.floor(
      (Date.now() - new Date(date).getTime()) / 1000
    );

    if (seconds < 60) {
      return "Just now";
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
      return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    }

    const days = Math.floor(hours / 24);

    return `${days} day${days === 1 ? "" : "s"} ago`;
  };

  const getWorkspaceName = (workspaceId) => {
    const workspace = workspaces.find(
      (workspace) =>
        workspace._id?.toString() === workspaceId?.toString()
    );

    return workspace?.name || "Workspace";
  };

  const stats = [
    {
      label: "My Documents",
      value: documents.length,
      icon: FileText,
      path: "/documents",
    },
    {
      label: "Shared with Me",
      value: "—",
      icon: Users,
      path: "/shared",
    },
    {
      label: "Favorites",
      value: "—",
      icon: Star,
      path: "/favorites",
    },
    {
      label: "Workspaces",
      value: workspaces.length,
      icon: Folder,
      path: "/workspace",
    },
  ];

  const handleCreateDocument = async (event) => {
  event.preventDefault();

  const title = newDocumentTitle.trim();
  const workspaceId = selectedWorkspace;

  if (!title) {
    setCreateError("Document title is required.");
    return;
  }

  if (!workspaceId) {
    setCreateError("Please select a workspace.");
    return;
  }

  try {
    setCreatingDocument(true);
    setCreateError("");

    const requestData = {
      title,
      content: "",
      workspaceId,
      folderId: null,
    };

    // Temporary debugging
    console.log("Creating document with:", requestData);

    const response = await api.post("/documents", requestData);

    console.log("Create document response:", response.data);

    const createdDocument = response.data.document;

    setDocuments((previousDocuments) => [
      createdDocument,
      ...previousDocuments,
    ]);

    setShowNewDocumentModal(false);
    setNewDocumentTitle("");
    setSelectedWorkspace("");

    window.location.href = `/editor?id=${createdDocument._id}`;
  } catch (error) {
    console.error("Failed to create document:", error);
    console.error("Backend response:", error.response?.data);
    console.error("Status:", error.response?.status);

    setCreateError(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to create document. Please try again."
    );
  } finally {
    setCreatingDocument(false);
  }
};

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
              {getGreeting()}, {user?.name || "there"}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Here's what's happening with your documents.
            </p>
          </div>

          <Button
  type="button"
 onClick={() => {
  setCreateError("");
  setNewDocumentTitle("");
  setSelectedWorkspace("");
  setShowNewDocumentModal(true);
}}
>
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
                <Link
                  to="/documents"
                  className="text-sm font-medium text-[#4F46E5] hover:text-[#3730A3]"
                >
                  View all
                </Link>
              }
            />

            <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">

              {loading ? (
                <div className="p-6 text-center text-sm text-slate-500">
                  Loading documents...
                </div>
              ) : documents.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-500">
                  No documents yet.
                </div>
              ) : (
                documents.slice(0, 5).map((document) => (
                  <Link
  key={document._id}
  to={`/editor?id=${document._id}`}
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
                        {getWorkspaceName(document.workspace)}
                      </p>
                    </div>

                    <div className="hidden items-center gap-1.5 text-xs text-slate-400 sm:flex">
                      <Clock3 size={14} />
                      {formatRelativeTime(document.updatedAt)}
                    </div>

                  </Link>
                ))
              )}

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

      {showNewDocumentModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#1E293B]">
          Create new document
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Choose a workspace and give your document a name.
        </p>
      </div>

      <form onSubmit={handleCreateDocument} className="space-y-5">

        {/* Document title */}
        <div>
          <label
            htmlFor="document-title"
            className="mb-2 block text-sm font-medium text-[#1E293B]"
          >
            Document title
          </label>

          <input
            id="document-title"
            type="text"
            value={newDocumentTitle}
            onChange={(event) => {
              setNewDocumentTitle(event.target.value);
              setCreateError("");
            }}
            placeholder="e.g. Project Requirements"
            className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2.5 text-sm outline-none transition focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100"
            autoFocus
          />
        </div>

        {/* Workspace */}
        <div>
          <label
            htmlFor="document-workspace"
            className="mb-2 block text-sm font-medium text-[#1E293B]"
          >
            Workspace
          </label>

          {workspaces.length === 0 ? (
            <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
              You don't have any workspaces yet. Create a workspace first.
            </p>
          ) : (
            <select
              id="document-workspace"
              value={selectedWorkspace}
              onChange={(event) => {
                setSelectedWorkspace(event.target.value);
                setCreateError("");
              }}
              className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">Select workspace</option>

              {workspaces.map((workspace) => (
                <option key={workspace._id} value={workspace._id}>
                  {workspace.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Error */}
        {createError && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {createError}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setShowNewDocumentModal(false);
              setCreateError("");
            }}
          >
            Cancel
          </Button>

          <Button
  type="submit"
  loading={creatingDocument}
  disabled={
    workspaces.length === 0 ||
    !newDocumentTitle.trim() ||
    !selectedWorkspace ||
    creatingDocument
  }
>
  Create Document
</Button>
        </div>

      </form>
    </div>
  </div>
)}
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