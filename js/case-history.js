class CaseHistory {
  static history = JSON.parse(localStorage.getItem("caseHistory") || "{}");

  static addEvent(caseId, event) {
    if (!this.history[caseId]) {
      this.history[caseId] = [];
    }

    const historyEvent = {
      id: Date.now(),
      event: event,
      timestamp: new Date().toISOString(),
      user: JSON.parse(localStorage.getItem("authData")).name,
    };

    this.history[caseId].push(historyEvent);
    this.saveHistory();
    return historyEvent;
  }

  static getHistory(caseId) {
    return this.history[caseId] || [];
  }

  static saveHistory() {
    localStorage.setItem("caseHistory", JSON.stringify(this.history));
  }
}
