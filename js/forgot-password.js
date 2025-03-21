document.addEventListener("DOMContentLoaded", () => {
  const resetForm = document.getElementById("resetForm");

  resetForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;

    // Check if email exists in councilMembers
    const member = councilMembers.find((m) => m.email === email);

    if (member) {
      // Show success message
      showMessage("Password reset link sent to your email!", "success");

      // In a real application, you would:
      // 1. Generate a reset token
      // 2. Send an email with the reset link
      // 3. Store the token in the database

      // Simulate email sending delay
      setTimeout(() => {
        window.location.href = "council-login.html";
      }, 3000);
    } else {
      showMessage("Email not found!", "danger");
    }
  });
});

function showMessage(message, type) {
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type} mt-3`;
  alertDiv.textContent = message;

  const form = document.querySelector(".reset-form");
  form.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.remove();
  }, 3000);
}
