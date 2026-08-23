import mongoose from "mongoose";

const documentVersionSchema = new mongoose.Schema(
  {
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
      index: true,
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
    versionNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    changeType: {
      type: String,
      enum: ["create", "update", "restore"],
      required: true,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sourceVersion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DocumentVersion",
      default: null,
    },
    snapshot: {
      title: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      folder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder",
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

documentVersionSchema.index({ document: 1, versionNumber: -1 }, { unique: true });
documentVersionSchema.index({ workspace: 1, document: 1, createdAt: -1 });
documentVersionSchema.index({ changedBy: 1, createdAt: -1 });

export const DocumentVersion = mongoose.model("DocumentVersion", documentVersionSchema);
