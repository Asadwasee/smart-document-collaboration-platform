import { useState } from "react";
import Button from "../../components/common/Button";

const Editor = () => {
  const [title, setTitle] = useState("Project Requirements");
  const [content, setContent] = useState("");

  const handleSave = () => {
    console.log("Saved:", {
      title,
      content,
    });
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">

      {/* ================= LEFT SIDEBAR ================= */}
      <aside className="hidden w-60 border-r border-[#E2E8F0] bg-white lg:flex lg:flex-col">

        {/* Logo */}
        <div className="flex h-16 items-center border-b border-[#E2E8F0] px-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4F46E5] text-sm font-bold text-white">
              S
            </div>

            <span className="font-bold text-[#1E293B]">
              SmartDocs
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">

          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <button className="mb-1 flex w-full items-center gap-3 rounded-lg bg-indigo-50 px-3 py-2.5 text-sm font-medium text-[#4F46E5]">
            📝
            Documents
          </button>

          <button className="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
            📁
            Workspaces
          </button>

          <button className="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
            🕘
            Recent
          </button>

          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
            ⭐
            Favorites
          </button>

        </nav>

        {/* User */}
        <div className="border-t border-[#E2E8F0] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
              F
            </div>

            <div>
              <p className="text-sm font-medium text-[#1E293B]">
                User
              </p>

              <p className="text-xs text-slate-400">
                Free Plan
              </p>
            </div>
          </div>
        </div>

      </aside>


      {/* ================= MAIN AREA ================= */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-[#E2E8F0] bg-white px-5">

          <div className="flex items-center gap-3">

            <button
              type="button"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              onClick={() => console.log("Back")}
            >
              ←
            </button>

            <div className="hidden text-sm text-slate-400 sm:block">
              Documents
            </div>

            <span className="text-slate-300">
              /
            </span>

            <span className="text-sm font-medium text-[#1E293B]">
              {title}
            </span>

          </div>


          <div className="flex items-center gap-2">

            {/* Saved */}
            <div className="hidden items-center gap-2 px-3 text-xs text-slate-400 sm:flex">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Saved
            </div>

            {/* Collaborators */}
            <div className="hidden items-center sm:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-indigo-100 text-xs font-semibold text-indigo-600">
                F
              </div>

              <div className="-ml-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-purple-100 text-xs font-semibold text-purple-600">
                A
              </div>
            </div>

            <Button
              variant="secondary"
              onClick={() => console.log("Share")}
            >
              Share
            </Button>

            <Button onClick={handleSave}>
              Save
            </Button>

          </div>

        </header>


        {/* ================= EDITOR ================= */}
        <main className="flex-1 overflow-y-auto">

          <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8">

            {/* Paper */}
            <div className="min-h-[calc(100vh-120px)] rounded-xl border border-[#E2E8F0] bg-white shadow-sm">

              {/* Title */}
              <div className="px-8 pt-10 sm:px-12">

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border-none bg-transparent text-3xl font-bold tracking-tight text-[#1E293B] outline-none placeholder:text-slate-300 sm:text-4xl"
                />

                <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
                  <span>Last edited just now</span>
                  <span>•</span>
                  <span>Private</span>
                </div>

              </div>


              {/* Toolbar */}
              <div className="sticky top-0 z-10 mt-8 border-y border-[#E2E8F0] bg-white/95 px-6 py-2 backdrop-blur">

                <div className="flex items-center gap-1 overflow-x-auto">

                  <button className="toolbar">
                    B
                  </button>

                  <button className="toolbar italic">
                    I
                  </button>

                  <button className="toolbar underline">
                    U
                  </button>

                  <span className="mx-2 h-5 w-px bg-slate-200" />

                  <button className="toolbar font-semibold">
                    H1
                  </button>

                  <button className="toolbar font-semibold">
                    H2
                  </button>

                  <button className="toolbar">
                    ¶
                  </button>

                  <span className="mx-2 h-5 w-px bg-slate-200" />

                  <button className="toolbar">
                    • List
                  </button>

                  <button className="toolbar">
                    1. List
                  </button>

                  <span className="mx-2 h-5 w-px bg-slate-200" />

                  <button className="toolbar">
                    🔗
                  </button>

                  <button className="toolbar">
                    🖼
                  </button>

                  <button className="toolbar">
                    ⋯
                  </button>

                </div>

              </div>


              {/* Writing Area */}
              <div className="px-8 py-8 sm:px-12">

                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start writing your document..."
                  className="min-h-[550px] w-full resize-none border-none bg-transparent text-[16px] leading-8 text-[#334155] outline-none placeholder:text-slate-300"
                />

              </div>

            </div>

          </div>

        </main>

      </div>


      {/* ================= RIGHT PANEL ================= */}
      <aside className="hidden w-64 border-l border-[#E2E8F0] bg-white xl:block">

        <div className="border-b border-[#E2E8F0] px-5 py-4">
          <h3 className="font-semibold text-[#1E293B]">
            Collaboration
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Work together on this document
          </p>
        </div>

        {/* People */}
        <div className="border-b border-[#E2E8F0] p-5">

          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            People
          </p>

          <div className="space-y-3">

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600">
                F
              </div>

              <div>
                <p className="text-sm font-medium">
                  You
                </p>

                <p className="text-xs text-green-500">
                  Online
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-xs font-semibold text-purple-600">
                A
              </div>

              <div>
                <p className="text-sm font-medium">
                  Collaborator
                </p>

                <p className="text-xs text-slate-400">
                  Offline
                </p>
              </div>
            </div>

          </div>

        </div>


        {/* Comments Placeholder */}
        <div className="p-5">

          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Comments
            </p>

            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
              0
            </span>
          </div>

          <div className="rounded-lg bg-slate-50 p-4 text-center">

            <div className="mb-2 text-xl">
              💬
            </div>

            <p className="text-sm font-medium text-slate-600">
              No comments yet
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Comments and discussions will appear here.
            </p>

          </div>

        </div>

      </aside>

    </div>
  );
};

export default Editor;