// backend/models/RiskFactorConfig.js

import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const RiskFactorConfigSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      // e.g., 'baseScore', 'recentIncidentWeight', 'personaFailWeight', etc.
    },
    weight: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const RiskFactorConfig = model('RiskFactorConfig', RiskFactorConfigSchema);
export default RiskFactorConfig;
