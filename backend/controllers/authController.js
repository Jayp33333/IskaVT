import * as authService from '../services/authService.js';

export async function login(req, res) {
  const { username, password } = req.body || {};
  const result = await authService.login(username, password);
  res.json({ success: true, data: result });
}

export async function me(req, res) {
  const profile = await authService.getProfile(req.user._id);
  res.json({ success: true, data: profile });
}
