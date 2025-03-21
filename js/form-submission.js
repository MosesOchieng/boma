document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('anonymousForm');
    const submissionModal = new bootstrap.Modal(document.getElementById('submissionModal'));
    
    if (form) {
        form.addEventListener('submit', handleSubmission);
    }

    async function handleSubmission(event) {
        event.preventDefault();
        
        // Show modal with loading state
        submissionModal.show();
        document.getElementById('loadingContent').style.display = 'block';
        document.getElementById('successContent').style.display = 'none';

        try {
            const formData = new FormData(form);
            const data = {
                caseId: 'CASE-' + Date.now(),
                email: formData.get('email') || 'Anonymous',
                feelingScale: formData.get('feelingScale'),
                concern: formData.get('concern'),
                supportType: formData.get('supportType'),
                date: new Date().toISOString(),
                status: formData.get('supportType') === 'immediate' ? 'urgent' : 'active'
            };

            // Store in localStorage (temporary solution)
            let cases = JSON.parse(localStorage.getItem('cases') || '[]');
            cases.push(data);
            localStorage.setItem('cases', JSON.stringify(cases));

            // Simulate server delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            document.getElementById('loadingContent').style.display = 'none';
            document.getElementById('successContent').style.display = 'block';

            // Reset form
            form.reset();

        } catch (error) {
            console.error('Submission error:', error);
            document.getElementById('loadingContent').innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-circle text-danger"></i>
                    <h5>Submission Failed</h5>
                    <p>Please try again later.</p>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
                </div>
            `;
        }
    }
}); 