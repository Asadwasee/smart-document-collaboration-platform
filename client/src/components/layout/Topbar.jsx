import { Bell, Menu} from "lucide-react";
import SearchBar from "../common/SearchBar";

function Topbar({ onMenuClick }) {

  return (
    <header className="flex h-16 items-center justify-between border-b border-[#E2E8F0] bg-white px-4 sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
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
        <SearchBar />
      </div>

      <div className="ml-4 flex shrink-0 items-center gap-2">
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