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
document.addEventListener("DOMContentLoaded", function() {
  // Check authentication
  checkAuth();
  
  // Initialize dashboard
  displayCases();
  setupEventListeners();
});

function setupEventListeners() {
  // Search functionality
  document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    filterCases(searchTerm);
  });

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      filterCasesByType(this.dataset.filter);
    });
  });

  // Availability toggle
  document.getElementById('availabilityToggle').addEventListener('click', function() {
    this.classList.toggle('btn-outline-primary');
    this.classList.toggle('btn-primary');
    const icon = this.querySelector('i');
    icon.classList.toggle('text-success');
  });
}

function filterCases(searchTerm) {
  const filteredCases = sampleCases.filter(caseItem => 
    caseItem.caseId.toLowerCase().includes(searchTerm) ||
    caseItem.email.toLowerCase().includes(searchTerm) ||
    caseItem.concern.toLowerCase().includes(searchTerm)
  );
  displayCases(filteredCases);
}

function filterCasesByType(type) {
  if (type === 'all') {
    displayCases(sampleCases);
  } else {
    const filteredCases = sampleCases.filter(caseItem => 
      type === 'urgent' ? caseItem.supportType === 'immediate' : caseItem.status === type
    );
    displayCases(filteredCases);
  }
}

// Rest of the dashboard functions from previous response...
