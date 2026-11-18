
import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["admin", "manager", "member"],
      default: "member",
    },

    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tokenHash: {
      type: String,
      required: true,
      unique: true,
      select: false,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "revoked"],
      default: "pending",
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    acceptedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Automatically remove expired invitations.
invitationSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

// Prevent duplicate pending invitations.
invitationSchema.index(
  { workspace: 1, email: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: "pending",
    },
  }
);

const Invitation = mongoose.model(
  "Invitation",
  invitationSchema
);

export default Invitation;