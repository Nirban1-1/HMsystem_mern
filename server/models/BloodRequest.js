// server/models/BloodRequest.js
import mongoose from 'mongoose';

const bloodRequestSchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  blood_type: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['requested', 'accepted', 'completed'],
    default: 'requested'
  },
  donor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  requested_at: {
    type: Date,
    default: Date.now
  },
  accepted_at: {
    type: Date
  },
  completed_at: {
    type: Date
  }
}, {
  timestamps: true
});

const BloodRequest = mongoose.model('BloodRequest', bloodRequestSchema);
export default BloodRequest;
