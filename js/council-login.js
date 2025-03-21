document.addEventListener('DOMContentLoaded', function() {
    // Password visibility toggle
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('password');

    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', () => {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            passwordToggle.classList.toggle('fa-eye');
            passwordToggle.classList.toggle('fa-eye-slash');
        });
    }

    // Form validation
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const button = document.querySelector('button[type="submit"]');
    
    try {
        button.disabled = true;
        button.innerHTML = 'Logging in...';
        
        const response = await fetch('/api/council/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('councilToken', data.token);
            localStorage.setItem('councilMember', JSON.stringify(data.councilMember));
            window.location.href = '/council/dashboard';
        } else {
            throw new Error(data.message || 'Login failed');
        }
    } catch (error) {
        showError(error.message);
    } finally {
        button.disabled = false;
        button.innerHTML = 'Sign In';
    }
}

function showError(message) {
    const errorDiv = document.getElementById('loginError');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

// Error handling for network issues
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
        errorMessage.textContent = 'Network error. Please check your connection.';
        errorMessage.classList.add('show');
    }
});

// Add this function
function logout() {
    localStorage.removeItem('councilToken');
    localStorage.removeItem('councilMember');
    window.location.href = '/council-login.html';
} 