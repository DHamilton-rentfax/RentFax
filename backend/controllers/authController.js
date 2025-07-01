// backend/controllers/authController.js

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import User from '../models/User.js';
import Account from '../models/Account.js';
import { sendResetEmail } from '../utils/sendEmail.js';

const ACCESS_TOKEN_EXPIRY  = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function signToken({ id, role, account }) {
  return jwt.sign({ id, role, account }, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
}

function createRefreshToken(userId) {
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
}

export const register = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { email, password, accountName } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const [acct] = await Account.create(
      [{ name: accountName || email, owner: null }],
      { session }
    );

    const [user] = await User.create(
      [{ email, password, account: acct._id }],
      { session }
    );

    acct.owner = user._id;
    await acct.save({ session });

    await session.commitTransaction();
    session.endSession();

    const accessToken = signToken(user);
    const refreshToken = createRefreshToken(user._id);
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

    res.status(201).json({
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        plan: user.plan,
        account: user.account,
      },
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error('🛑 Registration error:', err);
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Email already registered.' });
    }
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email }).select('+password account role plan');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const accessToken = signToken(user);
    const refreshToken = createRefreshToken(user._id);
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

    res.json({
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        plan: user.plan,
        account: user.account,
      },
    });
  } catch (err) {
    console.error('🛑 Login error:', err);
    next(err);
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ error: 'No refresh token provided.' });
    }

    const { id } = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(id).select('account role plan');
    if (!user) {
      return res.status(401).json({ error: 'Invalid refresh token.' });
    }

    const accessToken = signToken(user);
    res.json({ accessToken });
  } catch (err) {
    console.error('🔄 Refresh token error:', err);
    res.clearCookie('refreshToken', COOKIE_OPTIONS);
    res.status(401).json({ error: 'Refresh token expired or invalid.' });
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'No user with that email.' });
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendResetEmail(email, resetURL);

    res.json({ message: 'Password reset email sent.' });
  } catch (err) {
    console.error('🛑 Forgot password error:', err);
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ error: 'Token and new password are required.' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select('+password');

    if (!user) {
      return res.status(400).json({ error: 'Reset token invalid or has expired.' });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    const accessToken = signToken(user);
    const refreshToken = createRefreshToken(user._id);
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

    res.json({ accessToken });
  } catch (err) {
    console.error('🛑 Reset password error:', err);
    next(err);
  }
};

export const logout = (req, res) => {
  res.clearCookie('refreshToken', COOKIE_OPTIONS);
  res.json({ message: 'Logged out successfully.' });
};

export const getMe = (req, res) => {
  const { id, role, plan, account } = req.user;
  res.json({ id, role, plan: plan || 'free', account });
};
