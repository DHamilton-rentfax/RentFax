// middleware/requireActiveUser.js

export const requireActiveUser = (req, res, next) => {
  if (!req.user || req.user.status !== 'active') {
    return res.status(403).json({ error: 'User account is not active' });
  }

  next();
};
