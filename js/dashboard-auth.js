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