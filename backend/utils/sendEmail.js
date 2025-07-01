// backend/utils/sendEmail.js

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends a generic email using configured transporter
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Subject of the email
 * @param {string} options.text - Plaintext fallback
 * @param {string} options.html - HTML body (optional)
 * @returns {Promise<Object>} - nodemailer response object
 */
export async function sendEmail({ to, subject, text, html }) {
  const mailOptions = {
    from: `"RentFAX" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}: ${info.response}`);
    return info;
  } catch (err) {
    console.error(`❌ Failed to send email to ${to}:`, err);
    throw new Error('Email sending failed.');
  }
}

/**
 * Sends a password reset email with preformatted HTML and text
 * @param {string} to - Recipient email
 * @param {string} resetUrl - Full URL to password reset page
 */
export async function sendResetEmail(to, resetUrl) {
  const subject = 'Reset Your Password – RentFAX';
  const text = `You requested a password reset. Click the link to reset: ${resetUrl}`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9;">
      <h2 style="color: #333;">Reset Your Password</h2>
      <p>Click below to securely reset your password:</p>
      <a href="${resetUrl}" style="display:inline-block;padding:12px 20px;background:#0d6efd;color:#fff;text-decoration:none;border-radius:5px;">Reset Password</a>
      <p style="margin-top:15px;">If you didn’t request this, you can safely ignore it.</p>
      <p style="margin-top:30px;">— The RentFAX Team</p>
    </div>
  `;

  return sendEmail({ to, subject, text, html });
}
