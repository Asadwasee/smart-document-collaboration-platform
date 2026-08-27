import { useState } from "react";
import { Bell } from "lucide-react";
import NotificationPanel from "./NotificationPanel";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);

  const unreadCount = 3;

  return (
    <div className="relative">

      {/* Bell */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        title="Notifications"
        className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
      >
        <Bell size={20} />

        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <NotificationPanel
          onClose={() => setOpen(false)}
        />
      )}

    </div>
  );
};

export default NotificationBell;