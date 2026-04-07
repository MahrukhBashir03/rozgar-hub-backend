const JobRequest = require("../models/JobRequest");

// exports.createRequest = async (req, res) => {
//   try {
//     const { title, description, category, pickupLocation, dropLocation, offeredPrice, employerId } = req.body;
//     const request = await JobRequest.create({
//       title, description, category, pickupLocation, dropLocation,
//       offeredPrice, employer: employerId
//     });
//     res.status(201).json(request);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

exports.createRequest = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      workLocation,
      pickupLocation,
      dropLocation,
      budgetType,
      offeredPrice,
      urgency,
      employerId
    } = req.body;

    const request = await JobRequest.create({
      title,
      description,
      category,
      workLocation,
      pickupLocation,
      dropLocation,
      budgetType,
      offeredPrice,
      urgency,
      employer: employerId
    });

    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByEmployer = async (req, res) => {
  try {
    const requests = await JobRequest.find({ employer: req.params.employerId })
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.acceptOffer = async (req, res) => {
  try {
    const { workerId, finalPrice } = req.body;
    const request = await JobRequest.findByIdAndUpdate(
      req.params.id,
      { status: "confirmed", acceptedWorker: workerId, finalPrice },
      { new: true }
    );
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const r = await JobRequest.findById(req.params.id).populate("employer", "name email");
    res.json(r);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};