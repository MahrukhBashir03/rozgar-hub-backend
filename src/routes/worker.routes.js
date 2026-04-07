const express = require("express");
const router = express.Router();
const WorkerProfile = require("../models/WorkerProfile");

// Create or Update Availability
router.post("/", async (req, res) => {
  try {
    const existing = await WorkerProfile.findOne({
      worker: req.body.worker,
    });

    if (existing) {
      const updated = await WorkerProfile.findOneAndUpdate(
        { worker: req.body.worker },
        req.body,
        { new: true }
      );
      return res.json(updated);
    }

    const profile = await WorkerProfile.create(req.body);
    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all available workers (for employer)
router.get("/", async (req, res) => {
  try {
    const workers = await WorkerProfile.find()
      .populate("worker", "name email");
    res.json(workers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;