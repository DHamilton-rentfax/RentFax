// backend/models/RentalEvent.js

import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const rentalEventSchema = new Schema(
  {
    applicantId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // or 'Applicant' if separated
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    type: {
      type: String, // e.g. 'damage', 'smoking', 'late-return'
      required: true,
    },
    description: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const RentalEvent = model('RentalEvent', rentalEventSchema);
export default RentalEvent;
