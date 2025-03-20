const nodemailer = require('nodemailer');
const twilio = require('twilio');
const Staff = require('../models/Staff');
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

class NotificationService {
    constructor(server) {
        this.emailTransporter = nodemailer.createTransport({
            // Configure your email service
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        this.smsClient = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );

        this.wss = new WebSocket.Server({ server });
        this.clients = new Map(); // Map to store client connections
        this.initialize();
    }

    initialize() {
        this.wss.on('connection', (ws, req) => {
            this.handleConnection(ws, req);
        });
    }

    handleConnection(ws, req) {
        // Authenticate connection
        const token = this.getTokenFromUrl(req.url);
        if (!token) {
            ws.close();
            return;
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            this.clients.set(decoded._id, ws);

            ws.on('close', () => {
                this.clients.delete(decoded._id);
            });

        } catch (error) {
            ws.close();
        }
    }

    notifyCouncilMembers(data) {
        this.clients.forEach((ws, councilMemberId) => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(data));
            }
        });
    }

    notifySpecificMember(councilMemberId, data) {
        const ws = this.clients.get(councilMemberId);
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(data));
        }
    }

    notifyUrgentCase(caseData) {
        const notification = {
            type: 'urgent_case',
            data: caseData,
            timestamp: new Date()
        };
        this.notifyCouncilMembers(notification);
    }

    getTokenFromUrl(url) {
        const params = new URLSearchParams(url.split('?')[1]);
        return params.get('token');
    }

    async notifyStaff(caseData) {
        const availableStaff = await Staff.find({ 
            isAvailable: true,
            specializations: { $in: [caseData.primaryConcern] }
        });

        const notifications = availableStaff.map(staff => {
            return Promise.all([
                this.sendEmail(staff, caseData),
                this.sendSMS(staff, caseData)
            ]);
        });

        return Promise.all(notifications);
    }

    async sendEmail(staff, caseData) {
        const emailContent = this.createEmailContent(caseData);
        
        return this.emailTransporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: staff.email,
            subject: `New Case Alert: ${caseData.urgencyLevel.toUpperCase()}`,
            html: emailContent
        });
    }

    async sendSMS(staff, caseData) {
        if (!staff.phone || caseData.urgencyLevel !== 'immediate') return;

        const message = this.createSMSContent(caseData);
        
        return this.smsClient.messages.create({
            body: message,
            to: staff.phone,
            from: process.env.TWILIO_PHONE_NUMBER
        });
    }

    createEmailContent(caseData) {
        return `
            <h2>New Support Case: ${caseData.caseId}</h2>
            <p><strong>Urgency:</strong> ${caseData.urgencyLevel}</p>
            <p><strong>Primary Concern:</strong> ${caseData.primaryConcern}</p>
            <p><strong>Status:</strong> ${caseData.status}</p>
            <a href="${process.env.DASHBOARD_URL}/cases/${caseData.caseId}" 
               style="padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">
               View Case
            </a>
        `;
    }

    createSMSContent(caseData) {
        return `URGENT: New case ${caseData.caseId} requires immediate attention. 
                Primary concern: ${caseData.primaryConcern}. 
                Check dashboard for details.`;
    }
}

module.exports = NotificationService; 