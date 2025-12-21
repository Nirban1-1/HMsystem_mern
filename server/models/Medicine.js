import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
  drugName: {
    type: String,
    required: true,
    trim: true
  },
  manufacturer: {
    type: String,
    required: false,
    trim: true,
    default: 'Generic'
  },
  image: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: true
  },
  consumeType: {
    type: String,
    required: false,
    default: 'As Directed'
  },
  expirydate: {
    type: Date,
    required: false,
    default: null
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  sideEffects: {
    type: String,
    default: ''
  },
  disclaimer: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: true
  },
  countInStock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Medicine', medicineSchema);
