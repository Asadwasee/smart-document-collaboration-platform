import { Bell, Menu, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Topbar({ onMenuClick }) {
  const navigate = useNavigate();

  return (
    <header className="flex h-16 items-center justify-between border-b border-[#E2E8F0] bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={21} />
        </button>

        {/* Search */}
        <button
          type="button"
          onClick={() => navigate("/search")}
          className="hidden w-72 items-center gap-2 rounded-lg border border-[#E2E8F0] bg-slate-50 px-3 py-2 text-left text-sm text-slate-400 transition hover:border-slate-300 sm:flex"
        >
          <Search size={17} />

          <span>Search documents...</span>

          <span className="ml-auto rounded border border-slate-200 bg-white px-1.5 py-0.5 text-xs text-slate-400">
            /
          </span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button
          type="button"
          className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          aria-label="Notifications"
        >
          <Bell size={20} />

          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#14B8A6]" />
        </button>

        {/* User avatar */}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-[#4F46E5]"
          aria-label="User profile"
        >
          A
        </button>
      </div>
    </header>
  );
}

export default Topbar;