import nodemailer from "nodemailer";

const isConfigured = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  return (
    user &&
    pass &&
    !user.includes("your_email") &&
    !pass.includes("your_email")
  );
};

let transporter = null;

const getTransporter = () => {
  if (!isConfigured()) return null;
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  return transporter;
};

export const sendMail = async ({ to, subject, html, replyTo }) => {
  const t = getTransporter();
  if (!t) {
    console.log("📭 Mailer not configured (EMAIL_USER/EMAIL_PASS missing) — skipping send.");
    return { skipped: true };
  }

  try {
    const info = await t.sendMail({
      from: `"AgroFresh" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      replyTo,
    });
    console.log("📨 Mail sent:", info.messageId);
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    console.error("📭 Mail send failed:", err.message);
    return { error: err.message };
  }
};
