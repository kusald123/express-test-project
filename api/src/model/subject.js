const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  subjectId: { type: String, unique: true },
  name: { type: String, default: null }
}, {timestamps: true});

module.exports = mongoose.model("Subject", subjectSchema);