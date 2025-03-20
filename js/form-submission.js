document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');  // Use your existing form
    const submissionModal = new bootstrap.Modal(document.getElementById('submissionModal'));
    
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Show modal with loading state
            submissionModal.show();
            document.getElementById('loadingContent').style.display = 'block';
            document.getElementById('successContent').style.display = 'none';

            // Show success message after 2 seconds
            setTimeout(() => {
                document.getElementById('loadingContent').style.display = 'none';
                document.getElementById('successContent').style.display = 'block';
            }, 2000);

            // Optional: Reset form
            form.reset();
        });
    }
}); 