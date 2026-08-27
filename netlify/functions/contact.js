// netlify/functions/contact.js
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ message: "Method not allowed" }) };
  }

  try {
    const { name, email, phone, details } = JSON.parse(event.body);

    if (!name || !email || !details) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Name, email, and details are required." }),
      };
    }

    await resend.emails.send({
      from: "ARGIE.dev Contact <onboarding@resend.dev>", // swap once you verify your own domain in Resend
      to: "argiepbeloa@gmail.com",
      reply_to: email,
      subject: `New portfolio message from ${name}`,
      html: `
        <h2>New contact form submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "—"}</p>
        <p><strong>Details:</strong></p>
        <p>${String(details).replace(/\n/g, "<br/>")}</p>
      `,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Message sent." }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to send message." }),
    };
  }
};