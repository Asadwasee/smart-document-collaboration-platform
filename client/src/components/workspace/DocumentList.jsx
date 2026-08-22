import { useState } from "react";
import Button from "../common/Button";
import Modal from "../common/Modal";

const DocumentList = () => {
  const [documents, setDocuments] = useState([
    { id: 1, title: "Project Requirements" },
    { id: 2, title: "Meeting Notes" },
    { id: 3, title: "Smart Document Plan" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documentTitle, setDocumentTitle] = useState("");
  const [editingDocument, setEditingDocument] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!documentTitle.trim()) return;

    if (editingDocument) {
      setDocuments((prev) =>
        prev.map((document) =>
          document.id === editingDocument.id
            ? {
                ...document,
                title: documentTitle.trim(),
              }
            : document
        )
      );

      setEditingDocument(null);
    } else {
      setDocuments((prev) => [
        ...prev,
        {
          id: Date.now(),
          title: documentTitle.trim(),
        },
      ]);
    }

    setDocumentTitle("");
    setIsModalOpen(false);
  };

  const handleRename = (document) => {
    setEditingDocument(document);
    setDocumentTitle(document.title);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmDelete) return;

    setDocuments((prev) =>
      prev.filter((document) => document.id !== id)
    );
  };

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#1E293B]">
          Documents
        </h2>

        <Button
          onClick={() => {
            setEditingDocument(null);
            setDocumentTitle("");
            setIsModalOpen(true);
          }}
        >
          + New Document
        </Button>
      </div>

      {/* Documents */}
      <div className="space-y-3">
        {documents.map((document) => (
          <div
            key={document.id}
            className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">📄</span>

              <span className="font-medium text-[#1E293B]">
                {document.title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() =>
                  console.log("Open document:", document.title)
                }
              >
                Open
              </Button>

              <button
                type="button"
                className="text-xl text-slate-400 hover:text-slate-700"
                onClick={() => {
                  const action = window.prompt(
                    "Type 'rename' or 'delete':"
                  );

                  if (action === "rename") {
                    handleRename(document);
                  }

                  if (action === "delete") {
                    handleDelete(document.id);
                  }
                }}
              >
                ⋮
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingDocument(null);
          setDocumentTitle("");
        }}
        title={
          editingDocument
            ? "Rename Document"
            : "Create Document"
        }
      >
        <form onSubmit={handleSubmit}>
          <label className="mb-2 block text-sm font-medium text-[#1E293B]">
            Document Name
          </label>

          <input
            type="text"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            placeholder="Enter document name"
            className="w-full rounded-lg border border-[#E2E8F0] px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#4F46E5]"
          />

          <div className="mt-5 flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setEditingDocument(null);
                setDocumentTitle("");
              }}
            >
              Cancel
            </Button>

            <Button type="submit">
              {editingDocument
                ? "Save Changes"
                : "Create Document"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DocumentList;