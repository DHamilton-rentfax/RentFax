// backend/controllers/userController.js

import User from '../models/User.js';

export async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;

    // Prevent self-deletion by admins
    if (req.user.id === id) {
      return res.status(400).json({ error: "You can't delete yourself." });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ message: 'User deleted.' });
  } catch (err) {
    next(err);
  }
}
