// backend/models/AnalyticsLog.js

import mongoose from 'mongoose';

const analyticsLogSchema = new mongoose.Schema({
  route: { type: String, required: true },
  method: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  authenticated: { type: Boolean, default: false },
  ip: { type: String },
  userAgent: { type: String },
});

export default mongoose.model('AnalyticsLog', analyticsLogSchema);
