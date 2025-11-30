export function lowCreditsTemplate({ credits }: any) {
  return {
    subject: "Your RentFAX Credits Are Running Low",
    html: `
      <div style="font-family:Arial;margin:20px;">
        <h2>Low Credits Alert 🔔</h2>
        <p>Your account has <strong>${credits}</strong> credits remaining.</p>
        <p>Purchase more credits to avoid interruptions.</p>

        <a href="${process.env.APP_URL}/dashboard" 
           style="padding:10px 15px;background:#1A2540;color:white;text-decoration:none;border-radius:5px;">
          Buy Credits
        </a>
      </div>
    `,
  };
}
