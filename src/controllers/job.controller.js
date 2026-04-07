const Job = require("../models/Job");

exports.createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const Job = require("../models/Job");
const Bid = require("../models/Bid");
const Chat = require("../models/Chat");


// =============================
// WORKER APPLIES TO JOB
// =============================
exports.applyToJob = async (req, res) => {
  try {
    const { jobId, proposedRate, message } = req.body;

    const bid = await Bid.create({
      job: jobId,
      worker: req.user.id,
      proposedRate,
      message,
    });

    res.status(201).json({
      message: "Offer sent successfully",
      bid,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// =============================
// EMPLOYER ACCEPTS BID
// =============================
exports.acceptBid = async (req, res) => {
  try {
    const { bidId } = req.body;

    const bid = await Bid.findById(bidId).populate("job");

    if (!bid) {
      return res.status(404).json({ error: "Bid not found" });
    }

    // Update job
    bid.job.status = "in-progress";
    bid.job.acceptedWorker = bid.worker;
    await bid.job.save();

    // Update bid
    bid.status = "accepted";
    await bid.save();

    // Reject other bids
    await Bid.updateMany(
      { job: bid.job._id, _id: { $ne: bidId } },
      { status: "rejected" }
    );

    res.json({ message: "Worker accepted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// =============================
// GET JOB BIDS (Employer)
// =============================
exports.getJobBids = async (req, res) => {
  try {
    const { jobId } = req.params;

    const bids = await Bid.find({ job: jobId })
      .populate("worker", "name email");

    res.json(bids);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};