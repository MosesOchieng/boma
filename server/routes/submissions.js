const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com", // Replace with your email
    pass: "your-app-password", // Replace with your app password
  },
});

// MongoDB Schema for submissions
const SubmissionSchema = new mongoose.Schema({
  caseId: {
    type: String,
    unique: true,
    required: true,
  },
  email: String,
  feelingScale: Number,
  concern: String,
  supportType: String,
  status: {
    type: String,
    default: "new",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Submission = mongoose.model("Submission", SubmissionSchema);

// Handle form submissions
router.post("/api/submit-anonymous", async (req, res) => {
  try {
    const caseId = "CASE-" + Date.now();

    // Create new submission
    const submission = new Submission({
      caseId,
      ...req.body,
      status: req.body.supportType === "immediate" ? "urgent" : "new",
    });

    // Save to database
    await submission.save();

    // Send email notification to council members
    const mailOptions = {
      from: "your-email@gmail.com",
      to: ["alex.odhiambo@bihc.com", "lynnngungi@gmail.com"],
      subject: `New ${submission.supportType === "immediate" ? "URGENT" : ""} Support Request - ${caseId}`,
      html: `
                <h2>New Support Request</h2>
                <p><strong>Case ID:</strong> ${caseId}</p>
                <p><strong>Type:</strong> ${submission.supportType}</p>
                <p><strong>Feeling Scale:</strong> ${submission.feelingScale}/5</p>
                <p><strong>Concern:</strong> ${submission.concern}</p>
                <p><strong>Contact:</strong> ${submission.email || "Anonymous"}</p>
                <p><a href="https://your-domain.com/council/dashboard">View in Dashboard</a></p>
            `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Submission received",
      caseId,
    });
  } catch (error) {
    console.error("Submission error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during submission",
    });
  }
});

module.exports = router;
