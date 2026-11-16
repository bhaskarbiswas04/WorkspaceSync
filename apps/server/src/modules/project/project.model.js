import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      default: "",
      maxlength: 1000,
    },

    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["planning", "active", "completed", "archived"],
      default: "planning",
    },

    startDate: {
      type: Date,
      default: null,
    },

    dueDate: {
      type: Date,
      default: null,
    },

    color: {
      type: String,
      default: "#6366f1",
    },
  },
  {
    timestamps: true,
  },
);

projectSchema.index({
  workspace: 1,
  status: 1,
  createdAt: -1,
});

const Project = mongoose.model("Project", projectSchema)

export default Project;

