const Case = require('../models/Case');
const NotificationService = require('../services/NotificationService');

class CaseController {
    static async assignCase(req, res) {
        try {
            const { caseId } = req.params;
            const { councilMemberId } = req.body;

            const updatedCase = await Case.findByIdAndUpdate(caseId, {
                assignedTo: councilMemberId,
                status: 'assigned',
                updatedAt: new Date()
            }, { new: true });

            NotificationService.notifySpecificMember(councilMemberId, {
                type: 'case_assigned',
                data: updatedCase
            });

            res.json(updatedCase);
        } catch (error) {
            res.status(500).json({ error: 'Failed to assign case' });
        }
    }

    static async updateCaseStatus(req, res) {
        try {
            const { caseId } = req.params;
            const { status, notes } = req.body;

            const updatedCase = await Case.findByIdAndUpdate(caseId, {
                status,
                $push: { 
                    notes: {
                        text: notes,
                        authorId: req.councilMember._id,
                        createdAt: new Date()
                    }
                }
            }, { new: true });

            NotificationService.notifyCouncilMembers({
                type: 'case_updated',
                data: updatedCase
            });

            res.json(updatedCase);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update case' });
        }
    }

    static async getCaseHistory(req, res) {
        try {
            const { caseId } = req.params;
            const caseHistory = await Case.findById(caseId)
                .populate('notes.authorId', 'name')
                .populate('assignedTo', 'name');

            res.json(caseHistory);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch case history' });
        }
    }
}

module.exports = CaseController; 