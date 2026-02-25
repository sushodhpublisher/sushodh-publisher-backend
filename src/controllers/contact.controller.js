const axios = require("axios");

exports.sendContactMail = async (req, res) => {
  console.log("CONTACT CONTROLLER VERSION 2");
  console.log("BREVO KEY:", process.env.BREVO_API_KEY);
  console.log("BREVO KEY VALUE:", process.env.BREVO_API_KEY);
  console.log("BREVO KEY LENGTH:", process.env.BREVO_API_KEY?.length);

  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Sushodh Publisher",
          email: "sushodhpublisher@gmail.com",
        },
        to: [{ email: "sushodhpublisher@gmail.com" }],
        replyTo: { email },
        subject: `New Contact Message from ${name}`,
        htmlContent: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    return res.status(200).json({
      message: "Message sent successfully!",
    });
  } catch (error) {
    console.error("BREVO API STATUS:", error.response?.status);
    console.error("BREVO API DATA:", error.response?.data);
    console.error("BREVO API MESSAGE:", error.message);
    return res.status(500).json({
      message: error.response?.data?.message || "Failed to send message",
    });
  }
};
