const generateWelcomeEmail = (userName = 'there') => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Welcome to RentFAX</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f9fafb; margin: 0; padding: 20px; }
    .container { background: white; max-width: 600px; margin: auto; border-radius: 12px; padding: 40px; box-shadow: 0 4px 8px rgba(0,0,0,0.05); }
    h1 { color: #4f46e5; }
    p { color: #374151; font-size: 16px; }
    .button { display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; margin-top: 20px; border-radius: 8px; text-decoration: none; font-weight: bold; }
    .footer { margin-top: 40px; font-size: 12px; color: #9ca3af; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome to RentFAX 🚀</h1>
    <p>Hi ${userName},</p>
    <p>Thank you for joining <strong>RentFAX</strong> — the future of rental risk intelligence.</p>
    <p>Start exploring your dashboard now to submit reports, manage your plan, and grow smarter!</p>
    <a href="${process.env.CLIENT_URL}/dashboard" class="button">Go to Dashboard</a>
    <p style="margin-top: 30px;">Need assistance? We're just one click away.</p>
    <div class="footer">© 2025 RentFAX. All rights reserved.</div>
  </div>
</body>
</html>
`;

export default generateWelcomeEmail;
