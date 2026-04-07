const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use Gmail App Password
  },
});

const sendOTPEmail = async (toEmail, otp, userName = "User") => {
  const mailOptions = {
    from: `"Rozgar Hub" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your OTP Verification Code - Rozgar Hub",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body { font-family: 'Segoe UI', sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 500px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 30px; text-align: center; }
          .header h1 { color: #e94560; margin: 0; font-size: 28px; letter-spacing: 2px; }
          .header p { color: #aaa; margin: 5px 0 0; font-size: 13px; }
          .body { padding: 40px 30px; text-align: center; }
          .body p { color: #555; font-size: 15px; line-height: 1.6; }
          .otp-box { background: #f0f4ff; border: 2px dashed #e94560; border-radius: 10px; padding: 20px; margin: 25px auto; display: inline-block; }
          .otp-code { font-size: 42px; font-weight: 900; color: #1a1a2e; letter-spacing: 10px; }
          .expiry { color: #e94560; font-size: 13px; margin-top: 8px; }
          .footer { background: #f9f9f9; padding: 20px; text-align: center; color: #aaa; font-size: 12px; }
          .warning { color: #e94560; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ROZGAR HUB</h1>
            <p>Pakistan's Trusted Job Platform</p>
          </div>
          <div class="body">
            <p>Hello <strong>${userName}</strong>,</p>
            <p>Use the OTP below to verify your email address. This code is valid for <strong>10 minutes</strong>.</p>
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
              <div class="expiry">⏰ Expires in 10 minutes</div>
            </div>
            <p class="warning">⚠️ Do NOT share this OTP with anyone.</p>
            <p style="color:#aaa; font-size:13px;">If you didn't request this, please ignore this email.</p>
          </div>
          <div class="footer">
            © ${new Date().getFullYear()} Rozgar Hub. All rights reserved.<br/>
            This is an automated email, please do not reply.
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOTPEmail };