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
    const button = document.getElementById('loginButton');
    const errorMessage = document.getElementById('errorMessage');
    
    try {
        button.classList.add('loading');
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        const response = await fetch('/api/council/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const result = await response.json();
        if (result.success) {
            window.location.href = '/council/dashboard';
        } else {
            throw new Error(result.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        errorMessage.textContent = error.message || 'An error occurred. Please try again.';
        errorMessage.classList.add('show');
    } finally {
        button.classList.remove('loading');
    }

    return false;
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