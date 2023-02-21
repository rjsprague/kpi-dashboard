import mongoose from 'mongoose'

const LeadSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  source: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  connected: {
    type: Boolean,
    required: true
  },
  triageCall: {
    type: Boolean,
    required: true
  },
  triageCallQualified: {
    type: Boolean,
    required: true
  },
  perfectPresentation: {
    type: Boolean,
    required: true
  },
  contracted: {
    type: Boolean,
    required: true
  },
  acquired: {
    type: Boolean,
    required: true
  }
});

const Lead = mongoose.model("Lead", LeadSchema);

export default Lead;
