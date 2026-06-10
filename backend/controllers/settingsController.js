import * as settingsService from '../services/settingsService.js';

export async function getPublicSettings(_req, res) {
  const settings = await settingsService.getPublicSettings();
  res.json({ success: true, data: settings });
}

export async function getSettings(_req, res) {
  const settings = await settingsService.getSettings();
  res.json({ success: true, data: settings });
}

export async function updateSettings(req, res) {
  const settings = await settingsService.updateSettings(
    req.body || {},
    req.user._id
  );
  res.json({
    success: true,
    message: 'Settings updated',
    data: settings,
  });
}
