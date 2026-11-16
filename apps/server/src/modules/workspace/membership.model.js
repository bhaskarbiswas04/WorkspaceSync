import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },

    role: {
      type: String,
      enum: ["owner", "admin", "manager", "member"],
      default: "member",
    },

    status: {
      type: String,
      enum: ["active", "pending", "suspended"],
      default: "active",
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// A user cannot join the same workspace twice.
membershipSchema.index({ user: 1, workspace: 1 }, { unique: true });

// Find members of a particular workspace.
membershipSchema.index({ workspace: 1, status: 1 });

const Membership = mongoose.model("Membership", membershipSchema);