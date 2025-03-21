document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("anonymousForm");

  if (!form) {
    console.error("Form not found");
    return;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Get the modals
    const loadingModalElement = document.getElementById("loadingModal");
    const successModalElement = document.getElementById("successModal");

    if (!loadingModalElement || !successModalElement) {
      console.error("Modals not found");
      return;
    }

    // Show loading modal
    const loadingModal = new bootstrap.Modal(loadingModalElement);
    loadingModal.show();

    try {
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
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Save to localStorage
      let cases = [];
      try {
        const existingCases = localStorage.getItem("cases");
        if (existingCases) {
          cases = JSON.parse(existingCases);
        }
      } catch (error) {
        console.error("Error parsing existing cases:", error);
        cases = [];
      }

      cases.push(caseData);
      localStorage.setItem("cases", JSON.stringify(cases));

      // Hide loading modal
      loadingModal.hide();

      // Show success modal
      const successModal = new bootstrap.Modal(successModalElement);
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
      showError("An error occurred. Please try again.");
    }
  });

  function showError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "alert alert-danger mt-3";
    errorDiv.textContent = message;
    form.insertAdjacentElement("beforebegin", errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
  }
});
