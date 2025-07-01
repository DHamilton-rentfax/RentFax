// backend/controllers/personaController.js
import Persona from 'persona';
import Renter from '../models/Renter.js';
import ManualReview from '../models/ManualReview.js';
import Report from '../models/Report.js';
import { verifyPersonaSignature } from '../utils/personaHelpers.js';

// Save explicit result from the frontend (optional redundancy)
export async function savePersonaResult(req, res, next) {
  try {
    const { renterId, personaId, status, outcome } = req.body;
    await Renter.findByIdAndUpdate(renterId, {
      personaVerification: { personaId, status, outcome, updatedAt: new Date() },
    });
    return res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

// Persona Webhook Receiver
export async function personaWebhook(req, res, next) {
  try {
    const signature = req.headers['persona-signature'];
    const rawBody = req.rawBody; // set by your bodyParser verify middleware

    // 1) Verify webhook signature
    verifyPersonaSignature(rawBody, signature);

    const { event, data } = req.body;
    // e.g., event = "verification:updated", data = { id, status, outcome, referenceId }

    if (event === 'verification:updated') {
      const { id: personaId, status, outcome, referenceId } = data;
      const renterId = referenceId; // what we passed as referenceId

      // 2) Update renter’s verification status
      await Renter.findByIdAndUpdate(renterId, {
        personaVerification: { personaId, status, outcome, updatedAt: new Date() },
      });

      // 3) If flagged, enqueue for manual review
      if (status === 'in_review' || status === 'unverified') {
        await ManualReview.create({ renterId, personaId, status, createdAt: new Date() });
      }

      // 4) Recompute risk score for all that renter’s reports
      const reports = await Report.find({ renterId });
      for (const rpt of reports) {
        await rpt.calculateRiskScore();
        await rpt.save();
      }
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error('Persona webhook error:', err);
    return res.sendStatus(400);
  }
}
