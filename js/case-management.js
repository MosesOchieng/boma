class CaseManager {
    constructor() {
        this.setupWebSocket();
        this.initializeEventListeners();
    }

    setupWebSocket() {
        this.ws = new WebSocket(location.origin.replace(/^http/, 'ws'));
        
        this.ws.onopen = () => {
            // Send authentication
            const token = localStorage.getItem('councilToken');
            this.ws.send(JSON.stringify({ type: 'auth', token }));
        };

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            switch (data.type) {
                case 'newCase':
                    this.handleNewCase(data.case);
                    break;
                case 'caseUpdate':
                    this.updateCaseDisplay(data.case);
                    break;
                case 'urgentNotification':
                    this.showUrgentNotification(data.message);
                    break;
            }
        };
    }

    async handleCase(caseId, action) {
        try {
            const response = await fetch(`/api/cases/${caseId}/${action}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('councilToken')}`
                }
            });
            
            if (!response.ok) throw new Error('Action failed');
            
            const result = await response.json();
            this.updateCaseDisplay(result.case);
            this.showNotification(`Case ${action} successful`);
        } catch (error) {
            console.error(`Case ${action} error:`, error);
            this.showNotification(`Failed to ${action} case`, 'error');
        }
    }

    showCaseDetails(caseId) {
        const modal = new bootstrap.Modal(document.getElementById('caseDetailModal'));
        
        fetch(`/api/cases/${caseId}`)
            .then(response => response.json())
            .then(caseData => {
                document.getElementById('caseDetailContent').innerHTML = `
                    <div class="case-header">
                        <h5>Case ID: ${caseData.caseId}</h5>
                        <span class="badge ${this.getStatusBadgeClass(caseData.status)}">
                            ${caseData.status}
                        </span>
                    </div>
                    <div class="case-info">
                        <p><strong>Submitted:</strong> ${new Date(caseData.date).toLocaleString()}</p>
                        <p><strong>Email:</strong> ${caseData.email || 'Anonymous'}</p>
                        <p><strong>Feeling Scale:</strong> ${caseData.feelingScale}/5</p>
                        <p><strong>Concern:</strong> ${caseData.concern}</p>
                        <p><strong>Support Type:</strong> ${caseData.supportType}</p>
                    </div>
                    <div class="case-actions">
                        <button onclick="caseManager.handleCase('${caseId}', 'assign')" class="btn btn-primary">
                            Assign to Me
                        </button>
                        <button onclick="caseManager.handleCase('${caseId}', 'resolve')" class="btn btn-success">
                            Mark as Resolved
                        </button>
                    </div>
                `;
                modal.show();
            })
            .catch(error => {
                console.error('Error fetching case details:', error);
                this.showNotification('Failed to load case details', 'error');
            });
    }

    initializeEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.loadDashboard();
        });
    }
}

const caseManager = new CaseManager(); 