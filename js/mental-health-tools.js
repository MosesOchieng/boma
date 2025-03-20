class MentalHealthTools {
    constructor() {
        this.moodData = [];
        this.initializeTools();
    }

    initializeTools() {
        this.initializeMoodTracker();
        this.initializeAnxietyAssessment();
        this.initializeMeditationGuide();
    }

    // Mood Tracker
    initializeMoodTracker() {
        const moodForm = document.getElementById('moodTrackerForm');
        if (moodForm) {
            moodForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveMoodEntry();
            });
        }
    }

    saveMoodEntry() {
        const mood = document.getElementById('moodLevel').value;
        const notes = document.getElementById('moodNotes').value;
        
        const entry = {
            date: new Date(),
            mood: parseInt(mood),
            notes: notes
        };

        this.moodData.push(entry);
        this.updateMoodChart();
        this.saveMoodToLocalStorage();
    }

    updateMoodChart() {
        const ctx = document.getElementById('moodChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.moodData.map(entry => 
                    entry.date.toLocaleDateString()),
                datasets: [{
                    label: 'Mood Level',
                    data: this.moodData.map(entry => entry.mood),
                    borderColor: '#1e88e5'
                }]
            }
        });
    }

    // Anxiety Assessment
    initializeAnxietyAssessment() {
        const assessmentForm = document.getElementById('anxietyAssessmentForm');
        if (assessmentForm) {
            assessmentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processAnxietyAssessment();
            });
        }
    }

    processAnxietyAssessment() {
        const responses = new FormData(document.getElementById('anxietyAssessmentForm'));
        let score = 0;
        
        responses.forEach((value) => {
            score += parseInt(value);
        });

        this.showAssessmentResults(score);
    }

    // Meditation Guide
    initializeMeditationGuide() {
        const meditationPlayer = document.getElementById('meditationPlayer');
        if (meditationPlayer) {
            this.setupMeditationControls(meditationPlayer);
        }
    }

    setupMeditationControls(player) {
        const playButton = document.getElementById('playMeditation');
        const timerDisplay = document.getElementById('meditationTimer');
        
        playButton.addEventListener('click', () => {
            if (player.paused) {
                player.play();
                this.startMeditationTimer(timerDisplay);
            } else {
                player.pause();
            }
        });
    }

    // Utility Functions
    saveMoodToLocalStorage() {
        localStorage.setItem('moodData', JSON.stringify(this.moodData));
    }

    loadMoodFromLocalStorage() {
        const savedData = localStorage.getItem('moodData');
        if (savedData) {
            this.moodData = JSON.parse(savedData);
            this.updateMoodChart();
        }
    }

    showAssessmentResults(score) {
        const resultDiv = document.getElementById('assessmentResults');
        let recommendation = '';

        if (score < 5) {
            recommendation = 'Your anxiety levels appear to be low. Continue practicing self-care.';
        } else if (score < 10) {
            recommendation = 'You\'re experiencing moderate anxiety. Consider talking to a counselor.';
        } else {
            recommendation = 'Your anxiety levels are high. Please seek professional support.';
        }

        resultDiv.innerHTML = `
            <h3>Assessment Results</h3>
            <p>${recommendation}</p>
            <button onclick="window.location.href='/support'" class="btn btn-primary">
                Get Support
            </button>
        `;
    }
}

// Initialize tools when document loads
document.addEventListener('DOMContentLoaded', () => {
    const tools = new MentalHealthTools();
}); 