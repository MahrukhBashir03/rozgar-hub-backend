// const mongoose = require("mongoose");

// const JobRequestSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: String,
//   category: { type: String, default: "general" },
//   pickupLocation: String,
//   dropLocation: String,
//   offeredPrice: { type: Number, required: true },
//   employer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   status: {
//     type: String,
//     enum: ["pending", "negotiating", "confirmed", "cancelled", "completed"],
//     default: "pending"
//   },
//   acceptedWorker: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   finalPrice: Number,
// }, { timestamps: true });

// module.exports = mongoose.model("JobRequest", JobRequestSchema);




// const mongoose = require("mongoose");

// const JobRequestSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },

//   category: {
//     type: String,
//     required: true
//   },

//   workLocation: { type: String, required: true },

//   // Only for driver category
//   pickupLocation: String,
//   dropLocation: String,

//   budgetType: {
//     type: String,
//     enum: ["fixed", "open"],
//     default: "fixed"
//   },

//   offeredPrice: Number,

//   urgency: {
//     type: String,
//     enum: ["1_hour", "today", "this_week", "flexible"],
//     default: "flexible"
//   },

//   employer: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true
//   },

//   status: {
//     type: String,
//     enum: ["pending", "negotiating", "confirmed", "cancelled", "completed"],
//     default: "pending"
//   },

//   acceptedWorker: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User"
//   },

//   finalPrice: Number

// }, { timestamps: true });

// module.exports = mongoose.model("JobRequest", JobRequestSchema);

const mongoose = require("mongoose");

const JobRequestSchema = new mongoose.Schema({
  title:           { type: String, required: true },
  description:     String,
  category:        { type: String, default: "general" },
  workLocation:    String,
  pickupLocation:  String,
  dropLocation:    String,
  budgetType:      { type: String, enum: ["fixed","open"], default: "fixed" },
  offeredPrice:    Number,
  urgency:         { type: String, enum: ["1_hour","today","this_week","flexible"], default: "flexible" },
  employer:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["pending","negotiating","confirmed","cancelled","completed"],
    default: "pending",
  },
  acceptedWorker:  { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  finalPrice:      Number,
}, { timestamps: true });

module.exports = mongoose.model("JobRequest", JobRequestSchema);