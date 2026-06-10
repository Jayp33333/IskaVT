import * as userService from '../services/userService.js';

export async function listAdmins(_req, res) {
  const users = await userService.listAdmins();
  res.json({ success: true, data: users });
}

export async function createAdmin(req, res) {
  const user = await userService.createAdmin(req.body || {}, req.user._id);
  res.status(201).json({
    success: true,
    message: 'Admin account created',
    data: user,
  });
}

export async function updateAdmin(req, res) {
  const user = await userService.updateAdmin(req.params.id, req.body || {});
  res.json({
    success: true,
    message: 'Admin account updated',
    data: user,
  });
}

export async function deleteAdmin(req, res) {
  const result = await userService.deleteAdmin(req.params.id);
  res.json({
    success: true,
    message: 'Admin account deleted',
    data: result,
  });
}
