const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const jobRoutes = require('./routes/job.routes');
const workerRoutes = require('./routes/worker.routes');
const app = express();
const aiRoutes = require("./routes/ai.routes");

app.use("/api/ai", aiRoutes);


app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
}));

// app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
 app.use('/api/workers', workerRoutes);
 
app.get('/', (req, res) => {
  res.send('RozgarHub API running');
});

const jobRequestRoutes = require("./routes/jobRequest.routes");
app.use("/api/job-requests", jobRequestRoutes);
module.exports = app;