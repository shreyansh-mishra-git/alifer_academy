const nodemailer = require('nodemailer');

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('❌ CRITICAL: EMAIL_USER or EMAIL_PASS missing from environment variables!');
}

// Create a reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Add debug logging
  debug: true,
  logger: true
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error('❌ Transporter Verification Error:', error);
  } else {
    console.log('✅ Server is ready to take our messages');
  }
});

const sendEmail = async ({ email, subject, message }) => {
  const mailOptions = {
    from: `"Alifer Academy" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    html: message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Email sent successfully to:', email, '| Response:', info.response);
    return info;
  } catch (error) {
    console.error('❌ Error sending email to:', email, '| Error:', error);
    throw error;
  }
};

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
      <p style="margin-top: 20px;">This OTP is valid for <strong>10 minutes</strong>. If you did not request this, please ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #777; text-align: center;">&copy; 2024 Alifer Academy. All rights reserved.</p>
    </div>
  `;

  await sendEmail({ email, subject, message });
};

module.exports = { sendEmail, sendOTPEmail };
