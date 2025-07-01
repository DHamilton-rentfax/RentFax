const generateResetPasswordEmail = (resetLink) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Reset Your Password</title>
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
    <h1>Reset Your Password 🔒</h1>
    <p>We received a request to reset your RentFAX password.</p>
    <p>If you requested this change, click below to create a new password. This link expires in 60 minutes for your security.</p>
    <a href="${resetLink}" class="button">Reset Password</a>
    <p style="margin-top: 30px;">If you didn't request this, you can safely ignore this email.</p>
    <div class="footer">© 2025 RentFAX. All rights reserved.</div>
  </div>
</body>
</html>
`;

module.exports = generateResetPasswordEmail;
