import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must be at most 5'],
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      trim: true,
      maxlength: [2000, 'Comment must be 2000 characters or fewer'],
    },
    fullName: {
      type: String,
      trim: true,
      default: 'Guest',
      maxlength: [120, 'Full name must be 120 characters or fewer'],
    },
    logbookEntryId: {
      type: String,
      trim: true,
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

feedbackSchema.index({ createdAt: -1 });
feedbackSchema.index({ isRead: 1 });

feedbackSchema.set('toJSON', {
  transform(_doc, ret) {
    if (!ret.fullName && ret.visitorName) {
      ret.fullName = ret.visitorName;
    }
    delete ret.visitorName;
    return ret;
  },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;
