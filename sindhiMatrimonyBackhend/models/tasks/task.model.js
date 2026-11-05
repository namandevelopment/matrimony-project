import mongoose from "mongoose";

const { Schema } = mongoose;

const taskSchema = new Schema(
  {
    taskId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    leadId: {
      type: String,
      default: null,
      index: true,
    },
    leadName: {
      type: String,
      default: "",
    },
    assignedEmployeeId: {
      type: String,
      required: true,
      index: true,
    },
    assignedEmployeeName: {
      type: String,
      default: "",
    },
    dueDate: {
      type: Date,
      default: null,
      index: true,
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      default: "MEDIUM",
      index: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "OVERDUE", "CANCELLED"],
      default: "PENDING",
      index: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: String,
      default: "SYSTEM",
    },
    updatedBy: {
      type: String,
      default: "SYSTEM",
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ assignedEmployeeId: 1, status: 1 });

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

export default Task;

