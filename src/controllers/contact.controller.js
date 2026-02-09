const nodemailer = require("nodemailer");

exports.sendContactMail = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    /* ================= VALIDATION ================= */
    if (!name || !email || !message) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    console.log({
      name,
      email,
      message,
      receivedAt: new Date().toISOString(),
    });

    return res.status(200).json({
      message: "Message received successfully",
    });
  } catch (error) {
    console.error("Contact Controller Error:", error);

    return res.status(500).json({
      message: "Failed to send message",
    });
  }
};
