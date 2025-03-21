document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("anonymousForm");

  // Get the modals
  const loadingModalElement = document.getElementById("loadingModal");
  const successModalElement = document.getElementById("successModal");

  // Check if elements exist
  if (!form || !loadingModalElement || !successModalElement) {
    console.error("Required elements not found");
    return;
  }

  // Initialize Bootstrap modals
  const loadingModal = new bootstrap.Modal(loadingModalElement);
  const successModal = new bootstrap.Modal(successModalElement);

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Show loading modal
    loadingModal.show();

    // Create case data
    const caseData = {
      caseId: "BOMA-" + Date.now().toString(36).slice(-6).toUpperCase(),
      name: form.querySelector('[name="name"]').value,
      email: form.querySelector('[name="email"]').value,
      feelingScale: form.querySelector('[name="feelingScale"]').value,
      concern: form.querySelector('[name="concern"]').value,
      supportType: form.querySelector('[name="supportType"]').value,
      status: "pending",
      date: new Date().toISOString(),
    };

    // Simulate processing delay
    setTimeout(() => {
      try {
        // Save to localStorage
        let cases = [];
        const existingCases = localStorage.getItem("cases");
        if (existingCases) {
          cases = JSON.parse(existingCases);
        }
        cases.push(caseData);
        localStorage.setItem("cases", JSON.stringify(cases));

        // Hide loading modal
        loadingModal.hide();

        // Update success modal with case ID
        const successCaseId = document.getElementById("successCaseId");
        if (successCaseId) {
          successCaseId.textContent = caseData.caseId;
        }

        // Show success modal
        successModal.show();

        // Reset form
        form.reset();
      } catch (error) {
        console.error("Error:", error);
        loadingModal.hide();
        showError("An error occurred. Please try again.");
      }
    }, 2000);
  });

  function showError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "alert alert-danger mt-3";
    errorDiv.textContent = message;
    form.insertAdjacentElement("beforebegin", errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
  }
});
