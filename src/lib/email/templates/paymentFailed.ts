export function paymentFailedTemplate() {
  return {
    subject: "Action Required: Payment Failed",
    html: `
      <div style="font-family:Arial;margin:20px;">
        <h2>Payment Failed ⚠️</h2>
        <p>Your recent payment attempt was unsuccessful.</p>
        <p>Please update your billing details to continue uninterrupted service.</p>

        <a href="${process.env.APP_URL}/dashboard" 
           style="padding:10px 15px;background:#1A2540;color:white;text-decoration:none;border-radius:5px;">
          Update Billing
        </a>
      </div>
    `,
  };
}
