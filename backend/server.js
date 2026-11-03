const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
// Brevo transactional email API uses HTTPS.

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "http://127.0.0.1:5500",
      "http://localhost:5500",
      "https://techglowsolutionsindia.github.io",
    ],
    methods: ["POST"],
  }),
);

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));

const escapeHtml = (value = "") => {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

const sendBrevoEmail = async (emailData) => {
  if (!process.env.BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY is not configured.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const result = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify(emailData),
      signal: controller.signal,
    });

    if (!result.ok) {
      throw new Error(`Brevo API returned HTTP ${result.status}`);
    }
  } finally {
    clearTimeout(timeout);
  }
};

app.get("/", (request, response) => {
  response.send("EatHub contact server is running.");
});

app.post("/api/contact", async (request, response) => {
  try {
    const {
      name = "",
      phone = "",
      email = "",
      subject = "",
      message = "",
      website = "",
    } = request.body;

    // Honeypot spam protection
    if (website.trim()) {
      return response.status(200).json({
        success: true,
        message: "Message received successfully.",
      });
    }

    const cleanName = name.trim();
    const cleanPhone = phone.replace(/\D/g, "");
    const cleanEmail = email.trim().toLowerCase();
    const cleanSubject = subject.trim();
    const cleanMessage = message.trim();

    const namePattern =
      /^[A-Za-zÀ-ÿ\u0900-\u097F][A-Za-zÀ-ÿ\u0900-\u097F\s.'-]{1,59}$/;

    const phonePattern = /^[6-9]\d{9}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (
      !cleanName ||
      !cleanPhone ||
      !cleanEmail ||
      !cleanSubject ||
      !cleanMessage
    ) {
      return response.status(400).json({
        success: false,
        message: "Please complete all required fields.",
      });
    }

    if (!namePattern.test(cleanName)) {
      return response.status(400).json({
        success: false,
        message: "Please enter a valid name.",
      });
    }

    if (!phonePattern.test(cleanPhone)) {
      return response.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit mobile number.",
      });
    }

    if (!emailPattern.test(cleanEmail)) {
      return response.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (cleanMessage.length < 10 || cleanMessage.length > 1000) {
      return response.status(400).json({
        success: false,
        message: "Message must contain between 10 and 1000 characters.",
      });
    }

    const safeName = escapeHtml(cleanName);
    const safePhone = escapeHtml(cleanPhone);
    const safeEmail = escapeHtml(cleanEmail);
    const safeSubject = escapeHtml(cleanSubject);
    const safeMessage = escapeHtml(cleanMessage).replaceAll("\n", "<br>");

    await sendBrevoEmail({
      sender: {
        name: "EatHub Website",
        email: process.env.BREVO_SENDER_EMAIL,
      },

      to: [{ email: process.env.OWNER_EMAIL }],

      replyTo: { email: cleanEmail },

      subject: `EatHub Contact: ${cleanSubject}`,

      textContent: `
New EatHub Contact Enquiry

Name: ${cleanName}
Phone: ${cleanPhone}
Email: ${cleanEmail}
Subject: ${cleanSubject}

Message:
${cleanMessage}
      `,

      htmlContent: `
        <div
          style="
            max-width: 650px;
            margin: 0 auto;
            padding: 30px;
            background: #f6ffdf;
            font-family: Arial, sans-serif;
            color: #314438;
          "
        >
          <div
            style="
              overflow: hidden;
              border: 1px solid #dce8ce;
              border-radius: 18px;
              background: #ffffff;
            "
          >
            <div
              style="
                padding: 22px 25px;
                background: #004e36;
                color: #ffffff;
              "
            >
              <h2 style="margin: 0; font-size: 23px;">
                New EatHub Contact Enquiry
              </h2>

              <p
                style="
                  margin: 7px 0 0;
                  color: #dff5dd;
                  font-size: 14px;
                "
              >
                A customer submitted the website contact form.
              </p>
            </div>

            <div style="padding: 25px;">
              <table
                cellpadding="0"
                cellspacing="0"
                style="
                  width: 100%;
                  border-collapse: collapse;
                  font-size: 14px;
                "
              >
                <tr>
                  <td
                    style="
                      width: 110px;
                      padding: 10px;
                      border-bottom: 1px solid #edf0e8;
                      font-weight: bold;
                    "
                  >
                    Name
                  </td>

                  <td
                    style="
                      padding: 10px;
                      border-bottom: 1px solid #edf0e8;
                    "
                  >
                    ${safeName}
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      padding: 10px;
                      border-bottom: 1px solid #edf0e8;
                      font-weight: bold;
                    "
                  >
                    Phone
                  </td>

                  <td
                    style="
                      padding: 10px;
                      border-bottom: 1px solid #edf0e8;
                    "
                  >
                    <a
                      href="tel:+91${safePhone}"
                      style="color: #004e36;"
                    >
                      +91 ${safePhone}
                    </a>
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      padding: 10px;
                      border-bottom: 1px solid #edf0e8;
                      font-weight: bold;
                    "
                  >
                    Email
                  </td>

                  <td
                    style="
                      padding: 10px;
                      border-bottom: 1px solid #edf0e8;
                    "
                  >
                    <a
                      href="mailto:${safeEmail}"
                      style="color: #004e36;"
                    >
                      ${safeEmail}
                    </a>
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      padding: 10px;
                      border-bottom: 1px solid #edf0e8;
                      font-weight: bold;
                    "
                  >
                    Subject
                  </td>

                  <td
                    style="
                      padding: 10px;
                      border-bottom: 1px solid #edf0e8;
                    "
                  >
                    ${safeSubject}
                  </td>
                </tr>
              </table>

              <div
                style="
                  margin-top: 20px;
                  padding: 18px;
                  border-left: 4px solid #ffcc00;
                  border-radius: 9px;
                  background: #f8fbe7;
                  line-height: 1.7;
                "
              >
                <strong style="display: block; margin-bottom: 8px;">
                  Customer Message
                </strong>

                ${safeMessage}
              </div>

              <p
                style="
                  margin: 22px 0 0;
                  color: #6e7f70;
                  font-size: 12px;
                "
              >
                Reply directly to this email to respond to the customer.
              </p>
            </div>
          </div>
        </div>
      `,
    });

    // Customer Confirmation Email Started
    try {
      await sendBrevoEmail({
        sender: {
          name: "EatHub Bites",
          email: process.env.BREVO_SENDER_EMAIL,
        },

        to: [
          {
            email: cleanEmail,
            name: cleanName,
          },
        ],

        subject: `Thank You for Contacting EatHub Bites - ${cleanSubject}`,

        textContent: `
Dear ${cleanName},

Thank you for contacting EatHub Bites!

We have successfully received your enquiry regarding ${cleanSubject}.

Your Message:
${cleanMessage}

Our team will review your enquiry and get back to you as soon as possible.

Best regards,
EatHub Bites Team

This is an automated confirmation email. Please do not reply.
        `,

        htmlContent: `
          <div style="max-width:650px;margin:0 auto;padding:30px;background:#f6ffdf;font-family:Arial,sans-serif;color:#314438;">
            <div style="overflow:hidden;border:1px solid #dce8ce;border-radius:18px;background:#ffffff;">

              <div style="padding:22px 25px;background:#004e36;color:#ffffff;">
                <h2 style="margin:0;font-size:23px;">
                  Thank You for Contacting EatHub Bites!
                </h2>
                <p style="margin:7px 0 0;color:#dff5dd;font-size:14px;">
                  Your enquiry has been received successfully.
                </p>
              </div>

              <div style="padding:25px;">
                <p>Dear ${safeName},</p>

                <p style="line-height:1.7;">
                  Thank you for reaching out to EatHub Bites!
                  We have received your enquiry and our team
                  will get back to you as soon as possible.
                </p>

                <h3 style="margin-top:25px;color:#004e36;">
                  Your Enquiry Details
                </h3>

                <table cellpadding="0" cellspacing="0"
                  style="width:100%;border-collapse:collapse;font-size:14px;">
                  <tr>
                    <td style="padding:12px;border-bottom:1px solid #edf0e8;font-weight:bold;">
                      Name
                    </td>
                    <td style="padding:12px;border-bottom:1px solid #edf0e8;">
                      ${safeName}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:12px;border-bottom:1px solid #edf0e8;font-weight:bold;">
                      Subject
                    </td>
                    <td style="padding:12px;border-bottom:1px solid #edf0e8;">
                      ${safeSubject}
                    </td>
                  </tr>
                </table>

                <div style="margin-top:20px;padding:18px;border-left:4px solid #ffcc00;border-radius:9px;background:#f8fbe7;line-height:1.7;overflow-wrap:anywhere;">
                  <strong style="display:block;margin-bottom:8px;">
                    Your Message
                  </strong>
                  ${safeMessage}
                </div>

                <p style="margin-top:22px;line-height:1.7;">
                  We appreciate your interest and look forward
                  to assisting you.
                </p>

                <p style="line-height:1.7;">
                  Best regards,<br>
                  <strong style="color:#004e36;">EatHub Bites Team</strong>
                </p>

                <p style="margin-top:25px;padding-top:15px;border-top:1px solid #edf0e8;color:#6e7f70;font-size:12px;">
                  This is an automated confirmation email.
                  Please do not reply directly to this message.
                </p>
              </div>
            </div>
          </div>
        `,
      });

      console.log("Customer confirmation email accepted by Brevo.");
    } catch (confirmationError) {
      console.error("Customer confirmation email failed:", confirmationError);
    }
    // Customer Confirmation Email Ended

    return response.status(200).json({
      success: true,
      message: "Your message has been sent successfully.",
    });
  } catch (error) {
    console.error("Contact email error:", error);

    return response.status(500).json({
      success: false,
      message:
        "We could not send your message right now. Please try again later.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`EatHub server running on port ${PORT}`);
});
