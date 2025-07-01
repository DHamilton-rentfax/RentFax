// backend/models/RiskReport.js

import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

// Embedded applicant subdocument
const applicantSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Applicant name is required.'],
      trim: true,
    },
    dob: {
      type: Date,
      required: [true, 'Applicant date of birth is required.'],
    },
    licenseNumber: {
      type: String,
      required: [true, 'License number is required.'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
  },
  { _id: false }
);

const riskReportSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Report title is required.'],
      trim: true,
    },
    details: {
      type: String,
      trim: true,
    },
    applicant: {
      type: applicantSchema,
      required: [true, 'Applicant information is required.'],
    },
    submittedBy: {
      type: Types.ObjectId,
      ref: 'User',
      required: [true, 'submittedBy is required.'],
    },
    account: {
      type: Types.ObjectId,
      ref: 'Account',
      required: [true, 'Account is required.'],
    },
    identityVerification: {
      vendor:       { type: String, trim: true },
      status:       { type: String, trim: true },
      confidence:   { type: Number },
      nameMatch:    { type: Boolean },
      dobMatch:     { type: Boolean },
      licenseMatch: { type: Boolean },
    },
    rentalHistory: {
      records:   { type: [Schema.Types.Mixed], default: [] },
      retrieved: { type: Date },
    },
    fraudScore: {
      type: Number,
      required: [true, 'fraudScore is required.'],
    },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual `id` field
riskReportSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Auto-derive riskLevel based on fraudScore
riskReportSchema.pre('save', function (next) {
  if (this.isModified('fraudScore')) {
    if (this.fraudScore >= 70) {
      this.riskLevel = 'high';
    } else if (this.fraudScore >= 40) {
      this.riskLevel = 'medium';
    } else {
      this.riskLevel = 'low';
    }
  }
  next();
});

const RiskReport = model('RiskReport', riskReportSchema);
export default RiskReport;
