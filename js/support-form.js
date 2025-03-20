class SupportForm {
    constructor() {
        this.form = document.getElementById('anonymousSupportForm');
        this.loadingModal = new bootstrap.Modal(document.getElementById('submissionLoadingModal'));
        this.successModal = new bootstrap.Modal(document.getElementById('submissionSuccessModal'));
        this.initializeForm();
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.form.checkValidity()) {
            e.stopPropagation();
            this.form.classList.add('was-validated');
            return;
        }

        // Show loading modal
        this.loadingModal.show();

        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await this.submitForm(data);
            
            // Hide loading modal
            this.loadingModal.hide();

            if (response.success) {
                // Show success modal with case ID
                document.getElementById('caseIdDisplay').textContent = response.caseId;
                this.successModal.show();
                this.form.reset();
            } else {
                this.showErrorMessage();
            }
        } catch (error) {
            this.loadingModal.hide();
            this.showErrorMessage();
            console.error('Submission error:', error);
        }
    }

    // ... rest of the class implementation
} 