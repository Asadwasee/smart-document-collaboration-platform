import { useState } from "react";

import RichTextEditor from "../../components/editor/RichTextEditor";
import CommentsPanel from "../../components/comments/CommentsPanel";
import VersionHistoryPanel from "../../components/versionHistory/VersionHistoryPanel";

const Editor = () => {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="flex h-full min-h-0 flex-col">

      {/* Version History Button */}
      <div className="flex justify-end border-b border-slate-200 bg-white p-2">
        <button
          type="button"
          onClick={() => setShowHistory(true)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          Version History
        </button>
      </div>

      {/* Main Editor Area */}
      <div className="flex min-h-0 flex-1">

        {/* Editor */}
        <div className="min-w-0 flex-1">
          <RichTextEditor />
        </div>

        {/* Comments */}
        <CommentsPanel />

        {/* Version History */}
        <VersionHistoryPanel
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
        />

      </div>
    </div>
  );
};

export default Editor;