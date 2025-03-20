class CouncilDashboard {
    constructor() {
        this.currentUser = null;
        this.cases = [];
        this.websocket = null;
        this.initialize();
    }

    async initialize() {
        await this.checkAuth();
        this.initializeWebSocket();
        this.loadDashboardData();
        this.setupEventListeners();
    }

    async checkAuth() {
        try {
            const response = await fetch('/api/council/auth/check');
            if (!response.ok) {
                window.location.href = '/council/login';
                return;
            }
            this.currentUser = await response.json();
            this.updateUserInterface();
        } catch (error) {
            console.error('Auth check failed:', error);
            window.location.href = '/council/login';
        }
    }

    initializeWebSocket() {
        this.websocket = new WebSocket(`ws://${window.location.host}/ws/council`);
        
        this.websocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleWebSocketMessage(data);
        };

        this.websocket.onclose = () => {
            setTimeout(() => this.initializeWebSocket(), 3000); // Reconnect after 3 seconds
        };
    }

    handleWebSocketMessage(data) {
        switch(data.type) {
            case 'new_case':
                this.handleNewCase(data.case);
                break;
            case 'case_update':
                this.updateCaseInTable(data.case);
                break;
            case 'urgent_notification':
                this.showUrgentNotification(data);
                break;
        }
    }

    async loadDashboardData() {
        try {
            const [casesResponse, statsResponse] = await Promise.all([
                fetch('/api/council/cases'),
                fetch('/api/council/stats')
            ]);

            this.cases = await casesResponse.json();
            const stats = await statsResponse.json();

            this.updateDashboardStats(stats);
            this.updateCasesTable();
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showError('Failed to load dashboard data');
        }
    }

    updateDashboardStats(stats) {
        document.getElementById('newCasesCount').textContent = stats.newCases;
        document.getElementById('urgentCasesCount').textContent = stats.urgentCases;
        document.getElementById('activeCasesCount').textContent = stats.activeCases;
    }

    updateCasesTable() {
        const tableBody = document.getElementById('casesTableBody');
        tableBody.innerHTML = this.cases
            .map(caseData => this.createCaseTableRow(caseData))
            .join('');
    }

    createCaseTableRow(caseData) {
        return `
            <tr data-case-id="${caseData.caseId}">
                <td>${caseData.caseId}</td>
                <td>${this.formatDate(caseData.createdAt)}</td>
                <td>
                    <span class="badge bg-${this.getPriorityColor(caseData.urgencyLevel)}">
                        ${caseData.urgencyLevel}
                    </span>
                </td>
                <td>
                    <span class="badge bg-${this.getStatusColor(caseData.status)}">
                        ${caseData.status}
                    </span>
                </td>
                <td>${caseData.preferredContactMethod}</td>
                <td>
                    <button class="btn btn-sm btn-primary view-case" 
                            onclick="dashboard.viewCase('${caseData.caseId}')">
                        View
                    </button>
                    ${this.getActionButtons(caseData)}
                </td>
            </tr>
        `;
    }

    getActionButtons(caseData) {
        let buttons = '';
        
        if (caseData.status === 'pending') {
            buttons += `
                <button class="btn btn-sm btn-success take-case" 
                        onclick="dashboard.takeCase('${caseData.caseId}')">
                    Take Case
                </button>
            `;
        }
        
        if (caseData.assignedTo === this.currentUser.id) {
            buttons += `
                <button class="btn btn-sm btn-info update-case" 
                        onclick="dashboard.updateCase('${caseData.caseId}')">
                    Update
                </button>
            `;
        }

        return buttons;
    }

    async viewCase(caseId) {
        try {
            const response = await fetch(`/api/council/cases/${caseId}`);
            const caseData = await response.json();
            this.showCaseModal(caseData);
        } catch (error) {
            console.error('Error loading case details:', error);
            this.showError('Failed to load case details');
        }
    }

    showCaseModal(caseData) {
        const modal = new bootstrap.Modal(document.getElementById('caseDetailModal'));
        const modalBody = document.querySelector('#caseDetailModal .modal-body');
        
        modalBody.innerHTML = `
            <div class="case-details">
                <div class="alert alert-${this.getPriorityColor(caseData.urgencyLevel)} mb-4">
                    ${this.getUrgencyMessage(caseData.urgencyLevel)}
                </div>

                <h6>Case Information</h6>
                <div class="info-grid">
                    <div class="info-item">
                        <label>Case ID:</label>
                        <span>${caseData.caseId}</span>
                    </div>
                    <div class="info-item">
                        <label>Submitted:</label>
                        <span>${this.formatDate(caseData.createdAt)}</span>
                    </div>
                    <div class="info-item">
                        <label>Status:</label>
                        <span class="badge bg-${this.getStatusColor(caseData.status)}">
                            ${caseData.status}
                        </span>
                    </div>
                </div>

                <h6 class="mt-4">Student's Concerns</h6>
                <div class="concern-details">
                    <p>${caseData.description}</p>
                    <div class="tags">
                        ${this.createConcernTags(caseData.primaryConcern, caseData.symptoms)}
                    </div>
                </div>

                <h6 class="mt-4">Contact Information</h6>
                <div class="contact-info">
                    <p><strong>Preferred Method:</strong> ${caseData.preferredContactMethod}</p>
                    <p><strong>Preferred Time:</strong> ${caseData.preferredTime}</p>
                    ${this.getContactDetails(caseData)}
                </div>

                <div class="case-notes mt-4">
                    <h6>Case Notes</h6>
                    ${this.createCaseNotes(caseData.notes)}
                    <div class="add-note mt-3">
                        <textarea class="form-control" id="newNote" 
                                placeholder="Add a note..."></textarea>
                        <button class="btn btn-primary mt-2" 
                                onclick="dashboard.addNote('${caseData.caseId}')">
                            Add Note
                        </button>
                    </div>
                </div>
            </div>
        `;

        modal.show();
    }

    async takeCase(caseId) {
        try {
            const response = await fetch(`/api/council/cases/${caseId}/assign`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    councilMemberId: this.currentUser.id
                })
            });

            if (response.ok) {
                this.showSuccess('Case assigned to you successfully');
                await this.loadDashboardData();
            } else {
                throw new Error('Failed to assign case');
            }
        } catch (error) {
            console.error('Error assigning case:', error);
            this.showError('Failed to assign case');
        }
    }

    async addNote(caseId) {
        const noteText = document.getElementById('newNote').value.trim();
        if (!noteText) return;

        try {
            const response = await fetch(`/api/council/cases/${caseId}/notes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: noteText,
                    authorId: this.currentUser.id
                })
            });

            if (response.ok) {
                document.getElementById('newNote').value = '';
                await this.viewCase(caseId); // Refresh case details
                this.showSuccess('Note added successfully');
            } else {
                throw new Error('Failed to add note');
            }
        } catch (error) {
            console.error('Error adding note:', error);
            this.showError('Failed to add note');
        }
    }

    // Utility Methods
    formatDate(dateString) {
        return new Date(dateString).toLocaleString();
    }

    getPriorityColor(urgencyLevel) {
        const colors = {
            immediate: 'danger',
            urgent: 'warning',
            normal: 'info',
            consultation: 'secondary'
        };
        return colors[urgencyLevel] || 'secondary';
    }

    getStatusColor(status) {
        const colors = {
            pending: 'warning',
            assigned: 'info',
            in_progress: 'primary',
            resolved: 'success',
            closed: 'secondary'
        };
        return colors[status] || 'secondary';
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'danger');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} notification`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize dashboard
const dashboard = new CouncilDashboard(); 