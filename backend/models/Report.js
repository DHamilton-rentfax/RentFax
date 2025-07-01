// backend/models/Report.js

import mongoose from 'mongoose';
import AuditLog from './AuditLog.js';
import RiskFactorConfig from './RiskFactorConfig.js';
import Renter from './Renter.js';

const { Schema, model } = mongoose;

// ─── Schema Definition ────────────────────────────────────────────────────────
const ReportSchema = new Schema(
  {
    name: { type: String, required: true },
    dob: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    notes: { type: String },

    status: {
      type: String,
      enum: ['pending', 'paid', 'flagged'],
      default: 'pending',
    },

    incidents: [
      {
        date: { type: Date, required: true },
        severity: { type: String, enum: ['minor', 'major'], default: 'minor' },
        description: { type: String },
      },
    ],

    personaVerification: {
      inquiryId: { type: String },
      status: {
        type: String,
        enum: ['approved', 'in_review', 'unverified', 'denied'],
      },
      outcome: { type: String },
      updatedAt: { type: Date },
    },

    riskScore: { type: Number, default: 0 },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },

    flaggedBy: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Virtuals ────────────────────────────────────────────────────────────────
ReportSchema.virtual('formattedDate').get(function () {
  return new Date(this.createdAt).toLocaleString();
});

// ─── Risk Scoring Logic ──────────────────────────────────────────────────────
let _configCache = null;

async function loadRiskConfigs() {
  if (_configCache) return _configCache;

  const configs = await RiskFactorConfig.find({});
  _configCache = configs.reduce((map, cfg) => {
    map[cfg.key] = cfg.weight;
    return map;
  }, {});

  return _configCache;
}

ReportSchema.methods.calculateRiskScore = async function () {
  const report = this;
  const cfg = await loadRiskConfigs();
  let score = cfg.baseScore || 0;

  if (!report.phone) score += cfg.missingPhoneWeight || 0;
  if (!report.email) score += cfg.missingEmailWeight || 0;
  if (!report.licenseNumber) score += cfg.missingLicenseWeight || 0;
  if (report.name?.length < (cfg.minNameLength || 3)) score += cfg.shortNameWeight || 0;

  const now = Date.now();
  const sixMonthsMs = 1000 * 60 * 60 * 24 * 30 * 6;

  for (const inc of report.incidents) {
    const diff = now - new Date(inc.date).getTime();
    score += diff <= sixMonthsMs ? cfg.recentIncidentWeight || 0 : cfg.oldIncidentWeight || 0;
  }

  const pv = report.personaVerification;
  if (pv?.status) {
    if (['unverified', 'denied'].includes(pv.status)) {
      score += cfg.personaFailWeight || 0;
    } else if (pv.status === 'in_review') {
      score += cfg.personaReviewWeight || 0;
    }
  }

  score = Math.min(score, cfg.maxScore || 100);
  report.riskScore = score;

  if (score >= (cfg.highThreshold || 70)) {
    report.riskLevel = 'high';
  } else if (score >= (cfg.mediumThreshold || 40)) {
    report.riskLevel = 'medium';
  } else {
    report.riskLevel = 'low';
  }

  if (cfg.banThreshold && score >= cfg.banThreshold) {
    await Renter.findByIdAndUpdate(report.createdBy, { status: 'banned' });
  }

  return { score, level: report.riskLevel };
};

// ─── Hooks ───────────────────────────────────────────────────────────────────
ReportSchema.pre('save', function (next) {
  this.wasNew = this.isNew;
  if (this.isNew && !this.createdBy && this._userId) {
    this.createdBy = this._userId;
  }
  next();
});

ReportSchema.post('save', async function (doc) {
  try {
    await doc.calculateRiskScore();
    await doc.save();

    await AuditLog.create({
      action: doc.wasNew ? 'create' : 'update',
      model: 'Report',
      reportId: doc._id,
      changedBy: doc._userId || 'system',
      data: doc.toObject(),
    });
  } catch (err) {
    console.error('⚠️ Report post-save error:', err);
  }
});

ReportSchema.post('remove', async function (doc) {
  try {
    await AuditLog.create({
      action: 'delete',
      model: 'Report',
      reportId: doc._id,
      changedBy: doc._userId || 'system',
      data: doc.toObject(),
    });
  } catch (err) {
    console.error('⚠️ Audit log failed:', err.message);
  }
});

// ─── Export Model ─────────────────────────────────────────────────────────────
const Report = model('Report', ReportSchema);
export default Report;
