// Simple form handler without modules or complex configurations
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("anonymousForm");
  const loadingModal = new bootstrap.Modal(
    document.getElementById("loadingModal"),
    {
      backdrop: "static",
      keyboard: false,
    },
  );
  const successModal = new bootstrap.Modal(
    document.getElementById("successModal"),
    {
      backdrop: "static",
      keyboard: false,
    },
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
      caseId: generateCaseId(),
      name: form.querySelector('[name="name"]').value,
      email: form.querySelector('[name="email"]').value,
      feelingScale: form.querySelector('[name="feelingScale"]').value,
      concern: form.querySelector('[name="concern"]').value,
      supportType: form.querySelector('[name="supportType"]').value,
      status: "pending",
      date: new Date().toISOString(),
    };

    // Simulate delay and save data
    setTimeout(() => {
      try {
        // Save to localStorage
        saveToLocalStorage(caseData);

        // Hide loading modal
        loadingModal.hide();

        // Show success modal
        document.getElementById("successCaseId").textContent = caseData.caseId;
        successModal.show();

        // Reset form
        form.reset();
      } catch (error) {
        console.error("Error:", error);
        loadingModal.hide();
        showError("Failed to submit form. Please try again.");
      }
    }, 1500);
  }

  function generateCaseId() {
    return "BOMA-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  function saveToLocalStorage(caseData) {
    try {
      const cases = JSON.parse(localStorage.getItem("cases") || "[]");
      cases.push(caseData);
      localStorage.setItem("cases", JSON.stringify(cases));
    } catch (error) {
      console.error("Storage error:", error);
      throw new Error("Failed to save data");
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
