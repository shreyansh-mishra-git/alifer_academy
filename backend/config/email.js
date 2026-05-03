const axios = require('axios');

const BREVO_API_KEY = process.env.BREVO_API_KEY;

// ✅ Send email using Brevo API
const sendEmail = async ({ email, subject, message }) => {
  try {
    console.log("📤 Sending email to:", email);

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Alifer Academy",
          email: "aa0b77001@smtp-brevo.com",
        },
        to: [{ email }],
        subject: subject,
        htmlContent: message,
      },
      {
        headers: {
          "api-key": BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Email sent:", response.data);
    return response.data;

  } catch (error) {
    console.error("❌ Email failed:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ OTP email
const sendOTPEmail = async (email, otp) => {
  console.log("📨 Sending OTP to:", email);

  const subject = "Your OTP Code";

  const message = `
    <div style="font-family: Arial; max-width:600px; margin:auto; padding:20px;">
      <h2>Alifer Academy</h2>
      <p>Your OTP is:</p>
      <h1 style="letter-spacing:5px;">${otp}</h1>
      <p>This OTP is valid for 10 minutes.</p>
    </div>
  `;

  return await sendEmail({ email, subject, message });
};

module.exports = { sendEmail, sendOTPEmail };