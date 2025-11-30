exports.logLogin = functions.auth.user().onLogin(async (user) => {
  const db = getFirestore();
  const context = user.metadata;

  await db.collection("login_logs").add({
    renterId: user.uid,
    timestamp: new Date(),
    ip: context.ipAddress,
    userAgent: context.userAgent,
    deviceFingerprint: context.deviceId
  });
});
