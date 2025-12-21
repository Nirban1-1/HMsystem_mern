import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  appointment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  medicines: [{
    medicine_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medicine',
      required: true
    },
    dosage: {
      type: String,
      default: ''
    },
    duration: {
      type: String,
      default: ''
    },
    timing: {
      morning: {
        type: Boolean,
        default: false
      },
      noon: {
        type: Boolean,
        default: false
      },
      night: {
        type: Boolean,
        default: false
      }
    }
  }],
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('Prescription', prescriptionSchema);
