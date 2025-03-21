// Simple form handler without modules or complex configurations
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("anonymousForm");
  const loadingModal = new bootstrap.Modal(
    document.getElementById("loadingModal"),
  );
  const successModal = new bootstrap.Modal(
    document.getElementById("successModal"),
  );

  if (form) {
    form.addEventListener("submit", handleSubmit);
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Show loading modal
    loadingModal.show();

    // Create case data
    const caseData = {
      caseId: "BOMA-" + Date.now().toString().slice(-6),
      name: form.querySelector('[name="name"]').value,
      email: form.querySelector('[name="email"]').value,
      feelingScale: form.querySelector('[name="feelingScale"]').value,
      concern: form.querySelector('[name="concern"]').value,
      supportType: form.querySelector('[name="supportType"]').value,
      status: "pending",
      date: new Date().toISOString(),
    };

    // Simulate server delay
    setTimeout(() => {
      try {
        // Get existing cases
        let cases = [];
        const existingCases = localStorage.getItem("cases");

        if (existingCases) {
          cases = JSON.parse(existingCases);
        }

        // Ensure cases is an array
        if (!Array.isArray(cases)) {
          cases = [];
        }

        // Add new case
        cases.push(caseData);

        // Save to localStorage
        localStorage.setItem("cases", JSON.stringify(cases));

        // Hide loading modal
        loadingModal.hide();

        // Show success message
        const successCaseId = document.getElementById("successCaseId");
        if (successCaseId) {
          successCaseId.textContent = caseData.caseId;
        }
        successModal.show();

        // Reset form
        form.reset();
      } catch (error) {
        console.error("Error:", error);
        loadingModal.hide();
        showError("An error occurred. Please try again.");
      }
    }, 1500);
  }

  function showError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "alert alert-danger mt-3";
    errorDiv.textContent = message;
    form.insertAdjacentElement("beforebegin", errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
  }
});
