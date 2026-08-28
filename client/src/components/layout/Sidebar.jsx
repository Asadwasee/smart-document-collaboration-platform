import { Link, useLocation } from "react-router-dom";
import {
  FileText,
  Folder,
  Home,
  Settings,
  Star,
  Users,
  X,
} from "lucide-react";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: Home,
  },
  {
    label: "My Documents",
    path: "/documents",
    icon: FileText,
  },
  {
    label: "Shared with Me",
    path: "/shared",
    icon: Users,
  },
  {
    label: "Favorites",
    path: "/favorites",
    icon: Star,
  },
  {
    label: "Workspaces",
    path: "/workspace",
    icon: Folder,
  },
];

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[#E2E8F0] bg-white transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-[#E2E8F0] px-5">
          <Link
            to="/dashboard"
            className="flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#4F46E5] font-bold text-white">
              S
            </div>

            <span className="text-lg font-semibold text-[#1E293B]">
              SmartDocs
            </span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-[#4F46E5]"
                    : "text-slate-600 hover:bg-slate-50 hover:text-[#1E293B]"
                }`}
              >
                <Icon size={19} />
                {item.label}
              </Link>
            );
          })}

          <div className="my-4 border-t border-[#E2E8F0]" />

          
        </nav>

        {/* Settings */}
        <div className="border-t border-[#E2E8F0] p-4">
          <Link
            to="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#1E293B]"
          >
            <Settings size={19} />
            Settings
          </Link>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;