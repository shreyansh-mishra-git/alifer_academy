const nodemailer = require('nodemailer');

// ✅ Stable Brevo SMTP config (Render-safe)
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 2525, // 🔥 best for cloud
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 15000,
});

// ✅ Verify connection
transporter.verify((error) => {
  if (error) {
    console.error('❌ Email server error:', error);
  } else {
    console.log('✅ Email server is ready');
  }
});

// ✅ Generic email sender
const sendEmail = async ({ email, subject, message }) => {
  try {
    console.log("📤 Sending email to:", email);

    const info = await transporter.sendMail({
      from: `"Alifer Academy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html: message,
    });

    console.log('✅ Email sent successfully:', info.response);
    return info;
  } catch (error) {
    console.error('❌ Email failed:', error);
    throw error;
  }
};

// ✅ OTP email
const sendOTPEmail = async (email, otp) => {
  console.log("📨 Sending OTP to:", email);

  const subject = 'Your Verification Code - Alifer Academy';

  const message = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px;">
      <h2 style="color: #4F46E5; text-align: center;">Welcome to Alifer Academy!</h2>
      <p>Hello,</p>
      <p>Use the OTP below to continue:</p>
      <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
        ${otp}
      </div>
      <p style="margin-top: 20px;">Valid for <strong>10 minutes</strong>.</p>
      <p>If you didn’t request this, ignore this email.</p>
      <hr>
      <p style="font-size: 12px; text-align: center;">© 2026 Alifer Academy</p>
    </div>
  `;

  return await sendEmail({ email, subject, message });
};

module.exports = { sendEmail, sendOTPEmail };