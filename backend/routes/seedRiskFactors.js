// backend/routes/seedRiskFactors.js
import express from 'express';
import RiskFactorConfig from '../models/RiskFactorConfig.js';

const router = express.Router();

// Admin-only: seed or update default risk factor weights
router.post('/', async (req, res, next) => {
  try {
    const defaults = [
      { key: 'baseScore', weight: 0, description: 'Starting score for every report' },
      { key: 'recentIncidentWeight', weight: 5, description: 'Points per incident in last 6 months' },
      { key: 'oldIncidentWeight', weight: 2, description: 'Points per incident older than 6 months' },
      { key: 'personaFailWeight', weight: 20, description: 'Points if Persona status = "unverified" or "denied"' },
      { key: 'personaReviewWeight', weight: 10, description: 'Points if Persona status = "in_review"' },
      { key: 'banThreshold', weight: 100, description: 'Auto-ban renter if score >= this value' },
    ];

    for (const config of defaults) {
      await RiskFactorConfig.findOneAndUpdate(
        { key: config.key },
        { weight: config.weight, description: config.description },
        { upsert: true, new: true }
      );
    }

    res.status(200).json({ message: 'Risk factor weights seeded or updated successfully.' });
  } catch (err) {
    console.error('❌ Failed to seed risk factors:', err);
    next(err);
  }
});

export default router;
