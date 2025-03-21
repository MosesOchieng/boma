document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("anonymousForm");

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      try {
        // Show loading modal
        const loadingModal = new bootstrap.Modal(
          document.getElementById("loadingModal"),
        );
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
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Store in localStorage
        const existingCases = localStorage.getItem("cases");
        const cases = existingCases ? JSON.parse(existingCases) : [];
        cases.push(caseData);
        localStorage.setItem("cases", JSON.stringify(cases));

        // Hide loading modal
        loadingModal.hide();

        // Show success modal
        const successModal = new bootstrap.Modal(
          document.getElementById("successModal"),
        );
        document.getElementById("successCaseId").textContent = caseData.caseId;
        successModal.show();

        // Reset form
        form.reset();
      } catch (error) {
        console.error("Submission error:", error);
        // Hide loading modal if visible
        const loadingModal = bootstrap.Modal.getInstance(
          document.getElementById("loadingModal"),
        );
        if (loadingModal) {
          loadingModal.hide();
        }
        // Show error message
        showError(
          "There was an error submitting your request. Please try again.",
        );
      }
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
