import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["editor", "commenter", "viewer"],
      required: true,
      default: "viewer",
    },
  },
  {
    _id: false,
  }
);

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    members: {
      type: [memberSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

workspaceSchema.index({ owner: 1, createdAt: -1 });
workspaceSchema.index({ "members.user": 1, createdAt: -1 });

workspaceSchema.pre("validate", function ensureUniqueMembers(next) {
  const memberIds = this.members.map((entry) => entry.user.toString());
  const uniqueCount = new Set(memberIds).size;

  if (uniqueCount !== memberIds.length) {
    this.invalidate("members", "Duplicate workspace members are not allowed.");
  }

  next();
});

export const Workspace = mongoose.model("Workspace", workspaceSchema);
