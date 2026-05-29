const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  techStack: {
    type: [String],
    default: [],
  },
  liveLink: {
    type: String,
    trim: true,
    default: '',
  },
  customBanner: {
    type: String,
    default: '',
  },
  featured: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
