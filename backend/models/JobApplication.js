const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Applied', 'Interview', 'Offer', 'Rejected'],
    default: 'Applied',
  },
  dateApplied: {
    type: Date,
    default: Date.now,
  },
  link: {
    type: String,
  },
  location: {
    type: String,
  },
  salary: {
    type: String,
  },
  notes: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
