import mongoose from 'mongoose';

const logbookSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [120, 'Full name must be 120 characters or fewer']
  },
  visitorType: {
    type: String,
    required: [true, 'Visitor type is required'],
    trim: true,
    maxlength: [60, 'Visitor type must be 60 characters or fewer']
  },
  purpose: {
    type: String,
    required: [true, 'Purpose is required'],
    trim: true,
    maxlength: [500, 'Purpose must be 500 characters or fewer']
  },
  destination: {
    type: String,
    required: [true, 'Destination is required'],
    trim: true,
    maxlength: [120, 'Destination must be 120 characters or fewer']
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

// Indexes for list sorting and stats filters (timeIn ranges, open visits).
logbookSchema.index({ date: -1 });
logbookSchema.index({ fullName: 1 });
logbookSchema.index({ createdAt: -1 });
logbookSchema.index({ timeIn: -1 });
logbookSchema.index({ timeOut: 1, timeIn: -1 });

const Logbook = mongoose.model('Logbook', logbookSchema);

export default Logbook;
