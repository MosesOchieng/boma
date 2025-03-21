class SupportForm {
    constructor() {
        this.form = document.getElementById('anonymousForm');
        this.loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
        this.successModal = new bootstrap.Modal(document.getElementById('successModal'));
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        try {
            // Show loading modal
            this.loadingModal.show();

            // Get form data
            const formData = {
                name: this.form.querySelector('[name="name"]').value,
                email: this.form.querySelector('[name="email"]').value,
                feelingScale: this.form.querySelector('[name="feelingScale"]').value,
                concern: this.form.querySelector('[name="concern"]').value,
                supportType: this.form.querySelector('[name="supportType"]').value,
                details: this.form.querySelector('[name="details"]').value,
                caseId: 'BOMA-' + Date.now().toString().slice(-6)
            };

            // Simulate API call (replace with actual API call in production)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Store in local storage for demo purposes
            const cases = JSON.parse(localStorage.getItem('cases') || '[]');
            cases.push({
                ...formData,
                status: 'pending',
                date: new Date().toISOString(),
                id: Date.now()
            });
            localStorage.setItem('cases', JSON.stringify(cases));

            // Hide loading modal
            this.loadingModal.hide();

            // Show success modal
            document.getElementById('successCaseId').textContent = formData.caseId;
            this.successModal.show();

            // Reset form
            this.form.reset();

        } catch (error) {
            console.error('Submission error:', error);
            this.loadingModal.hide();
            this.showError('An error occurred during submission. Please try again.');
        }
    }

    showError(message) {
        const errorAlert = document.createElement('div');
        errorAlert.className = 'alert alert-danger mt-3';
        errorAlert.textContent = message;
        this.form.insertAdjacentElement('beforebegin', errorAlert);
        setTimeout(() => errorAlert.remove(), 5000);
    }
}

// Initialize form
document.addEventListener('DOMContentLoaded', () => {
    new SupportForm();
}); 