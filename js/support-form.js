class SupportForm {
  constructor() {
    this.form = document.getElementById("anonymousForm");
    this.loadingModal = new bootstrap.Modal(
      document.getElementById("loadingModal"),
    );
    this.successModal = new bootstrap.Modal(
      document.getElementById("successModal"),
    );
    this.bindEvents();
  }

  bindEvents() {
    if (this.form) {
      this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    // Show loading modal
    this.loadingModal.show();

    // Generate a case ID
    const caseId =
      "BOMA-" + Math.random().toString(36).substr(2, 6).toUpperCase();

    // Get form data
    const formData = {
      caseId: caseId,
      name: this.form.querySelector('input[name="name"]').value,
      email: this.form.querySelector('input[name="email"]').value,
      feelingScale: this.form.querySelector('input[name="feelingScale"]').value,
      concern: this.form.querySelector('textarea[name="concern"]').value,
      supportType: this.form.querySelector('select[name="supportType"]').value,
      status: "pending",
      date: new Date().toISOString(),
    };

    // Simulate API delay
    setTimeout(() => {
      try {
        // Get existing cases or initialize empty array
        let cases = [];
        const existingCases = localStorage.getItem("cases");

        if (existingCases) {
          try {
            cases = JSON.parse(existingCases);
          } catch (e) {
            cases = [];
          }
        }

        // Add new case
        cases.push(formData);

        // Save to localStorage
        localStorage.setItem("cases", JSON.stringify(cases));

        // Hide loading modal
        this.loadingModal.hide();

        // Show success modal
        document.getElementById("successCaseId").textContent = caseId;
        this.successModal.show();

        // Reset form
        this.form.reset();
      } catch (error) {
        console.error("Error:", error);
        this.loadingModal.hide();
        this.showError("An error occurred. Please try again.");
      }
    }, 1500);
  }

  showError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "alert alert-danger mt-3";
    errorDiv.textContent = message;
    this.form.insertAdjacentElement("beforebegin", errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new SupportForm();
});
