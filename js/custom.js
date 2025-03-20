document.addEventListener('DOMContentLoaded', function() {
    // Anonymous Form Handler
    const anonymousForms = document.querySelectorAll('.anonymous-form');
    
    anonymousForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Generate anonymous ID
            const anonymousId = 'anon_' + Math.random().toString(36).substr(2, 9);
            
            // Collect form data
            const formData = new FormData(this);
            formData.append('anonymousId', anonymousId);
            
            // Send to server (you'll need to implement the server endpoint)
            fetch('/submit-anonymous', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if(data.success) {
                    showNotification('Thank you for reaching out. We will contact you soon.');
                    form.reset();
                }
            })
            .catch(error => {
                showNotification('There was an error. Please try again.', 'error');
            });
        });
    });

    // Quick Assessment Tool
    const quickAssessment = document.getElementById('quickAssessment');
    if(quickAssessment) {
        quickAssessment.addEventListener('submit', function(e) {
            e.preventDefault();
            // Process assessment and show relevant resources
            processAssessment(this);
        });
    }

    // Search Functionality
    const searchBox = document.querySelector('.search-box input');
    if(searchBox) {
        searchBox.addEventListener('input', debounce(function(e) {
            searchResources(e.target.value);
        }, 300));
    }
});

// Utility Functions
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function processAssessment(form) {
    // Get form values
    const formData = new FormData(form);
    
    // Simple scoring system (you can make this more sophisticated)
    let score = 0;
    formData.forEach((value, key) => {
        if(key === 'stress_level') {
            score += parseInt(value);
        }
        // Add more scoring logic
    });
    
    // Show relevant resources based on score
    showRelevantResources(score);
}

function showRelevantResources(score) {
    // Logic to display different resources based on assessment score
    const resourcesContainer = document.querySelector('.recommended-resources');
    if(resourcesContainer) {
        // Update resources based on score
        // This is where you'd implement your resource recommendation logic
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function searchResources(query) {
    // Implement resource search functionality
    const resources = document.querySelectorAll('.resource-item');
    
    resources.forEach(resource => {
        const title = resource.querySelector('.title').textContent.toLowerCase();
        if(title.includes(query.toLowerCase())) {
            resource.style.display = 'flex';
        } else {
            resource.style.display = 'none';
        }
    });
} 