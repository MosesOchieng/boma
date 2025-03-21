// Function to fetch cases from the database
async function fetchCases() {
    try {
        const response = await fetch('/api/cases');
        if (!response.ok) {
            throw new Error('Failed to fetch cases');
        }
        const cases = await response.json();
        displayCases(cases);
        updateDashboardStats(cases);
    } catch (error) {
        console.error('Error fetching cases:', error);
        showErrorMessage('Failed to load cases. Please refresh the page.');
    }
}

// Function to display cases in the dashboard table
function displayCases(cases) {
    const tableBody = document.getElementById('casesTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = cases.map(caseItem => `
        <tr>
            <td>${caseItem.caseId}</td>
            <td>
                <span class="badge ${caseItem.supportType === 'immediate' ? 'bg-danger' : 'bg-warning'}">
                    ${caseItem.supportType === 'immediate' ? 'Urgent' : 'Regular'}
                </span>
            </td>
            <td>${caseItem.status}</td>
            <td>${caseItem.email || 'Anonymous'}</td>
            <td>${new Date(caseItem.date).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewCase('${caseItem.caseId}')">
                    View Details
                </button>
            </td>
        </tr>
    `).join('');
}

// Function to update dashboard statistics
function updateDashboardStats(cases) {
    const stats = {
        total: cases.length,
        urgent: cases.filter(c => c.supportType === 'immediate').length,
        active: cases.filter(c => c.status === 'active').length
    };

    document.getElementById('totalCases').textContent = stats.total;
    document.getElementById('urgentCases').textContent = stats.urgent;
    document.getElementById('activeCases').textContent = stats.active;
}

// Add this to your form submission handler
async function handleFormSubmission(formData) {
    try {
        const response = await fetch('/api/submit-anonymous', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Submission failed');
        }

        const result = await response.json();
        console.log('Case submitted successfully:', result);
        return result;

    } catch (error) {
        console.error('Submission error:', error);
        throw error;
    }
}

// Add this to verify database connection
async function checkDatabaseConnection() {
    try {
        const response = await fetch('/api/health-check');
        const result = await response.json();
        console.log('Database status:', result.status);
        return result.status === 'connected';
    } catch (error) {
        console.error('Database connection error:', error);
        return false;
    }
}

// Call this when the dashboard loads
document.addEventListener('DOMContentLoaded', function() {
    fetchCases();
    checkDatabaseConnection();
}); 