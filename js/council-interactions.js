document.addEventListener('DOMContentLoaded', function() {
    // Contact Form Handling
    const contactForm = document.getElementById('councilContactForm');
    const contactMethodSelect = contactForm.querySelector('select[name="contact-method"]');
    const contactDetails = document.querySelector('.contact-details');

    contactMethodSelect?.addEventListener('change', function() {
        if (this.value === 'anonymous') {
            contactDetails.style.display = 'none';
        } else {
            contactDetails.style.display = 'block';
        }
    });

    // Event Registration Handling
    const registerButtons = document.querySelectorAll('.register-btn');
    registerButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const eventType = this.dataset.event;
            openRegistrationModal(eventType);
        });
    });

    // Council Member Contact
    const councilEmails = document.querySelectorAll('.council-member .email');
    councilEmails.forEach(email => {
        email.addEventListener('click', function(e) {
            e.preventDefault();
            const member = this.closest('.council-member').querySelector('h3').textContent;
            openContactModal(member);
        });
    });
});

function openRegistrationModal(eventType) {
    // Create and show modal for event registration
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Event Registration</h5>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="eventRegistrationForm">
                        <div class="form-group">
                            <label>Preferred Name (Optional)</label>
                            <input type="text" class="form-control">
                        </div>
                        <div class="form-group">
                            <label>Contact Method</label>
                            <select class="form-control">
                                <option value="anonymous">Anonymous Attendance</option>
                                <option value="email">Email Updates</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">Register</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    $(modal).modal('show');
}

function openContactModal(memberName) {
    // Create and show modal for contacting council members
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Contact ${memberName}</h5>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="memberContactForm">
                        <div class="form-group">
                            <label>Message</label>
                            <textarea class="form-control" rows="4"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Contact Preference</label>
                            <select class="form-control">
                                <option value="anonymous">Anonymous Message</option>
                                <option value="email">Email Response</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    $(modal).modal('show');
} 