document.addEventListener("DOMContentLoaded", function () {
  // First, verify all elements exist
  const elements = {
    form: document.getElementById("anonymousForm"),
    loadingModal: document.getElementById("loadingModal"),
    successModal: document.getElementById("successModal"),
    successCaseId: document.getElementById("successCaseId"),
  };

  // Check if any element is missing
  for (const [key, element] of Object.entries(elements)) {
    if (!element) {
      console.error(`Required element #${key} not found`);
      return;
    }
  }

  // Initialize Bootstrap modals
  const loadingModal = new bootstrap.Modal(elements.loadingModal);
  const successModal = new bootstrap.Modal(elements.successModal);

  // Handle form submission
  elements.form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Show loading modal
    loadingModal.show();

    // Create case data
    const caseData = {
      caseId: "BOMA-" + Date.now().toString(36).slice(-6).toUpperCase(),
      name: elements.form.querySelector('[name="name"]').value,
      email: elements.form.querySelector('[name="email"]').value,
      feelingScale: elements.form.querySelector('[name="feelingScale"]').value,
      concern: elements.form.querySelector('[name="concern"]').value,
      supportType: elements.form.querySelector('[name="supportType"]').value,
      status: "pending",
      date: new Date().toISOString(),
    };

    // Simulate processing delay
    setTimeout(() => {
      try {
        // Save to localStorage
        saveCase(caseData);

        // Hide loading modal
        loadingModal.hide();

        // Show success message
        elements.successCaseId.textContent = caseData.caseId;
        successModal.show();

        // Reset form
        elements.form.reset();
      } catch (error) {
        console.error("Error:", error);
        loadingModal.hide();
        showError("An error occurred. Please try again.");
      }
    }, 2000);
  });

  function saveCase(caseData) {
    const cases = JSON.parse(localStorage.getItem("cases") || "[]");
    cases.push(caseData);
    localStorage.setItem("cases", JSON.stringify(cases));
  }

  function showError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "alert alert-danger mt-3";
    errorDiv.textContent = message;
    elements.form.insertAdjacentElement("beforebegin", errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
  }
});
