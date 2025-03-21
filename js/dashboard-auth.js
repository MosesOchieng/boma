// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('councilToken');
    const councilMember = localStorage.getItem('councilMember');

    if (!token || !councilMember) {
        window.location.href = '/council-login.html';
        return false;
    }

    try {
        const member = JSON.parse(councilMember);
        document.getElementById('memberName').textContent = member.name;
        return true;
    } catch (error) {
        console.error('Auth error:', error);
        window.location.href = '/council-login.html';
        return false;
    }
}

// Add this to your dashboard HTML
document.addEventListener('DOMContentLoaded', checkAuth);

// Add this to your dashboard.html
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const token = localStorage.getItem('councilToken');
    const memberData = localStorage.getItem('councilMember');

    if (!token || !memberData) {
        window.location.href = '/council-login.html';
        return;
    }

    try {
        const member = JSON.parse(memberData);
        // Update UI with member info
        const nameElement = document.getElementById('memberName');
        if (nameElement) {
            nameElement.textContent = member.name;
        }
    } catch (error) {
        console.error('Auth error:', error);
        window.location.href = '/council-login.html';
    }
});

// Add logout function
function logout() {
    localStorage.removeItem('councilToken');
    localStorage.removeItem('councilMember');
    window.location.href = '/council-login.html';
} 