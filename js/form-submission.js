document.addEventListener("DOMContentLoaded", function () {
  // Get all required elements with detailed error checking
  const form = document.getElementById("anonymousForm");
  const loadingModalElement = document.getElementById("loadingModal");
  const successModalElement = document.getElementById("successModal");
  const successCaseIdElement = document.getElementById("successCaseId");

  // Detailed element checking with specific error messages
  if (!form) {
    console.error("Form element #anonymousForm not found");
    return;
  }

  if (!loadingModalElement) {
    console.error("Loading modal #loadingModal not found");
    return;
  }

  if (!successModalElement) {
    console.error("Success modal #successModal not found");
    return;
  }

  if (!successCaseIdElement) {
    console.error("Success case ID element #successCaseId not found");
    return;
  }

  // Initialize Bootstrap modals
  const loadingModal = new bootstrap.Modal(loadingModalElement, {
    backdrop: "static",
    keyboard: false,
  });

  const successModal = new bootstrap.Modal(successModalElement, {
    backdrop: "static",
    keyboard: false,
  });

  // Form submission handler
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Show loading modal
    loadingModal.show();

    // Get form data with validation
    const formData = {
      name: form.querySelector('[name="name"]')?.value || "Anonymous",
      email: form.querySelector('[name="email"]')?.value,
      feelingScale: form.querySelector('[name="feelingScale"]')?.value,
      concern: form.querySelector('[name="concern"]')?.value,
      supportType: form.querySelector('[name="supportType"]')?.value,
      caseId: generateCaseId(),
      status: "pending",
      date: new Date().toISOString(),
    };

    // Validate required fields
    if (!formData.email || !formData.concern || !formData.supportType) {
      showError("Please fill in all required fields");
      loadingModal.hide();
      return;
    }

    // Process submission
    setTimeout(() => {
      try {
        // Save to localStorage
        saveCase(formData);

        // Hide loading modal
        loadingModal.hide();

        // Update and show success modal
        successCaseIdElement.textContent = formData.caseId;
        successModal.show();

        // Reset form
        form.reset();
      } catch (error) {
        console.error("Submission error:", error);
        loadingModal.hide();
        showError("An error occurred. Please try again.");
      }
    }, 2000);
  });

  // Helper functions
  function generateCaseId() {
    return "BOMA-" + Date.now().toString(36).slice(-6).toUpperCase();
  }

  function saveCase(caseData) {
    try {
      const cases = JSON.parse(localStorage.getItem("cases") || "[]");
      cases.push(caseData);
      localStorage.setItem("cases", JSON.stringify(cases));
    } catch (error) {
      throw new Error("Failed to save case data");
    }
  }

  function showError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "alert alert-danger mt-3";
    errorDiv.textContent = message;
    form.insertAdjacentElement("beforebegin", errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
  }
});
