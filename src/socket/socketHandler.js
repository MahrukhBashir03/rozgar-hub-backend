module.exports = (io) => {
  const onlineWorkers = new Map();
  const activeRequests = new Map();

  io.on("connection", (socket) => {
    console.log(`[Socket] Connected: ${socket.id}`);

    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`[Socket] User ${userId} joined their room`);
    });

    socket.on("worker_online", ({ workerId, name, skill }) => {
      socket.join("workers");
      onlineWorkers.set(socket.id, { workerId, name, skill });
      io.emit("workers_online_count", onlineWorkers.size);
    });

    socket.on("new_job_request", (data) => {
      const { requestId, employerId } = data;
      activeRequests.set(requestId, {
        employerSocketId: socket.id,
        fare: data.offeredPrice,
        status: "searching",
        employerId,
      });
      socket.broadcast.emit("new_job_request", data);
      io.to("workers").emit("new_job_request", data);
    });

    // ── Worker ACCEPTS the job request (InDrive style) ───────────
    socket.on("worker_job_accept", (data) => {
      const { requestId, employerId, workerId, workerName, workerRating, workerPhone, workerExperience } = data;
      console.log(`[Accept] ${workerName} accepted request ${requestId}`);
      const req = activeRequests.get(requestId);
      if (req) req.status = "worker_accepted";
      // Notify employer that a worker accepted — employer now chooses confirm/decline
      io.to(employerId).emit("worker_job_accept", data);
    });

    // ── Worker DECLINES the job request ─────────────────────────
    socket.on("worker_job_decline", (data) => {
      const { requestId, workerId } = data;
      console.log(`[Decline] Worker ${workerId} declined request ${requestId}`);
      // No need to notify employer for decline (silent)
    });

    // ── Employer CONFIRMS the worker who accepted ────────────────
    socket.on("employer_confirm_worker", (data) => {
      const { requestId, workerId, employerName } = data;
      console.log(`[Confirmed] Employer confirmed worker ${workerId} for ${requestId}`);
      const req = activeRequests.get(requestId);
      if (req) req.status = "confirmed";
      // Tell the accepted worker: job is yours!
      io.to(workerId).emit("employer_confirm_worker", data);
      // Tell all OTHER workers: request is taken
      socket.broadcast.emit("request_taken", { requestId });
    });

    // ── Employer DISMISSES a worker who accepted ─────────────────
    socket.on("employer_dismiss_worker", (data) => {
      const { workerId, requestId } = data;
      console.log(`[Dismissed] Employer dismissed worker ${workerId}`);
      io.to(workerId).emit("employer_dismiss_worker", data);
    });

    // ── Worker sends a price offer (negotiate) ───────────────────
    socket.on("worker_offer", (data) => {
      const { requestId, employerId, workerId, workerName, price } = data;
      console.log(`[Offer] ${workerName} offered Rs. ${price} for ${requestId}`);
      const req = activeRequests.get(requestId);
      if (req) req.status = "negotiating";
      io.to(employerId).emit("worker_offer", data);
    });

    // ── Employer accepts worker offer ────────────────────────────
    socket.on("employer_accepted", (data) => {
      const { requestId, workerId } = data;
      const req = activeRequests.get(requestId);
      if (req) req.status = "confirmed";
      io.to(workerId).emit("employer_accepted", data);
      socket.broadcast.emit("request_taken", { requestId });
    });

    socket.on("employer_rejected", (data) => {
      io.to(data.workerId).emit("employer_rejected", data);
    });

    socket.on("employer_counter", (data) => {
      io.to(data.workerId).emit("employer_counter", data);
    });

    socket.on("employer_raised_fare", (data) => {
      const req = activeRequests.get(data.requestId);
      if (req) req.fare = data.newFare;
      socket.broadcast.emit("employer_raised_fare", data);
    });

    socket.on("employer_cancelled", (data) => {
      activeRequests.delete(data.requestId);
      socket.broadcast.emit("employer_cancelled", data);
    });

    socket.on("worker_accepted", (data) => {
      io.to(data.employerId).emit("worker_accepted", data);
    });

    socket.on("worker_rejected_counter", (data) => {
      io.to(data.employerId).emit("worker_rejected_counter", data);
    });

    // ── Worker location updates for live tracking ───────────────
    socket.on("worker_location_update", (data) => {
      const { workerId, employerId, lat, lng } = data;
      io.to(employerId).emit("worker_location_update", { workerId, lat, lng });
    });

    socket.on("disconnect", () => {
      if (onlineWorkers.has(socket.id)) {
        const w = onlineWorkers.get(socket.id);
        onlineWorkers.delete(socket.id);
        console.log(`[Worker Offline] ${w.name}`);
        io.emit("workers_online_count", onlineWorkers.size);
      }
    });
  });
};