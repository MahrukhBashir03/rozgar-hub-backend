const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const Job = require("../models/Job");

// ==============================
// SEND MESSAGE (Employer <-> Accepted Worker)
// ==============================
router.post("/message", async (req, res) => {
  try {
    const { jobId, senderId, message } = req.body;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Allow chat only if job is in-progress
    if (job.status !== "in-progress") {
      return res.status(400).json({
        error: "Chat is allowed only after job is accepted",
      });
    }

    // Check if sender is employer or accepted worker
    if (
      senderId.toString() !== job.employer.toString() &&
      senderId.toString() !== job.acceptedWorker?.toString()
    ) {
      return res.status(403).json({
        error: "You are not allowed to chat for this job",
      });
    }

    const chat = await Chat.create({
      job: jobId,
      sender: senderId,
      message,
    });

    res.status(201).json(chat);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// GET CHAT MESSAGES
// ==============================
router.get("/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;

    const messages = await Chat.find({ job: jobId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.json(messages);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;