const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    // 🔥 ADD THESE TWO FOR GPS
    latitude: {
      type: Number,
      default: null,
    },

    longitude: {
      type: Number,
      default: null,
    },

    salary: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["full-time", "part-time", "contract", "temporary"],
      default: "full-time",
    },

    status: {
      type: String,
      enum: ["open", "in-progress", "completed"],
      default: "open",
    },

    acceptedWorker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);