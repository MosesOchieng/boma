class SubmissionForm {
    constructor() {
        this.form = document.getElementById('anonymousForm');
        this.modal = new bootstrap.Modal(document.getElementById('submissionModal'));
        this.loadingContent = document.getElementById('loadingContent');
        this.successContent = document.getElementById('successContent');
        this.setupValidation();
        this.setupEventListeners();
    }

    setupValidation() {
        this.form.addEventListener('input', (e) => {
            if (e.target.hasAttribute('required')) {
                this.validateField(e.target);
            }
        });
    }

    validateField(field) {
        const isValid = field.checkValidity();
        field.classList.toggle('is-invalid', !isValid);
        field.classList.toggle('is-valid', isValid);
        
        const feedback = field.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.style.display = isValid ? 'none' : 'block';
        }
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(event) {
        event.preventDefault();

        if (!this.form.checkValidity()) {
            event.stopPropagation();
            this.form.classList.add('was-validated');
            return;
        }

        this.modal.show();
        this.loadingContent.style.display = 'block';
        this.successContent.style.display = 'none';

        try {
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);

            const response = await fetch('/api/submit-anonymous', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.message);

            // Show success message
            setTimeout(() => {
                this.loadingContent.style.display = 'none';
                this.successContent.style.display = 'block';
                this.successContent.querySelector('.case-id').textContent = result.caseId;
                this.form.reset();
                this.form.classList.remove('was-validated');
            }, 1500);

        } catch (error) {
            console.error('Submission error:', error);
            this.loadingContent.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-circle text-danger"></i>
                    <h5>Submission Failed</h5>
                    <p>${error.message || 'Please try again later.'}</p>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
                </div>
            `;
        }
    }
}

// Initialize form
document.addEventListener('DOMContentLoaded', () => {
    new SubmissionForm();
}); 