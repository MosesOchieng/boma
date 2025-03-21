import { formConfig } from "./config/form-config.js";

class SupportForm {
  constructor() {
    this.init();
  }

  init() {
    this.form = document.getElementById("anonymousForm");
    if (!this.form) {
      console.error("Anonymous form not found");
      return;
    }

    this.loadingModal = new bootstrap.Modal(
      document.getElementById("loadingModal"),
    );
    this.successModal = new bootstrap.Modal(
      document.getElementById("successModal"),
    );

    this.form.addEventListener("submit", this.handleSubmit.bind(this));
  }

  generateCaseId() {
    return `${formConfig.caseIdPrefix}${Date.now().toString(36).toUpperCase()}`;
  }

  getFormData() {
    return {
      caseId: this.generateCaseId(),
      name: this.form.querySelector('input[name="name"]').value,
      email: this.form.querySelector('input[name="email"]').value,
      feelingScale: this.form.querySelector('input[name="feelingScale"]').value,
      concern: this.form.querySelector('textarea[name="concern"]').value,
      supportType: this.form.querySelector('select[name="supportType"]').value,
      status: "pending",
      date: new Date().toISOString(),
    };
  }

  handleSubmit(e) {
    e.preventDefault();

    try {
      this.loadingModal.show();
      const formData = this.getFormData();

      // Simulate API call
      setTimeout(() => {
        this.saveCase(formData);
        this.loadingModal.hide();
        this.showSuccess(formData.caseId);
        this.form.reset();
      }, formConfig.modalDelay);
    } catch (error) {
      console.error("Submission error:", error);
      this.loadingModal.hide();
      this.showError("An error occurred. Please try again.");
    }
  }

  saveCase(formData) {
    try {
      const existingCases = localStorage.getItem(formConfig.storageKey);
      const cases = existingCases ? JSON.parse(existingCases) : [];
      cases.push(formData);
      localStorage.setItem(formConfig.storageKey, JSON.stringify(cases));
    } catch (error) {
      console.error("Storage error:", error);
      throw new Error("Failed to save case");
    }
  }

  showSuccess(caseId) {
    const successCaseId = document.getElementById("successCaseId");
    if (successCaseId) {
      successCaseId.textContent = caseId;
    }
    this.successModal.show();
  }

  showError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "alert alert-danger mt-3";
    errorDiv.textContent = message;
    this.form.insertAdjacentElement("beforebegin", errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
  }
}

// Initialize form
const form = new SupportForm();
