document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('anonymousForm');
    const submissionModal = new bootstrap.Modal(document.getElementById('submissionModal'));
    
    if (form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            // Show modal with loading state
            submissionModal.show();
            document.getElementById('loadingContent').style.display = 'block';
            document.getElementById('successContent').style.display = 'none';

            try {
                const formData = new FormData(form);
                const data = {
                    caseId: 'CASE-' + Date.now(),
                    name: 'Anonymous',
                    email: formData.get('email') || 'Anonymous',
                    feelingScale: formData.get('feelingScale'),
                    concern: formData.get('concern'),
                    supportType: formData.get('supportType'),
                    status: formData.get('supportType') === 'immediate' ? 'urgent' : 'active',
                    date: new Date().toISOString().split('T')[0]
                };

                // Send to server
                const response = await fetch('/api/submit-anonymous', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    throw new Error('Submission failed');
                }

                // Show success message after 1.5 seconds
                setTimeout(() => {
                    document.getElementById('loadingContent').style.display = 'none';
                    document.getElementById('successContent').style.display = 'block';
                }, 1500);

                // Reset form
                form.reset();

            } catch (error) {
                console.error('Submission error:', error);
                // Handle error state
                document.getElementById('loadingContent').innerHTML = `
                    <i class="fas fa-exclamation-circle text-danger" style="font-size: 3rem;"></i>
                    <h5 class="mt-3">Submission Failed</h5>
                    <p>Please try again later.</p>
                    <button type="button" class="btn btn-primary mt-3" data-bs-dismiss="modal">Close</button>
                `;
            }
        });
    }
}); 