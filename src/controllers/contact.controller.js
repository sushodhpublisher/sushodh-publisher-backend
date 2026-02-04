const nodemailer = require("nodemailer");

exports.sendContactMail = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    /* ================= MAIL CONFIG ================= */
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.CONTACT_EMAIL, // your email
        pass: process.env.CONTACT_EMAIL_PASS, // app password
      },
    });

    /* ================= MAIL CONTENT ================= */
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

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Contact Mail Error:");
    console.error(error);
    console.error(error?.response || "");
    console.error(error?.message || "");
    res.status(500).json({ message: "Failed to send message" });
  }
};
