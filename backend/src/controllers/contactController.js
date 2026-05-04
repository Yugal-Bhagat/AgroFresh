import ContactMessage from "../models/ContactMessage.js";
import { sendMail } from "../utils/mailer.js";

const ADMIN_NOTIFY_EMAIL = "khushinema22@gmail.com";

export const submitMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const saved = await ContactMessage.create({ name, email, subject, message });

    sendMail({
      to: ADMIN_NOTIFY_EMAIL,
      subject: `[AgroFresh Contact] ${subject}`,
      replyTo: email,
      html: `
        <h2>New contact message from AgroFresh</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br/>")}</p>
        <hr/>
        <p style="color:#888;font-size:12px;">Submitted on ${new Date().toLocaleString()}</p>
      `,
    }).catch((err) => console.error("Notify mail failed:", err.message));

    res.status(201).json({
      message: "Message received. We'll get back to you soon.",
      id: saved._id,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error submitting message", error: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching messages", error: err.message });
  }
};

export const markMessageRead = async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true },
    );
    if (!msg) return res.status(404).json({ message: "Message not found" });
    res.json(msg);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating message", error: err.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ message: "Message not found" });
    res.json({ message: "Message deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting message", error: err.message });
  }
};
