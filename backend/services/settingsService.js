import SiteSettings, { DEFAULT_GOOGLE_FORM_URL } from '../models/SiteSettings.js';
import { badRequest } from '../utils/HttpError.js';

const SETTINGS_KEY = 'global';

function isValidGoogleFormUrl(url) {
  try {
    const parsed = new URL(url);
    return (
      parsed.hostname === 'docs.google.com' &&
      parsed.pathname.includes('/forms/')
    );
  } catch {
    return false;
  }
}

async function getOrCreateSettings() {
  let settings = await SiteSettings.findOne({ key: SETTINGS_KEY });
  if (!settings) {
    settings = await SiteSettings.create({
      key: SETTINGS_KEY,
      feedbackMode: 'google_form',
      googleFormUrl: DEFAULT_GOOGLE_FORM_URL,
    });
  }
  return settings;
}

export async function getPublicSettings() {
  const settings = await getOrCreateSettings();
  return {
    feedbackMode: settings.feedbackMode,
    googleFormUrl: settings.googleFormUrl,
  };
}

export async function getSettings() {
  const settings = await getOrCreateSettings();
  return {
    feedbackMode: settings.feedbackMode,
    googleFormUrl: settings.googleFormUrl,
    updatedAt: settings.updatedAt,
  };
}

export async function updateSettings({ feedbackMode, googleFormUrl }, updatedBy) {
  const settings = await getOrCreateSettings();

  if (feedbackMode !== undefined) {
    if (!['native', 'google_form'].includes(feedbackMode)) {
      throw badRequest('feedbackMode must be native or google_form');
    }
    settings.feedbackMode = feedbackMode;
  }

  if (googleFormUrl !== undefined) {
    const trimmed = googleFormUrl.trim();
    if (!trimmed) {
      throw badRequest('Google Form URL is required');
    }
    if (!isValidGoogleFormUrl(trimmed)) {
      throw badRequest('Must be a valid Google Forms URL (docs.google.com/forms/...)');
    }
    settings.googleFormUrl = trimmed;
  }

  if (updatedBy) {
    settings.updatedBy = updatedBy;
  }

  await settings.save();

  return {
    feedbackMode: settings.feedbackMode,
    googleFormUrl: settings.googleFormUrl,
    updatedAt: settings.updatedAt,
  };
}
