import { useState } from "react";
import { Bell, LogOut, Menu, User } from "lucide-react";
import SearchBar from "../common/SearchBar";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

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

        {/* User profile */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((previous) => !previous)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-[#4F46E5]"
            aria-label="User profile"
          >
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-11 z-50 w-56 rounded-xl border border-[#E2E8F0] bg-white p-2 shadow-lg">
              <div className="border-b border-[#E2E8F0] px-3 py-2">
                <p className="truncate text-sm font-medium text-[#1E293B]">
                  {user?.name || "User"}
                </p>

                <p className="truncate text-xs text-slate-500">
                  {user?.email || ""}
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={17} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;
