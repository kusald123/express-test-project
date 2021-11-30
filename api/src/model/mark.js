const mongoose = require("mongoose");

const markSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    mark: { type: Number, default: 0 },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    grade: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade' },
    semester: { type: Number, default: null },
    year: { type: String, default: null },
}, {timestamps: true});

module.exports = mongoose.model("Mark", markSchema);