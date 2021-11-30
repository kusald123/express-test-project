const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  studentId: { type: String, unique: true},
  name: { type: String, default: null },
}, {timestamps: true});

module.exports = mongoose.model("Student", studentSchema);