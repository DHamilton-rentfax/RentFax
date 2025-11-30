const functions = require("firebase-functions");
const stripe = require("stripe")(functions.config().stripe.secret);

exports.recordIncidentUsage = functions.firestore
  .document("tenants/{tenantId}/incidents/{incidentId}")
  .onCreate(async (snap, context) => {
    const tenantId = context.params.tenantId;

    await stripe.billing.meterEvents.create({
      eventName: "incident.created",
      payload: { tenantId },
    });
  });
