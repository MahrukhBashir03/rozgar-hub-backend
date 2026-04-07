const mongoose = require("mongoose");

const workerProfileSchema = new mongoose.Schema(
  {
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["available", "available-soon", "busy"],
      default: "available",
    },

    skill: String,
    experience: String,
    hourlyRate: String,
    location: String,
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkerProfile", workerProfileSchema);