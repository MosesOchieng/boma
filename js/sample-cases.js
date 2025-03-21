const sampleCases = [
  {
    caseId: "BOMA-001",
    name: "Jane Muthoni",
    email: "jane.m@gmail.com",
    feelingScale: 3,
    concern: "Anxiety about upcoming exams",
    supportType: "immediate",
    status: "pending",
    date: "2024-03-15",
    details: "Experiencing panic attacks before exams, needs coping strategies",
  },
  {
    caseId: "CASE-002",
    name: "Anonymous",
    email: "kiprop.cheruiyot@yahoo.com",
    feelingScale: 3,
    concern:
      "Dealing with pressure from parents about course selection. They want medicine, I prefer computer science.",
    supportType: "scheduled",
    status: "active",
    date: "2024-03-14",
  },
  {
    caseId: "CASE-003",
    name: "Anonymous",
    email: "atieno.adhiambo@gmail.com",
    feelingScale: 1,
    concern:
      "Feeling overwhelmed with depression. Lost my parent recently and struggling to cope with studies.",
    supportType: "immediate",
    status: "urgent",
    date: "2024-03-13",
  },
  {
    caseId: "CASE-004",
    name: "Anonymous",
    email: "mutua.kioko@gmail.com",
    feelingScale: 4,
    concern:
      "Need guidance on managing stress. Balancing part-time work and studies is becoming difficult.",
    supportType: "scheduled",
    status: "pending",
    date: "2024-03-12",
  },
  {
    caseId: "CASE-005",
    name: "Anonymous",
    email: "njeri.wambui@yahoo.com",
    feelingScale: 2,
    concern:
      "Experiencing bullying in class. Afraid to speak up but it's affecting my mental health.",
    supportType: "immediate",
    status: "active",
    date: "2024-03-11",
  },
  {
    caseId: "CASE-006",
    name: "Anonymous",
    email: "omondi.otieno@gmail.com",
    feelingScale: 3,
    concern:
      "Financial stress affecting my studies. Worried about next semester's fees.",
    supportType: "scheduled",
    status: "pending",
    date: "2024-03-10",
  },
  {
    caseId: "CASE-007",
    name: "Anonymous",
    email: "kimani.njoroge@yahoo.com",
    feelingScale: 2,
    concern:
      "Struggling with social anxiety. Finding it hard to participate in group discussions.",
    supportType: "scheduled",
    status: "active",
    date: "2024-03-09",
  },
  {
    caseId: "CASE-008",
    name: "Anonymous",
    email: "akinyi.owuor@gmail.com",
    feelingScale: 1,
    concern:
      "Experiencing panic attacks during exams. Need urgent help with coping strategies.",
    supportType: "immediate",
    status: "urgent",
    date: "2024-03-08",
  },
  {
    caseId: "CASE-049",
    name: "Anonymous",
    email: "gitau.mwangi@yahoo.com",
    feelingScale: 2,
    concern:
      "Dealing with substance abuse issues. Want to quit but finding it difficult.",
    supportType: "immediate",
    status: "urgent",
    date: "2024-02-15",
  },
  {
    caseId: "CASE-050",
    name: "Anonymous",
    email: "zawadi.omar@gmail.com",
    feelingScale: 3,
    concern:
      "Need help with time management and study techniques. Feeling overwhelmed.",
    supportType: "scheduled",
    status: "pending",
    date: "2024-02-14",
  },
  {
    caseId: "BOMA-011",
    name: "Brian Kipchoge",
    email: "brian.k@gmail.com",
    feelingScale: 4,
    concern: "Depression symptoms",
    supportType: "scheduled",
    status: "active",
    date: "2024-03-14",
    details: "Feeling isolated and overwhelmed with academic pressure",
  },
  {
    caseId: "BOMA-012",
    name: "Faith Wanjiru",
    email: "faith.w@gmail.com",
    feelingScale: 2,
    concern: "Family issues",
    supportType: "immediate",
    status: "pending",
    date: "2024-03-14",
    details: "Struggling with family conflicts affecting studies",
  },
  {
    caseId: "BOMA-049",
    name: "Victor Omondi",
    email: "victor.o@gmail.com",
    feelingScale: 5,
    concern: "Substance abuse",
    supportType: "immediate",
    status: "pending",
    date: "2024-03-10",
    details: "Seeking help for addiction recovery",
  },
  {
    caseId: "BOMA-050",
    name: "Lucy Kamau",
    email: "lucy.k@gmail.com",
    feelingScale: 3,
    concern: "Relationship stress",
    supportType: "scheduled",
    status: "active",
    date: "2024-03-10",
    details: "Going through a difficult breakup",
  },
];

// Function to display cases in dashboard
function displayCases() {
  const tableBody = document.getElementById("casesTableBody");
  if (!tableBody) return;

  tableBody.innerHTML = sampleCases
    .map(
      (caseItem) => `
        <tr class="${caseItem.supportType === "immediate" ? "table-danger" : ""}">
            <td>${caseItem.caseId}</td>
            <td>
                <span class="badge ${getBadgeClass(caseItem.supportType)}">
                    ${caseItem.supportType.toUpperCase()}
                </span>
            </td>
            <td>${caseItem.email}</td>
            <td>
                <span class="feeling-scale scale-${caseItem.feelingScale}">
                    ${caseItem.feelingScale}/5
                </span>
            </td>
            <td>${formatDate(caseItem.date)}</td>
            <td>
                <span class="badge ${getStatusBadgeClass(caseItem.status)}">
                    ${caseItem.status.toUpperCase()}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewCase('${caseItem.caseId}')">
                    View Details
                </button>
            </td>
        </tr>
    `,
    )
    .join("");

  updateDashboardStats();
}

// Helper functions
function getBadgeClass(supportType) {
  return supportType === "immediate" ? "bg-danger" : "bg-warning";
}

function getStatusBadgeClass(status) {
  switch (status) {
    case "urgent":
      return "bg-danger";
    case "active":
      return "bg-primary";
    case "pending":
      return "bg-warning";
    default:
      return "bg-secondary";
  }
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function updateDashboardStats() {
  const stats = {
    total: sampleCases.length,
    urgent: sampleCases.filter((c) => c.supportType === "immediate").length,
    active: sampleCases.filter((c) => c.status === "active").length,
    pending: sampleCases.filter((c) => c.status === "pending").length,
  };

  document.getElementById("totalCases").textContent = stats.total;
  document.getElementById("urgentCases").textContent = stats.urgent;
  document.getElementById("activeCases").textContent = stats.active;
  document.getElementById("pendingCases").textContent = stats.pending;
}

// View case details
function viewCase(caseId) {
  const caseData = sampleCases.find((c) => c.caseId === caseId);
  if (!caseData) return;

  const modal = new bootstrap.Modal(document.getElementById("caseDetailModal"));
  document.getElementById("caseDetailContent").innerHTML = `
        <div class="case-header">
            <h5>Case ID: ${caseData.caseId}</h5>
            <span class="badge ${getStatusBadgeClass(caseData.status)}">
                ${caseData.status.toUpperCase()}
            </span>
        </div>
        <div class="case-info">
            <p><strong>Date:</strong> ${formatDate(caseData.date)}</p>
            <p><strong>Email:</strong> ${caseData.email}</p>
            <p><strong>Feeling Scale:</strong> ${caseData.feelingScale}/5</p>
            <p><strong>Support Type:</strong> ${caseData.supportType}</p>
            <p><strong>Concern:</strong></p>
            <p class="concern-text">${caseData.concern}</p>
        </div>
        <div class="case-actions mt-4">
            <button onclick="updateCaseStatus('${caseData.caseId}', 'active')" class="btn btn-primary">
                Take Case
            </button>
            <button onclick="updateCaseStatus('${caseData.caseId}', 'resolved')" class="btn btn-success">
                Mark Resolved
            </button>
        </div>
    `;
  modal.show();
}

// Initialize dashboard
document.addEventListener("DOMContentLoaded", function () {
  displayCases();
});
