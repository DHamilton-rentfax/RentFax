// backend/models/Blacklist.js

import mongoose from 'mongoose';

const blacklistSchema = new mongoose.Schema({
  licenseNumber: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    default: '',
  },
  reason: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Blacklist = mongoose.model('Blacklist', blacklistSchema);
export default Blacklist;
