export function paymentSuccessTemplate({ amount, credits }: any) {
  return {
    subject: "Your RentFAX Payment Was Successful",
    html: `
      <div style="font-family:Arial;margin:20px;">
        <h2>Your Payment Was Successful 🎉</h2>
        <p>Thank you for your recent purchase on RentFAX.</p>

        <p><strong>Amount:</strong> $${amount.toFixed(2)}</p>
        ${
          credits
            ? `<p><strong>Credits Added:</strong> ${credits}</p>`
            : ""
        }

        <p>If you have any questions, reply to this email.</p>
      </div>
    `,
  };
}
