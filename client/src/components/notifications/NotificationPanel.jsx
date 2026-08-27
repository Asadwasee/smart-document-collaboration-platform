import { useState } from "react";
import {
  Bell,
  MessageCircle,
  AtSign,
  UserPlus,
  Check,
  CheckCheck,
  X,
} from "lucide-react";

const initialNotifications = [
  {
    id: 1,
    type: "mention",
    title: "Ahmed mentioned you",
    message: 'mentioned you in "Project Proposal"',
    time: "2 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "comment",
    title: "Sara commented on your document",
    message: '"The introduction looks great!"',
    time: "10 minutes ago",
    read: false,
  },
  {
    id: 3,
    type: "workspace",
    title: "You were added to a workspace",
    message: 'You joined "Smart Documents"',
    time: "1 hour ago",
    read: false,
  },
  {
    id: 4,
    type: "mention",
    title: "Ali mentioned you",
    message: 'mentioned you in "Meeting Notes"',
    time: "3 hours ago",
    read: true,
  },
];

const NotificationPanel = ({ onClose }) => {
  const [notifications, setNotifications] = useState(
    initialNotifications
  );

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  // Mark one notification as read
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  // Delete notification
  const deleteNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  // Notification icon
  const getIcon = (type) => {
    if (type === "mention") {
      return <AtSign size={17} />;
    }

    if (type === "comment") {
      return <MessageCircle size={17} />;
    }

    if (type === "workspace") {
      return <UserPlus size={17} />;
    }

    return <Bell size={17} />;
  };

  return (
    <div className="absolute right-0 top-12 z-50 w-[380px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">

        <div className="flex items-center gap-2">

          <div className="relative">
            <Bell size={20} className="text-slate-700" />

            {unreadCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-semibold text-white">
                {unreadCount}
              </span>
            )}
          </div>

          <h2 className="font-semibold text-slate-800">
            Notifications
          </h2>

        </div>

        <div className="flex items-center gap-1">

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              title="Mark all as read"
              className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-indigo-600"
            >
              <CheckCheck size={17} />
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={17} />
            </button>
          )}

        </div>
      </div>

      {/* Notification list */}
      <div className="max-h-[430px] overflow-y-auto">

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">

            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <Bell size={25} className="text-slate-400" />
            </div>

            <p className="text-sm font-medium text-slate-700">
              No notifications
            </p>

            <p className="mt-1 text-xs text-slate-400">
              You're all caught up!
            </p>

          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => markAsRead(notification.id)}
              className={`group relative flex gap-3 border-b border-slate-100 px-4 py-4 transition ${
                notification.read
                  ? "bg-white"
                  : "bg-indigo-50/50"
              } hover:bg-slate-50`}
            >

              {/* Icon */}
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  notification.type === "mention"
                    ? "bg-purple-100 text-purple-600"
                    : notification.type === "comment"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {getIcon(notification.type)}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1 pr-5">

                <div className="flex items-start gap-2">

                  <p
                    className={`text-sm ${
                      notification.read
                        ? "font-medium text-slate-700"
                        : "font-semibold text-slate-800"
                    }`}
                  >
                    {notification.title}
                  </p>

                  {!notification.read && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
                  )}

                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {notification.message}
                </p>

                <p className="mt-1.5 text-[11px] text-slate-400">
                  {notification.time}
                </p>

              </div>

              {/* Actions */}
              <div className="absolute right-3 top-3 hidden gap-1 group-hover:flex">

                {!notification.read && (
                  <button
                    type="button"
                    title="Mark as read"
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(notification.id);
                    }}
                    className="rounded-md bg-white p-1.5 text-slate-400 shadow-sm hover:text-indigo-600"
                  >
                    <Check size={14} />
                  </button>
                )}

                <button
                  type="button"
                  title="Delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                  className="rounded-md bg-white p-1.5 text-slate-400 shadow-sm hover:text-red-500"
                >
                  <X size={14} />
                </button>

              </div>

            </div>
          ))
        )}

      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t border-slate-200 px-4 py-3 text-center">

          <button
            type="button"
            onClick={markAllAsRead}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
          >
            Mark all as read
          </button>

        </div>
      )}

    </div>
  );
};

export default NotificationPanel;