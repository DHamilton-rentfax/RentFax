// middleware/requireAdminOrSelf.js

export const requireAdminOrSelf = (req, res, next) => {
  const isAdmin = req.user?.role === 'admin';
  const isSelf = req.user?.id === req.params.id;

  if (!isAdmin && !isSelf) {
    return res.status(403).json({ error: 'Access denied: Not admin or owner' });
  }

  next();
};
