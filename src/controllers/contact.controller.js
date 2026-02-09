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
    });

    await transporter.sendMail({
      from: "Sushodh Publisher <no-reply@smtp-brevo.com>",
      to: "sushodhpublisher@gmail.com",
      replyTo: email,
      subject: `New Contact Message from ${name}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return res.status(200).json({
      message: "Message sent successfully!",
    });
  } catch (error) {
    console.error("Brevo Mail Error:", error);
    return res.status(500).json({
      message: "Failed to send message",
    });
  }
};
