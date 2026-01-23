import mongoose from 'mongoose';

const logbookSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  visitorType: {
    type: String,
    required: [true, 'Visitor type is required'],
    trim: true
  },
  purpose: {
    type: String,
    required: [true, 'Purpose is required'],
    trim: true
  },
  destination: {
    type: String,
    required: [true, 'Destination is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  timeIn: {
    type: Date,
    required: [true, 'Time in is required'],
    default: Date.now
  },
  timeOut: {
    type: Date,
    default: null
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Index for faster queries
logbookSchema.index({ date: -1 });
logbookSchema.index({ fullName: 1 });

const Logbook = mongoose.model('Logbook', logbookSchema);

export default Logbook;
