class DashboardManager {
    constructor() {
        this.currentStaff = null;
        this.cases = [];
        this.initialize();
    }

    async initialize() {
        await this.loadStaffInfo();
        await this.loadCases();
        this.setupEventListeners();
        this.startAutoRefresh();
    }

    async loadStaffInfo() {
        try {
            const response = await fetch('/api/staff/current');
            this.currentStaff = await response.json();
            this.updateStaffUI();
        } catch (error) {
            console.error('Error loading staff info:', error);
        }
    }

    async loadCases() {
        try {
            const response = await fetch('/api/cases');
            this.cases = await response.json();
            this.updateCasesUI();
            this.updateStats();
        } catch (error) {
            console.error('Error loading cases:', error);
        }
    }

    updateCasesUI() {
        const tableBody = document.getElementById('casesTableBody');
        tableBody.innerHTML = this.cases.map(caseData => this.createCaseRow(caseData)).join('');
    }

    createCaseRow(caseData) {
        return `
            <tr>
                <td>${caseData.caseId}</td>
                <td>
                    <span class="status-badge status-${caseData.urgencyLevel}">
                        ${caseData.urgencyLevel}
                    </span>
                </td>
                <td>${caseData.primaryConcern}</td>
                <td>
                    <span class="status-badge status-${caseData.status}">
                        ${caseData.status}
                    </span>
                </td>
                <td>${this.formatDate(caseData.createdAt)}</td>
                <td>
                    <button class="btn btn-sm btn-primary" 
                            onclick="dashboard.viewCase('${caseData.caseId}')">
                        View
                    </button>
                </td>
            </tr>
        `;
    }

    async viewCase(caseId) {
        try {
            const response = await fetch(`/api/cases/${caseId}`);
            const caseData = await response.json();
            this.showCaseModal(caseData);
        } catch (error) {
            console.error('Error loading case details:', error);
        }
    }

    showCaseModal(caseData) {
        const modal = new bootstrap.Modal(document.getElementById('caseDetailModal'));
        const modalBody = document.querySelector('#caseDetailModal .modal-body');
        
        modalBody.innerHTML = this.createCaseDetailHTML(caseData);
        modal.show();
    }

    createCaseDetailHTML(caseData) {
        return `
            <div class="case-details">
                <div class="detail-section">
                    <h6>Case Information</h6>
                    <p><strong>Case ID:</strong> ${caseData.caseId}</p>
                    <p><strong>Primary Concern:</strong> ${caseData.primaryConcern}</p>
                    <p><strong>Urgency Level:</strong> ${caseData.urgencyLevel}</p>
                    <p><strong>Status:</strong> ${caseData.status}</p>
                </div>
                
                <div class="detail-section">
                    <h6>Description</h6>
                    <p>${caseData.description}</p>
                </div>

                <div class="detail-section">
                    <h6>Contact Preferences</h6>
                    <p><strong>Method:</strong> ${caseData.preferredContactMethod}</p>
                    <p><strong>Preferred Time:</strong> ${caseData.preferredTime}</p>
                </div>

                ${this.createCaseNotesSection(caseData)}
            </div>
        `;
    }

    createCaseNotesSection(caseData) {
        return `
            <div class="case-notes mt-4">
                <h6>Case Notes</h6>
                <div class="notes-list">
                    ${(caseData.notes || []).map(note => `
                        <div class="note-item">
                            <p class="note-text">${note.text}</p>
                            <small class="note-meta">
                                By ${note.staffName} on ${this.formatDate(note.createdAt)}
                            </small>
                        </div>
                    `).join('')}
                </div>
                <div class="add-note mt-3">
                    <textarea class="form-control" placeholder="Add a note..."></textarea>
                    <button class="btn btn-primary mt-2" onclick="dashboard.addNote('${caseData.caseId}')">
                        Add Note
                    </button>
                </div>
            </div>
        `;
    }

    async addNote(caseId) {
        const noteText = document.querySelector('.add-note textarea').value;
        if (!noteText.trim()) return;

        try {
            await fetch(`/api/cases/${caseId}/notes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: noteText })
            });

            await this.viewCase(caseId);
        } catch (error) {
            console.error('Error adding note:', error);
        }
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleString();
    }

    setupEventListeners() {
        document.getElementById('toggleAvailability').addEventListener('click', 
            this.toggleAvailability.bind(this));
    }

    async toggleAvailability() {
        const button = document.getElementById('toggleAvailability');
        const newStatus = button.classList.contains('btn-success') ? false : true;

        try {
            await fetch('/api/staff/availability', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isAvailable: newStatus })
            });

            button.classList.toggle('btn-success');
            button.classList.toggle('btn-danger');
            button.textContent = newStatus ? 'Available' : 'Unavailable';
        } catch (error) {
            console.error('Error updating availability:', error);
        }
    }

    startAutoRefresh() {
        setInterval(() => this.loadCases(), 30000); // Refresh every 30 seconds
    }
}

// Initialize dashboard
const dashboard = new DashboardManager(); 