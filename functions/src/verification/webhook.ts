exports.incodeWebhook = functions.https.onRequest(async (req, res) => {
  const event = req.body;
  const db = getFirestore();

  await db.collection("verification_logs").add({
    event,
    timestamp: new Date()
  });

  res.status(200).send("OK");
});
