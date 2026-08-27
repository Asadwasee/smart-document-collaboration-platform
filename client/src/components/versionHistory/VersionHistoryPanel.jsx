import { useState } from "react";
import {
  History,
  X,
  RotateCcw,
  Eye,
  User,
  Clock3,
  MoreVertical,
} from "lucide-react";

const VersionHistoryPanel = ({ isOpen, onClose }) => {
  const [selectedVersion, setSelectedVersion] = useState(null);

  const versions = [
    {
      id: 1,
      version: "Version 5",
      title: "Latest changes",
      user: "You",
      date: "Today",
      time: "10:42 AM",
      current: true,
    },
    {
      id: 2,
      version: "Version 4",
      title: "Updated project requirements",
      user: "Ahmed Khan",
      date: "Today",
      time: "09:35 AM",
    },
    {
      id: 3,
      version: "Version 3",
      title: "Added documentation section",
      user: "You",
      date: "Yesterday",
      time: "04:20 PM",
    },
    {
      id: 4,
      version: "Version 2",
      title: "Initial content added",
      user: "Sara Ali",
      date: "Yesterday",
      time: "01:15 PM",
    },
    {
      id: 5,
      version: "Version 1",
      title: "Document created",
      user: "You",
      date: "Aug 25",
      time: "11:10 AM",
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/20">
      <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <History size={19} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-800">
                Version History
              </h2>
              <p className="text-xs text-slate-400">
                View and restore previous versions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={19} />
          </button>
        </div>

        {/* DOCUMENT INFO */}
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-3">
          <p className="text-xs text-slate-400">DOCUMENT</p>
          <p className="mt-1 text-sm font-medium text-slate-700">
            Project Documentation
          </p>
        </div>

        {/* VERSIONS */}
        <div className="flex-1 overflow-y-auto px-5 py-5">

          <div className="relative">

            {/* TIMELINE */}
            <div className="absolute left-[9px] top-2 h-[calc(100%-20px)] w-px bg-slate-200" />

            <div className="space-y-5">
              {versions.map((version) => (
                <div
                  key={version.id}
                  className="relative pl-8"
                >
                  {/* DOT */}
                  <div
                    className={`absolute left-0 top-1.5 h-[19px] w-[19px] rounded-full border-4 border-white ${
                      version.current
                        ? "bg-indigo-600"
                        : "bg-slate-300"
                    }`}
                  />

                  <div
                    className={`rounded-xl border p-4 transition ${
                      selectedVersion === version.id
                        ? "border-indigo-300 bg-indigo-50/50"
                        : version.current
                        ? "border-indigo-200 bg-indigo-50/30"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >

                    {/* TOP */}
                    <div className="flex items-start justify-between">

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-800">
                            {version.version}
                          </span>

                          {version.current && (
                            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-medium text-indigo-600">
                              Current
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm text-slate-600">
                          {version.title}
                        </p>
                      </div>

                      {!version.current && (
                        <button
                          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        >
                          <MoreVertical size={17} />
                        </button>
                      )}
                    </div>

                    {/* META */}
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">

                      <span className="flex items-center gap-1">
                        <User size={13} />
                        {version.user}
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock3 size={13} />
                        {version.date}, {version.time}
                      </span>

                    </div>

                    {/* ACTIONS */}
                    {!version.current && (
                      <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">

                        <button
                          onClick={() =>
                            setSelectedVersion(version.id)
                          }
                          className="flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-white"
                        >
                          <Eye size={14} />
                          Preview
                        </button>

                        <button
                          className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
                        >
                          <RotateCcw size={14} />
                          Restore
                        </button>

                      </div>
                    )}

                    {/* SELECTED PREVIEW */}
                    {selectedVersion === version.id && (
                      <div className="mt-3 rounded-lg border border-indigo-100 bg-white p-3">
                        <p className="text-xs font-medium text-slate-500">
                          Preview
                        </p>

                        <div className="mt-2 rounded-md bg-slate-50 p-3 text-xs leading-5 text-slate-500">
                          Previous document content will appear here.
                          This is currently a UI preview placeholder and
                          can later be connected to the version API.
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t border-slate-200 bg-slate-50 px-5 py-3">
          <p className="text-center text-xs text-slate-400">
            Previous versions are saved automatically.
          </p>
        </div>

      </div>
    </div>
  );
};

export default VersionHistoryPanel;