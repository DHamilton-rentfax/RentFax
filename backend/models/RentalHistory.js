// backend/models/RentalHistory.js

import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const EventSchema = new Schema({
  title: String,
  description: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

const LeaseSchema = new Schema({
  property: String,
  start: Date,
  end: Date,
  events: [EventSchema],
});

const RentalHistorySchema = new Schema(
  {
    applicant: {
      type: Types.ObjectId,
      ref: 'User',
      unique: true,
      required: true,
    },
    leases: [LeaseSchema],
  },
  {
    timestamps: true,
  }
);

const RentalHistory = model('RentalHistory', RentalHistorySchema);
export default RentalHistory;
