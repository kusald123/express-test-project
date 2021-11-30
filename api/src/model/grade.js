const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema({
    grade: { type: String, unique: true },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 }
}, {timestamps: true});

module.exports = mongoose.model("Grade", gradeSchema);