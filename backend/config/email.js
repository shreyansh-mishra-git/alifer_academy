const nodemailer = require('nodemailer');

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_HOST) {
  console.error('❌ CRITICAL: Email environment variables missing!');
} else {
  console.log('📧 Email Config Loaded:', {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER
  });
}

// ✅ Brevo SMTP CONFIG
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false, // true for 465, false for other ports like 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false // Helps with some hosting environments
  },
  family: 4, 
  connectionTimeout: 10000, 
  greetingTimeout: 10000,
  socketTimeout: 10000,
  debug: true,
  logger: true,
});

// ✅ Verify transporter on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Transporter Verification Error:', error);
  } else {
    console.log('✅ Email server is ready');
  }
});

// ✅ Generic email sender
const sendEmail = async ({ email, subject, message }) => {
  console.log('📤 Attempting to send email to:', email);

  // Brevo often requires a verified sender email. 
  // If EMAIL_FROM is not set, we fallback to EMAIL_USER.
  const senderEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  const mailOptions = {
    from: `"Alifer Academy" <${senderEmail}>`,
    to: email,
    subject,
    html: message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ EMAIL SENT:', info.response);
    return info;
  } catch (error) {
    console.error('❌ EMAIL FAILED DETAILS:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
    throw error;
  }
};

// ✅ OTP email function
const sendOTPEmail = async (email, otp) => {
  const subject = 'Your Verification Code - Alifer Academy';

  const message = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px;">
      <h2 style="color: #4F46E5; text-align: center;">Welcome to Alifer Academy!</h2>
      <p>Hello,</p>
      <p>To continue, please use the following One-Time Password (OTP):</p>
      <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #333;">
        ${otp}
      </div>
      <p style="margin-top: 20px;">This OTP is valid for <strong>10 minutes</strong>.</p>
      <p>If you did not request this, please ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #777; text-align: center;">© 2026 Alifer Academy</p>
    </div>
  `;

  return await sendEmail({ email, subject, message });
};

module.exports = { sendEmail, sendOTPEmail };