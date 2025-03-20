class MentalHealthAPI {
    constructor() {
        this.baseURL = '/api';
    }

    async submitSupportRequest(data) {
        try {
            const response = await fetch(`${this.baseURL}/support/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Error submitting support request:', error);
            throw error;
        }
    }

    async getResources(category = null) {
        try {
            const url = category 
                ? `${this.baseURL}/resources?category=${category}`
                : `${this.baseURL}/resources`;
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            console.error('Error fetching resources:', error);
            throw error;
        }
    }

    async submitAssessment(assessmentData) {
        try {
            const response = await fetch(`${this.baseURL}/assessments/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(assessmentData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error submitting assessment:', error);
            throw error;
        }
    }
} 