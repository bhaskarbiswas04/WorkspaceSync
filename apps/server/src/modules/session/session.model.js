import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    tokenHash: {
      type: String,
      required: true,
      unique: true,
      select: false,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    revokedAt: {
      type: Date,
      default: null,
    },

    lastUsedAt: {
      type: Date,
      default: Date.now,
    },

    userAgent: {
      type: String,
      default: "",
    },

    ipAddress: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

// Automatically expire old sessions.
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Session = mongoose.model("Session", sessionSchema);

export default Session;
