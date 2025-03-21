// Check if user is logged in
function checkAuth() {
  const token = localStorage.getItem("councilToken");
  const memberData = localStorage.getItem("councilMember");

  if (!token || !memberData) {
    redirectToLogin();
    return false;
  }

  try {
    const tokenData = JSON.parse(atob(token));
    const member = JSON.parse(memberData);

    // Check token expiration
    if (tokenData.exp && tokenData.exp < Date.now()) {
      throw new Error("Token expired");
    }

    // Update UI with member info
    const nameElement = document.getElementById("memberName");
    if (nameElement) {
      nameElement.textContent = member.name;
    }
    return true;
  } catch (error) {
    console.error("Auth error:", error);
    redirectToLogin();
    return false;
  }
}

function redirectToLogin() {
  localStorage.removeItem("councilToken");
  localStorage.removeItem("councilMember");
  // Keep rememberedUser data
  window.location.href = "council-login.html";
}

// Add this to your dashboard HTML
document.addEventListener("DOMContentLoaded", checkAuth);

// Add this to your dashboard.html
document.addEventListener("DOMContentLoaded", function () {
  // Check authentication
  const token = localStorage.getItem("councilToken");
  const memberData = localStorage.getItem("councilMember");

  if (!token || !memberData) {
    window.location.href = "/council-login.html";
    return;
  }

  try {
    const member = JSON.parse(memberData);
    // Update UI with member info
    const nameElement = document.getElementById("memberName");
    if (nameElement) {
      nameElement.textContent = member.name;
    }
  } catch (error) {
    console.error("Auth error:", error);
    window.location.href = "/council-login.html";
  }
});

// Add logout function
function logout() {
  const keepRemembered = localStorage.getItem("rememberedUser") !== null;

  localStorage.removeItem("councilToken");
  localStorage.removeItem("councilMember");

  if (!keepRemembered) {
    localStorage.removeItem("rememberedUser");
  }

  window.location.href = "council-login.html";
}
