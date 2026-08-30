import { DocumentVersion } from "../models/DocumentVersion.js";

const nextVersionNumber = async (documentId) => {
  const latest = await DocumentVersion.findOne({
    document: documentId,
  })
    .select("versionNumber")
    .sort({ versionNumber: -1 })
    .lean();

  return (latest?.versionNumber || 0) + 1;
};

export const createDocumentSnapshot = async ({
  document,
  changedBy,
  changeType,
  sourceVersion = null,
}) => {
  const versionNumber = await nextVersionNumber(document._id);

  return DocumentVersion.create({
    document: document._id,
    workspace: document.workspace,
    versionNumber,
    changeType,
    changedBy,
    sourceVersion,

    snapshot: {
      title: document.title || "",
      content: typeof document.content === "string"
        ? document.content
        : "",
      folder: document.folder || null,
    },
  });
};
