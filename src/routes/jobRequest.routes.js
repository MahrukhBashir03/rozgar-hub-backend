// const express = require("express");
// const router = express.Router();
// const ctrl = require("../controllers/jobRequest.controller");

// router.post("/", ctrl.createRequest);
// router.get("/employer/:employerId", ctrl.getByEmployer);
// router.post("/:id/accept", ctrl.acceptOffer);
// router.get("/:id", ctrl.getById);

// module.exports = router;

const express = require("express");
const router  = express.Router();
const JobRequest = require("./models/JobRequest");

// POST /api/job-requests  — create new request
router.post("/", async (req, res) => {
  try {
    const { title, description, category, workLocation, pickupLocation,
            dropLocation, budgetType, offeredPrice, urgency, employerId } = req.body;

    const request = await JobRequest.create({
      title, description, category, workLocation, pickupLocation,
      dropLocation, budgetType, urgency,
      offeredPrice: offeredPrice ? Number(offeredPrice) : undefined,
      employer: employerId,
    });
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/job-requests/employer/:id
router.get("/employer/:id", async (req, res) => {
  try {
    const requests = await JobRequest.find({ employer: req.params.id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/job-requests/:id/accept  — employer accepts worker offer
router.post("/:id/accept", async (req, res) => {
  try {
    const { workerId, finalPrice } = req.body;
    const updated = await JobRequest.findByIdAndUpdate(
      req.params.id,
      { status: "confirmed", acceptedWorker: workerId, finalPrice },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/job-requests/:id
router.get("/:id", async (req, res) => {
  try {
    const r = await JobRequest.findById(req.params.id).populate("employer","name email");
    res.json(r);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;