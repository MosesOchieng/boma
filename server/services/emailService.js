const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    async sendCouncilNotification(caseData) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'alex.odhiambo@bihc.com, lynnngungi@gmail.com',
            subject: `New Urgent Case: ${caseData.caseId}`,
            html: `
                <h2>New Case Requires Attention</h2>
                <p><strong>Case ID:</strong> ${caseData.caseId}</p>
                <p><strong>Support Type:</strong> ${caseData.supportType}</p>
                <p><strong>Concern:</strong> ${caseData.concern}</p>
                <p><strong>Email:</strong> ${caseData.email || 'Anonymous'}</p>
                <p><a href="${process.env.DASHBOARD_URL}/cases/${caseData.caseId}">View Case</a></p>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('Council notification email sent');
        } catch (error) {
            console.error('Email sending failed:', error);
        }
    }
}

module.exports = new EmailService(); 