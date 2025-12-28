import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },

  phone: String,
  location: String,
  blood_type: String,

  role: {
    type: String,
    enum: ['admin', 'doctor', 'patient', 'donor', 'ambulance_driver', 'staff'],
    required: true
  },

  // NEW: staff category (only for staff role)
  staff_category: {
    type: String,
    enum: ['receptionist', 'nurse', 'ward_boy'],
    required: function () {
      return this.role === 'staff';
    },
    default: null
  },

  // Role-specific fields
  is_verified: { type: Boolean, default: false },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
