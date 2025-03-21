document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("anonymousForm");

  // Initialize Bootstrap modals properly
  const loadingModal = new bootstrap.Modal("#loadingModal", {
    backdrop: "static",
    keyboard: false,
  });

  const successModal = new bootstrap.Modal("#successModal", {
    backdrop: "static",
    keyboard: false,
  });

  if (form) {
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

      // Simulate processing delay (1.5 seconds)
      setTimeout(() => {
        try {
          // Get existing cases or initialize empty array
          let cases = [];
          const existingCases = localStorage.getItem("cases");

          if (existingCases) {
            cases = JSON.parse(existingCases);
          }

          // Add new case
          cases.push(caseData);

          // Save to localStorage
          localStorage.setItem("cases", JSON.stringify(cases));

          // Hide loading modal
          loadingModal.hide();

          // Update success modal with case ID and show it
          const successCaseId = document.getElementById("successCaseId");
          if (successCaseId) {
            successCaseId.textContent = caseData.caseId;
          }
          successModal.show();

          // Reset form
          form.reset();
        } catch (error) {
          console.error("Submission error:", error);
          loadingModal.hide();
          showError("An error occurred during submission. Please try again.");
        }
      }, 1500);
    });
  }

  function showError(message) {
    const errorAlert = document.createElement("div");
    errorAlert.className = "alert alert-danger mt-3";
    errorAlert.textContent = message;
    form.insertAdjacentElement("beforebegin", errorAlert);
    setTimeout(() => errorAlert.remove(), 5000);
  }
});
