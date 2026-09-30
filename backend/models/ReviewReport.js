import mongoose from 'mongoose';

const reviewReportSchema = new mongoose.Schema(
  {
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    reason: {
      type: String,
      enum: ['Spam', 'Offensive', 'Fake Review', 'Irrelevant', 'Other'],
      required: true,
    },
    details: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

reviewReportSchema.index({ review: 1, user: 1 }, { unique: true });

const ReviewReport = mongoose.model('ReviewReport', reviewReportSchema);

export default ReviewReport;
