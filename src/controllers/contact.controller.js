const nodemailer = require("nodemailer");

console.log("CONTACT ENV:", {
  email: process.env.CONTACT_EMAIL,
  pass: process.env.CONTACT_EMAIL_PASS ? "SET" : "MISSING",
});

exports.sendContactMail = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    /* ================= VALIDATION ================= */
    if (!name || !email || !message) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    /* ================= TRANSPORTER ================= */
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.CONTACT_EMAIL,
        pass: process.env.CONTACT_EMAIL_PASS,
      },
      connectionTimeout: 10000,
    });

    /* ================= MAIL ================= */
    const mailOptions = {
      from: `"Website Contact" <${process.env.CONTACT_EMAIL}>`,
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
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: "Message sent successfully!",
    });
  } catch (error) {
    console.error("Contact Mail Error:", error?.message || error);

    return res.status(500).json({
      message: "Failed to send message",
    });
  }
};
