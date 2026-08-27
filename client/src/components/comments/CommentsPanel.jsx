import { useState } from "react";
import {
  MessageCircle,
  Send,
  Reply,
  Check,
  Trash2,
  X,
} from "lucide-react";

const initialComments = [
  {
    id: 1,
    author: "Ahmed",
    text: "This section looks good. We should add more details here.",
    time: "10 min ago",
    resolved: false,
    replies: [],
  },
  {
    id: 2,
    author: "Fiza",
    text: "I will update this section.",
    time: "5 min ago",
    resolved: false,
    replies: [],
  },
];

const CommentsPanel = () => {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);

  // Add Comment
  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      author: "You",
      text: newComment,
      time: "Just now",
      resolved: false,
      replies: [],
    };

    setComments((prev) => [comment, ...prev]);
    setNewComment("");
  };

  // Resolve
  const handleResolve = (id) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === id
          ? { ...comment, resolved: !comment.resolved }
          : comment
      )
    );
  };

  // Delete
  const handleDelete = (id) => {
    setComments((prev) =>
      prev.filter((comment) => comment.id !== id)
    );
  };

  // Reply
  const handleReply = (id) => {
    if (!replyText.trim()) return;

    setComments((prev) =>
      prev.map((comment) =>
        comment.id === id
          ? {
              ...comment,
              replies: [
                ...comment.replies,
                {
                  id: Date.now(),
                  author: "You",
                  text: replyText,
                  time: "Just now",
                },
              ],
            }
          : comment
      )
    );

    setReplyText("");
    setReplyingTo(null);
  };

  return (
    <aside className="flex h-full w-[360px] flex-col border-l border-slate-200 bg-white">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div className="flex items-center gap-2">
          <MessageCircle size={20} className="text-indigo-600" />

          <h2 className="font-semibold text-slate-800">
            Comments
          </h2>

          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
            {comments.length}
          </span>
        </div>
      </div>

      {/* Comments */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">

        {comments.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <MessageCircle
              size={40}
              className="mb-3 text-slate-300"
            />

            <p className="text-sm font-medium text-slate-600">
              No comments yet
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Start a conversation about this document.
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className={`rounded-xl border p-4 ${
                comment.resolved
                  ? "border-green-200 bg-green-50"
                  : "border-slate-200 bg-white"
              }`}
            >

              {/* Author */}
              <div className="flex items-start justify-between">

                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
                    {comment.author.charAt(0)}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {comment.author}
                    </p>

                    <p className="text-xs text-slate-400">
                      {comment.time}
                    </p>
                  </div>

                </div>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>

              </div>

              {/* Comment text */}
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {comment.text}
              </p>

              {/* Actions */}
              <div className="mt-3 flex items-center gap-2">

                <button
                  onClick={() =>
                    setReplyingTo(
                      replyingTo === comment.id
                        ? null
                        : comment.id
                    )
                  }
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
                >
                  <Reply size={14} />
                  Reply
                </button>

                <button
                  onClick={() => handleResolve(comment.id)}
                  className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs ${
                    comment.resolved
                      ? "text-green-600"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <Check size={14} />
                  {comment.resolved ? "Resolved" : "Resolve"}
                </button>

              </div>

              {/* Reply input */}
              {replyingTo === comment.id && (
                <div className="mt-3 flex gap-2">

                  <input
                    value={replyText}
                    onChange={(e) =>
                      setReplyText(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleReply(comment.id);
                      }
                    }}
                    placeholder="Write a reply..."
                    className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                  />

                  <button
                    onClick={() => handleReply(comment.id)}
                    className="rounded-lg bg-indigo-600 px-3 text-white hover:bg-indigo-700"
                  >
                    <Send size={15} />
                  </button>

                  <button
                    onClick={() => setReplyingTo(null)}
                    className="rounded-lg border border-slate-200 px-2 text-slate-500"
                  >
                    <X size={15} />
                  </button>

                </div>
              )}

              {/* Replies */}
              {comment.replies.length > 0 && (
                <div className="mt-3 space-y-2 border-l-2 border-slate-100 pl-3">

                  {comment.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="rounded-lg bg-slate-50 p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-700">
                          {reply.author}
                        </span>

                        <span className="text-[10px] text-slate-400">
                          {reply.time}
                        </span>
                      </div>

                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        {reply.text}
                      </p>
                    </div>
                  ))}

                </div>
              )}

            </div>
          ))
        )}

      </div>

      {/* Add comment */}
      <div className="border-t border-slate-200 p-4">

        <div className="relative">

          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment... Use @ to mention someone"
            rows={3}
            className="w-full resize-none rounded-xl border border-slate-200 p-3 pr-12 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
          />

          <button
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className="absolute bottom-3 right-3 rounded-lg bg-indigo-600 p-2 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={16} />
          </button>

        </div>

        <p className="mt-2 text-xs text-slate-400">
          Press Enter to add a comment
        </p>

      </div>

    </aside>
  );
};

export default CommentsPanel;