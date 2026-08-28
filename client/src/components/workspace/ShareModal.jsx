import { useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { Check, Copy, Link, Lock, Users } from "lucide-react";

const ShareModal = ({
  isOpen,
  onClose,
  documentName = "Project Requirements",
}) => {
  const [accessType, setAccessType] = useState("private");

  const [members, setMembers] = useState([
    {
      id: 1,
      name: "Fiza",
      email: "fiza@example.com",
      initials: "F",
      role: "Owner",
    },
    {
      id: 2,
      name: "Ali",
      email: "ali@example.com",
      initials: "A",
      role: "Editor",
    },
    {
      id: 3,
      name: "Sara",
      email: "sara@example.com",
      initials: "S",
      role: "Viewer",
    },
  ]);

  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("Viewer");
  const [copied, setCopied] = useState(false);

  const handleRoleChange = (memberId, newRole) => {
    setMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.id === memberId
          ? { ...member, role: newRole }
          : member
      )
    );
  };

  const handleAddPerson = (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    const newMember = {
      id: Date.now(),
      name: email.split("@")[0],
      email: email.trim(),
      initials: email.charAt(0).toUpperCase(),
      role: selectedRole,
    };

    setMembers((prevMembers) => [
      ...prevMembers,
      newMember,
    ]);

    setEmail("");
    setSelectedRole("Viewer");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `https://smart-docs.example.com/document/${documentName
          .toLowerCase()
          .replace(/\s+/g, "-")}`
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Share "${documentName}"`}
    >
      <div className="space-y-6">

        {/* Add People */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Users size={18} className="text-[#4F46E5]" />

            <h3 className="text-sm font-semibold text-[#1E293B]">
              Add people
            </h3>
          </div>

          <form
            onSubmit={handleAddPerson}
            className="flex flex-col gap-2 sm:flex-row"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="min-w-0 flex-1 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm text-[#1E293B] outline-none transition focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100"
            />

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm text-[#1E293B] outline-none focus:border-[#4F46E5]"
            >
              <option value="Viewer">Viewer</option>
              <option value="Commenter">Commenter</option>
              <option value="Editor">Editor</option>
            </select>

            <Button type="submit">
              Add
            </Button>
          </form>
        </section>

        {/* People with Access */}
        <section>
          <h3 className="mb-3 text-sm font-semibold text-[#1E293B]">
            People with access
          </h3>

          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] p-3"
              >
                {/* Avatar */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
                  {member.initials}
                </div>

                {/* User */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#1E293B]">
                    {member.name}
                  </p>

                  <p className="truncate text-xs text-slate-400">
                    {member.email}
                  </p>
                </div>

                {/* Role */}
                {member.role === "Owner" ? (
                  <span className="text-xs font-medium text-slate-500">
                    Owner
                  </span>
                ) : (
                  <select
                    value={member.role}
                    onChange={(e) =>
                      handleRoleChange(
                        member.id,
                        e.target.value
                      )
                    }
                    className="rounded-lg border border-[#E2E8F0] bg-white px-2 py-1.5 text-xs font-medium text-[#1E293B] outline-none focus:border-[#4F46E5]"
                  >
                    <option value="Viewer">
                      Viewer
                    </option>

                    <option value="Commenter">
                      Commenter
                    </option>

                    <option value="Editor">
                      Editor
                    </option>
                  </select>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* General Access */}
        <section>
          <h3 className="mb-3 text-sm font-semibold text-[#1E293B]">
            General access
          </h3>

          <div className="rounded-xl border border-[#E2E8F0] p-4">

            <div className="flex items-start gap-3">

              <div className="mt-0.5">
                {accessType === "private" ? (
                  <Lock
                    size={18}
                    className="text-slate-500"
                  />
                ) : (
                  <Link
                    size={18}
                    className="text-[#4F46E5]"
                  />
                )}
              </div>

              <div className="flex-1">
                <select
                  value={accessType}
                  onChange={(e) =>
                    setAccessType(e.target.value)
                  }
                  className="w-full bg-transparent text-sm font-medium text-[#1E293B] outline-none"
                >
                  <option value="private">
                    Private
                  </option>

                  <option value="workspace">
                    Workspace-only
                  </option>

                  <option value="anyone">
                    Anyone with the link
                  </option>
                </select>

                <p className="mt-1 text-xs text-slate-400">
                  {accessType === "private" &&
                    "Only people explicitly added can access this document."}

                  {accessType === "workspace" &&
                    "Anyone in the workspace can access this document."}

                  {accessType === "anyone" &&
                    "Anyone with the link can access this document."}
                </p>
              </div>
            </div>

            {/* Copy Link */}
            {accessType !== "private" && (
              <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
                <input
                  type="text"
                  readOnly
                  value="https://smart-docs.example.com/document/project-requirements"
                  className="min-w-0 flex-1 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500 outline-none"
                />

                <Button
                  variant="secondary"
                  onClick={handleCopyLink}
                >
                  {copied ? (
                    <>
                      <Check
                        size={15}
                        className="mr-1"
                      />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy
                        size={15}
                        className="mr-1"
                      />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            )}

          </div>
        </section>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-100 pt-5">
          <Button onClick={onClose}>
            Done
          </Button>
        </div>

      </div>
    </Modal>
  );
};

export default ShareModal;