const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
profilephoto: {
    data: Buffer,
    contentType: String
  },
  logo: { type: String }, 
  applicants: { type: Number, required: true },
  description: { type: String, required: true }
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
