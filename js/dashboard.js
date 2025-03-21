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
document.addEventListener("DOMContentLoaded", function () {
  // Check authentication
  checkAuth();

  // Initialize dashboard
  displayCases();
  setupEventListeners();
});

function setupEventListeners() {
  // Search functionality
  document
    .getElementById("searchInput")
    .addEventListener("input", function (e) {
      const searchTerm = e.target.value.toLowerCase();
      filterCases(searchTerm);
    });

  // Filter buttons
  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", function () {
      document
        .querySelectorAll(".filter-btn")
        .forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
      filterCasesByType(this.dataset.filter);
    });
  });

  // Availability toggle
  document
    .getElementById("availabilityToggle")
    .addEventListener("click", function () {
      this.classList.toggle("btn-outline-primary");
      this.classList.toggle("btn-primary");
      const icon = this.querySelector("i");
      icon.classList.toggle("text-success");
    });
}

function filterCases(searchTerm) {
  const filteredCases = sampleCases.filter(
    (caseItem) =>
      caseItem.caseId.toLowerCase().includes(searchTerm) ||
      caseItem.email.toLowerCase().includes(searchTerm) ||
      caseItem.concern.toLowerCase().includes(searchTerm),
  );
  displayCases(filteredCases);
}

function filterCasesByType(type) {
  if (type === "all") {
    displayCases(sampleCases);
  } else {
    const filteredCases = sampleCases.filter((caseItem) =>
      type === "urgent"
        ? caseItem.supportType === "immediate"
        : caseItem.status === type,
    );
    displayCases(filteredCases);
  }
}

function viewCaseDetails(caseId) {
  const caseItem = sampleCases.find((c) => c.caseId === caseId);
  const modal = new bootstrap.Modal(document.getElementById("caseDetailModal"));

  const modalContent = document.getElementById("caseDetailContent");
  modalContent.innerHTML = `
        <div class="case-detail">
            <div class="detail-header mb-3">
                <span class="badge ${getCasePriorityBadge(caseItem.supportType)}">${caseItem.supportType}</span>
                <span class="badge ${getStatusBadge(caseItem.status)}">${caseItem.status}</span>
            </div>
            <div class="detail-body">
                <p><strong>Case ID:</strong> ${caseItem.caseId}</p>
                <p><strong>Name:</strong> ${caseItem.name}</p>
                <p><strong>Email:</strong> ${caseItem.email}</p>
                <p><strong>Feeling Scale:</strong> ${getFeelingScale(caseItem.feelingScale)}</p>
                <p><strong>Concern:</strong> ${caseItem.concern}</p>
                <p><strong>Details:</strong> ${caseItem.details}</p>
                <p><strong>Date:</strong> ${formatDate(caseItem.date)}</p>
            </div>
            <div class="detail-actions mt-3">
                ${
                  caseItem.status === "pending"
                    ? `<button class="btn btn-primary me-2" onclick="takeCase('${caseItem.caseId}')">
                        <i class="fas fa-hand-holding-medical"></i> Take Case
                    </button>`
                    : ""
                }
                ${
                  caseItem.status === "active"
                    ? `<button class="btn btn-success me-2" onclick="markResolved('${caseItem.caseId}')">
                        <i class="fas fa-check-circle"></i> Mark Resolved
                    </button>`
                    : ""
                }
                <button class="btn btn-outline-secondary" onclick="addNote('${caseItem.caseId}')">
                    <i class="fas fa-note-medical"></i> Add Note
                </button>
            </div>
        </div>
    `;

  modal.show();
}

function takeCase(caseId) {
  const caseIndex = sampleCases.findIndex((c) => c.caseId === caseId);
  if (caseIndex !== -1) {
    sampleCases[caseIndex].status = "active";
    showToast("Case assigned successfully!", "success");
    updateDashboard();
    // Close the modal
    bootstrap.Modal.getInstance(
      document.getElementById("caseDetailModal"),
    ).hide();
  }
}

function markResolved(caseId) {
  const caseIndex = sampleCases.findIndex((c) => c.caseId === caseId);
  if (caseIndex !== -1) {
    sampleCases[caseIndex].status = "resolved";
    showToast("Case marked as resolved!", "success");
    updateDashboard();
    // Close the modal
    bootstrap.Modal.getInstance(
      document.getElementById("caseDetailModal"),
    ).hide();
  }
}

function addNote(caseId) {
  const modal = new bootstrap.Modal(document.getElementById('noteModal'));
  const modalContent = document.getElementById('noteModalContent');
  
  modalContent.innerHTML = `
      <div class="note-form">
          <textarea class="form-control" id="noteText" rows="4" placeholder="Enter your note..."></textarea>
          <div class="mt-3">
              <button class="btn btn-primary" onclick="saveNote('${caseId}')">Save Note</button>
          </div>
      </div>
      <div class="notes-history mt-4">
          <h6>Previous Notes</h6>
          <div id="notesList">
              ${renderNotes(caseId)}
          </div>
      </div>
  `;
  
  modal.show();
}

function renderNotes(caseId) {
  const notes = CaseNotes.getNotes(caseId);
  return notes.map(note => `
      <div class="note-item mb-2">
          <div class="note-header">
              <small class="text-muted">${note.author} - ${formatDate(note.timestamp)}</small>
          </div>
          <div class="note-text">${note.text}</div>
      </div>
  `).join('');
}

function saveNote(caseId) {
  const noteText = document.getElementById('noteText').value.trim();
  if (noteText) {
    const note = CaseNotes.addNote(caseId, noteText);
    CaseHistory.addEvent(caseId, `Note added by ${note.author}`);
    document.getElementById('notesList').innerHTML = renderNotes(caseId);
    document.getElementById('noteText').value = '';
    showToast('Note added successfully!', 'success');
  }
}

function viewCaseHistory(caseId) {
  const modal = new bootstrap.Modal(document.getElementById('historyModal'));
  const modalContent = document.getElementById('historyModalContent');
  
  const history = CaseHistory.getHistory(caseId);
  modalContent.innerHTML = `
      <div class="history-timeline">
          ${history.map(event => `
              <div class="timeline-item">
                  <div class="timeline-date">${formatDate(event.timestamp)}</div>
                  <div class="timeline-event">${event.event}</div>
                  <div class="timeline-user">${event.user}</div>
              </div>
          `).join('')}
      </div>
  `;
  
  modal.show();
}

// Initialize notification system
NotificationSystem.init();
NotificationSystem.subscribe(notifications => {
  const unreadCount = notifications.filter(n => !n.read).length;
  document.getElementById('notificationBadge').textContent = unreadCount;
  updateNotificationDropdown(notifications);
});

function updateNotificationDropdown(notifications) {
  const dropdown = document.getElementById('notificationDropdown');
  dropdown.innerHTML = notifications.map(n => `
    <a class="dropdown-item ${n.read ? 'read' : ''}" href="#" onclick="handleNotificationClick('${n.id}', '${n.caseId}')">
      <div class="notification-title">${n.title}</div>
      <div class="notification-message">${n.message}</div>
      <small class="text-muted">${formatDate(n.timestamp)}</small>
    </a>
  `).join('');
}

function handleNotificationClick(notificationId, caseId) {
  NotificationSystem.markAsRead(notificationId);
  viewCaseDetails(caseId);
}

function showToast(message, type = "info") {
  const toastContainer = document.createElement("div");
  toastContainer.className = `toast-container position-fixed bottom-0 end-0 p-3`;
  toastContainer.innerHTML = `