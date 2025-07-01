// backend/models/Transaction.js

import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const transactionSchema = new Schema(
  {
    reportId: {
      type: Schema.Types.ObjectId,
      ref: 'Report',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['completed', 'failed'],
      default: 'completed',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  }
);

const Transaction = model('Transaction', transactionSchema);
export default Transaction;
