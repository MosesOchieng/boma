function checkAuth() {
  const token = localStorage.getItem("councilToken");
  const memberData = localStorage.getItem("councilMember");

  if (!token || !memberData) {
    window.location.href = "/council-login.html";
    return false;
  }

  try {
    const member = JSON.parse(memberData);
    const nameElement = document.getElementById("memberName");
    if (nameElement) {
      nameElement.textContent = member.name;
    }
    return true;
  } catch (error) {
    console.error("Auth error:", error);
    window.location.href = "/council-login.html";
    return false;
  }
}

// Handle logout
function logout() {
  localStorage.removeItem("councilToken");
  localStorage.removeItem("councilMember");
  window.location.href = "/council-login.html";
}

// Check auth on page load
document.addEventListener("DOMContentLoaded", checkAuth);
