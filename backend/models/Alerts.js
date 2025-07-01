// backend/models/Alert.js

import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const alertSchema = new Schema(
  {
    report: {
      type: Types.ObjectId,
      ref: 'RiskReport',
      required: true,
    },
    account: {
      type: Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    type: {
      type: String,
      enum: ['high-risk', 'blacklist'],
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    toObject: {
      virtuals: true,
      versionKey: false,
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// Add compound index for unread alerts per account
alertSchema.index({ account: 1, read: 1 });

const Alert = model('Alert', alertSchema);
export default Alert;
