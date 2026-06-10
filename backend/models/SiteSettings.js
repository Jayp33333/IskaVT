import mongoose from 'mongoose';

const DEFAULT_GOOGLE_FORM_ID =
  '1FAIpQLSf8WGN4fQOaYq4YO1eaUHOjjRN1v32b80BjURo-jOY4ytDl9Q';

const DEFAULT_GOOGLE_FORM_URL = `https://docs.google.com/forms/d/e/${DEFAULT_GOOGLE_FORM_ID}/viewform`;

const siteSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'global',
    },
    feedbackMode: {
      type: String,
      enum: ['native', 'google_form'],
      default: 'google_form',
    },
    googleFormUrl: {
      type: String,
      default: DEFAULT_GOOGLE_FORM_URL,
      trim: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

export { DEFAULT_GOOGLE_FORM_URL };
export default mongoose.model('SiteSettings', siteSettingsSchema);
