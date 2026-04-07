const User = require("..models/User");
const WorkerProfile = require("./WorkerProfile");
const EmployerProfile = require("./EmployerProfile");
const Job = require("./Job");
const Bid = require("./Bid");
const Review = require("./Review");

// Relations
User.hasOne(WorkerProfile, { foreignKey: "userId" });
WorkerProfile.belongsTo(User, { foreignKey: "userId" });

User.hasOne(EmployerProfile, { foreignKey: "userId" });
EmployerProfile.belongsTo(User, { foreignKey: "userId" });

EmployerProfile.hasMany(Job, { foreignKey: "employerId" });
Job.belongsTo(EmployerProfile, { foreignKey: "employerId" });

Job.hasMany(Bid, { foreignKey: "jobId" });
Bid.belongsTo(Job, { foreignKey: "jobId" });

WorkerProfile.hasMany(Bid, { foreignKey: "workerId" });
Bid.belongsTo(WorkerProfile, { foreignKey: "workerId" });

module.exports = {
  User,
  WorkerProfile,
  EmployerProfile,
  Job,
  Bid,
  Review,
};
