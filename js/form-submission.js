document.addEventListener("DOMContentLoaded", function () {
  // First, verify all elements exist
  const elements = {
    form: document.getElementById("anonymousForm"),
    submissionModal: document.getElementById("submissionModal"),
    loadingContent: document.getElementById("loadingContent"),
    successContent: document.getElementById("successContent"),
    caseIdElement: document.querySelector(".case-id"),
  };

  // Check if any element is missing
  for (const [key, element] of Object.entries(elements)) {
    if (!element) {
      console.error(`Required element #${key} not found`);
      return;
    }
  }

  // Initialize Bootstrap modal
  const submissionModal = new bootstrap.Modal(elements.submissionModal);

  // Handle form submission
  elements.form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Show loading state
    elements.loadingContent.style.display = "block";
    elements.successContent.style.display = "none";
    submissionModal.show();

    // Create case data
    const caseData = {
      caseId: "BOMA-" + Date.now().toString(36).slice(-6).toUpperCase(),
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

        // Show success state
        elements.loadingContent.style.display = "none";
        elements.successContent.style.display = "block";
        elements.caseIdElement.textContent = caseData.caseId;

        // Reset form
        elements.form.reset();
      } catch (error) {
        console.error("Error:", error);
        submissionModal.hide();
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

  // Reset modal state when it's hidden
  elements.submissionModal.addEventListener("hidden.bs.modal", function () {
    elements.loadingContent.style.display = "block";
    elements.successContent.style.display = "none";
  });
});
