class CaseNotes {
  static notes = JSON.parse(localStorage.getItem("caseNotes") || "{}");

  static addNote(caseId, note) {
    if (!this.notes[caseId]) {
      this.notes[caseId] = [];
    }

    const newNote = {
      id: Date.now(),
      text: note,
      timestamp: new Date().toISOString(),
      author: JSON.parse(localStorage.getItem("authData")).name,
    };

    this.notes[caseId].push(newNote);
    this.saveNotes();
    return newNote;
  }

  static getNotes(caseId) {
    return this.notes[caseId] || [];
  }

  static saveNotes() {
    localStorage.setItem("caseNotes", JSON.stringify(this.notes));
  }
}
