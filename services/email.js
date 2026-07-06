import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const isEmailConfigured =
  process.env.SMTP_USER &&
  process.env.SMTP_PASS &&
  process.env.SMTP_HOST;

let transporter;

if (isEmailConfigured) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  console.log('Nodemailer service configured.');
} else {
  console.log('Nodemailer not configured. Email notifications will be logged to console.');
}

/**
 * Send email notification
 * @param {object} options - { email, subject, message, html }
 */
export const sendEmail = async (options) => {
  const mailOptions = {
    from: `"Advocate Mubashir Alam Portfolio" <${process.env.SMTP_USER || 'noreply@mubashiralam.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  if (isEmailConfigured) {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return info;
  } else {
    console.log('=== EMAIL NOTIFICATION LOG ===');
    console.log(`To: ${mailOptions.to}`);
    console.log(`Subject: ${mailOptions.subject}`);
    console.log(`Content:\n${mailOptions.text}`);
    console.log('==============================');
    return { mock: true, messageId: 'mock-id-12345' };
  }
};
