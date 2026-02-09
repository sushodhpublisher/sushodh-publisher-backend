const nodemailer = require("nodemailer");

exports.sendContactMail = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_SMTP_EMAIL,
        pass: process.env.BREVO_SMTP_KEY,
      },
      logger: true,
      debug: true,
    });

    await transporter.verify();

    await transporter.sendMail({
      from: "Sushodh Publisher <contact@smtp-brevo.com>",
      to: "sushodhpublisher@gmail.com",
      replyTo: email,
      subject: `New Contact Message from ${name}`,
      html: `<p>${message}</p>`,
    });

    return res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("BREVO SMTP REAL ERROR");
    console.error(error); // FULL OBJECT

    return res.status(500).json({
      message: error.message || "SMTP failed",
    });
  }
};
