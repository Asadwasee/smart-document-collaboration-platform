import { useState } from "react";
import { Bell, Menu, Search, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Topbar({ onMenuClick }) {
  const navigate = useNavigate();

    const [showNotifications, setShowNotifications] = useState(false);

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
           onClick={() => {
              setShowNotifications(!showNotifications);
              }}
        >
          <Bell size={20} />

          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#14B8A6]" />
        </button>
         {showNotifications && (
            <div className="absolute right-0 top-12 w-80 rounded-xl border border-slate-200 bg-white shadow-xl">
              
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <h3 className="font-semibold text-slate-800">
                  Notifications
                </h3>

                <button className="text-xs text-indigo-600 hover:underline">
                  Mark all as read
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto">

                <div className="flex gap-3 border-b border-slate-100 px-4 py-3 hover:bg-slate-50">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <User size={17} />
                  </div>

                  <div>
                    <p className="text-sm text-slate-700">
                      <span className="font-medium">Sarah</span> commented
                      on your document.
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      5 minutes ago
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 border-b border-slate-100 px-4 py-3 hover:bg-slate-50">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                    ✓
                  </div>

                  <div>
                    <p className="text-sm text-slate-700">
                      You were added to a workspace.
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      1 hour ago
                    </p>
                  </div>
                </div>

                <div className="px-4 py-6 text-center text-sm text-slate-400">
                  No more notifications
                </div>

              </div>

              <div className="border-t border-slate-100 p-2">
                <button className="w-full rounded-md py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User avatar */}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-[#4F46E5]"
          aria-label="User profile"
        >
          A
        </button>
      
    </header>
    

        );
}

export default Topbar;