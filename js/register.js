/**
 * Gatherly - Registration Controller (register.html)
 * Form validation, duplicate registration prevention, seat decrementing, and ticket pass generation
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registration-form');
  const eventSelect = document.getElementById('reg-event-select');
  const eventPreview = document.getElementById('selected-event-preview-box');
  const formSection = document.getElementById('registration-form-section');
  const confirmationSection = document.getElementById('registration-confirmation-section');
  const passContainer = document.getElementById('confirmation-pass-container');

  // Input elements
  const nameInput = document.getElementById('reg-name');
  const emailInput = document.getElementById('reg-email');
  const phoneInput = document.getElementById('reg-phone');
  const ticketsSelect = document.getElementById('reg-tickets');

  // Error elements
  const nameError = document.getElementById('reg-name-error');
  const emailError = document.getElementById('reg-email-error');
  const phoneError = document.getElementById('reg-phone-error');
  const eventError = document.getElementById('reg-event-error');

  // 1. Populate Event Select Dropdown
  const events = StorageService.getEvents();
  populateEventDropdown(events);

  // 2. Pre-select Event from URL Parameter ?id=...
  const urlParams = new URLSearchParams(window.location.search);
  const preselectedId = urlParams.get('id');
  if (preselectedId) {
    if (eventSelect) {
      eventSelect.value = preselectedId;
    }
  }

  updateEventPreview();

  // 3. Event Listener on Event Selection Change
  if (eventSelect) {
    eventSelect.addEventListener('change', () => {
      updateEventPreview();
      validateField(eventSelect, eventError, !!eventSelect.value, 'Please select an event.');
    });
  }

  // 4. Real-time Field Validation Listeners
  if (nameInput) {
    nameInput.addEventListener('blur', () => {
      validateField(nameInput, nameError, nameInput.value.trim().length >= 2, 'Please enter your full name (at least 2 letters).');
    });
    nameInput.addEventListener('input', () => {
      if (nameInput.classList.contains('is-invalid')) {
        validateField(nameInput, nameError, nameInput.value.trim().length >= 2, 'Please enter your full name.');
      }
    });
  }

  if (emailInput) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    emailInput.addEventListener('blur', () => {
      validateField(emailInput, emailError, emailRegex.test(emailInput.value.trim()), 'Please enter a valid email address.');
    });
    emailInput.addEventListener('input', () => {
      if (emailInput.classList.contains('is-invalid')) {
        validateField(emailInput, emailError, emailRegex.test(emailInput.value.trim()), 'Please enter a valid email address.');
      }
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener('blur', () => {
      const clean = phoneInput.value.replace(/[\s\-\(\)\.]/g, '');
      validateField(phoneInput, phoneError, clean.length >= 7, 'Please provide a valid phone number (at least 7 digits).');
    });
    phoneInput.addEventListener('input', () => {
      if (phoneInput.classList.contains('is-invalid')) {
        const clean = phoneInput.value.replace(/[\s\-\(\)\.]/g, '');
        validateField(phoneInput, phoneError, clean.length >= 7, 'Please provide a valid phone number.');
      }
    });
  }

  // 5. Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal = nameInput.value.trim();
      const emailVal = emailInput.value.trim().toLowerCase();
      const phoneVal = phoneInput.value.trim();
      const eventIdVal = eventSelect.value;
      const ticketsVal = parseInt(ticketsSelect ? ticketsSelect.value : '1', 10) || 1;

      // Validate all
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneClean = phoneVal.replace(/[\s\-\(\)\.]/g, '');

      const isNameValid = validateField(nameInput, nameError, nameVal.length >= 2, 'Full name is required.');
      const isEmailValid = validateField(emailInput, emailError, emailRegex.test(emailVal), 'A valid email address is required.');
      const isPhoneValid = validateField(phoneInput, phoneError, phoneClean.length >= 7, 'Valid contact phone number is required.');
      const isEventValid = validateField(eventSelect, eventError, !!eventIdVal, 'Please choose an event to attend.');

      if (!isNameValid || !isEmailValid || !isPhoneValid || !isEventValid) {
        Toast.error('Please fix the errors highlighted in red.', 'Validation Error');
        return;
      }

      // Submit to Storage Service
      const result = StorageService.createBooking({
        eventId: eventIdVal,
        userName: nameVal,
        userEmail: emailVal,
        userPhone: phoneVal,
        tickets: ticketsVal
      });

      if (!result.success) {
        Toast.error(result.error, 'Registration Failed');
        return;
      }

      // Success!
      Toast.success(`Confirmed! Registration ID: ${result.booking.id}`, 'Booking Confirmed');

      // Show confirmation pass
      renderConfirmation(result.booking);
    });
  }

  /**
   * Helper to validate a form control
   */
  function validateField(inputElement, errorElement, condition, errorMsg) {
    if (!condition) {
      inputElement.classList.add('is-invalid');
      if (errorElement) {
        errorElement.textContent = errorMsg;
        errorElement.classList.add('is-visible');
      }
      return false;
    } else {
      inputElement.classList.remove('is-invalid');
      if (errorElement) {
        errorElement.classList.remove('is-visible');
      }
      return true;
    }
  }

  /**
   * Populate event selector dropdown
   */
  function populateEventDropdown(eventsList) {
    if (!eventSelect) return;

    eventSelect.innerHTML = '<option value="">-- Choose an Event to Attend --</option>' + 
      eventsList.map(event => {
        const isSoldOut = event.availableSeats === 0;
        const priceLabel = DateUtils.formatPrice(event.price);
        return `
          <option value="${event.id}" ${isSoldOut ? 'disabled' : ''}>
            ${DateUtils.escapeHtml(event.title)} (${DateUtils.formatDate(event.date)}) - ${priceLabel} ${isSoldOut ? '[SOLD OUT]' : `[${event.availableSeats} seats left]`}
          </option>
        `;
      }).join('');
  }

  /**
   * Update visual preview card of chosen event
   */
  function updateEventPreview() {
    if (!eventPreview || !eventSelect) return;
    const selectedId = eventSelect.value;

    if (!selectedId) {
      eventPreview.style.display = 'none';
      return;
    }

    const event = StorageService.getEventById(selectedId);
    if (!event) {
      eventPreview.style.display = 'none';
      return;
    }

    const { month, day } = DateUtils.formatMonthDay(event.date);
    const formattedPrice = DateUtils.formatPrice(event.price);
    const isSoldOut = event.availableSeats === 0;

    eventPreview.style.display = 'flex';
    eventPreview.innerHTML = `
      <img 
        class="selected-event-thumb" 
        src="${event.image}" 
        alt="${DateUtils.escapeHtml(event.title)}"
        onerror="this.onerror=null; this.src=DEFAULT_IMAGE_FALLBACK;"
      >
      <div style="flex-grow: 1;">
        <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.25rem;">
          <span class="badge badge-cat-${event.category}">${event.category}</span>
          <span class="text-xs text-muted font-semibold">${month} ${day}</span>
        </div>
        <h4 style="font-size: 1rem; margin-bottom: 0.25rem;">${DateUtils.escapeHtml(event.title)}</h4>
        <div style="font-size: 0.8rem; color: var(--color-text-secondary); display: flex; gap: 1rem;">
          <span>📍 ${DateUtils.escapeHtml(event.venue)}</span>
          <span>🎟️ ${formattedPrice}</span>
          <span style="color: ${isSoldOut ? 'var(--color-danger)' : 'var(--color-primary)'}; font-weight: 600;">
            ${isSoldOut ? 'Sold Out' : `${event.availableSeats} seats left`}
          </span>
        </div>
      </div>
    `;
  }

  /**
   * Render the digital ticket pass and confirmation view
   */
  function renderConfirmation(booking) {
    if (!formSection || !confirmationSection || !passContainer) return;

    formSection.style.display = 'none';
    confirmationSection.style.display = 'block';

    const formattedPrice = DateUtils.formatPrice(booking.eventPrice);

    passContainer.innerHTML = `
      <div class="ticket-pass" id="printable-ticket">
        <div class="ticket-pass-header">
          <div>
            <span class="badge badge-accent" style="background: rgba(255,255,255,0.25); color: #FFFFFF;">
              OFFICIAL ADMISSION PASS
            </span>
            <h3 style="color: #FFFFFF; font-size: 1.25rem; margin-top: 0.5rem;">
              ${DateUtils.escapeHtml(booking.eventTitle)}
            </h3>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.75rem; opacity: 0.8; text-transform: uppercase;">Pass Number</div>
            <strong style="font-size: 1.1rem; letter-spacing: 0.05em; font-family: monospace;">${booking.id}</strong>
          </div>
        </div>

        <div class="ticket-pass-body">
          <div class="ticket-pass-details">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div>
                <span class="ticket-field-label">Attendee Name</span>
                <div class="ticket-field-value">${DateUtils.escapeHtml(booking.userName)}</div>
              </div>
              <div>
                <span class="ticket-field-label">Contact Email</span>
                <div class="ticket-field-value" style="word-break: break-all;">${DateUtils.escapeHtml(booking.userEmail)}</div>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 0.5rem;">
              <div>
                <span class="ticket-field-label">Event Date & Time</span>
                <div class="ticket-field-value">${DateUtils.formatDate(booking.eventDate)}<br><small style="color: var(--color-text-muted); font-weight: normal;">${DateUtils.escapeHtml(booking.eventTime)}</small></div>
              </div>
              <div>
                <span class="ticket-field-label">Venue Location</span>
                <div class="ticket-field-value">${DateUtils.escapeHtml(booking.eventVenue)}</div>
              </div>
            </div>

            <div style="display: flex; gap: 1.5rem; margin-top: 0.5rem;">
              <div>
                <span class="ticket-field-label">Admissions</span>
                <div class="ticket-field-value">${booking.tickets} Ticket${booking.tickets > 1 ? 's' : ''}</div>
              </div>
              <div>
                <span class="ticket-field-label">Price Paid</span>
                <div class="ticket-field-value">${formattedPrice}</div>
              </div>
              <div>
                <span class="ticket-field-label">Status</span>
                <div><span class="badge badge-success">Confirmed</span></div>
              </div>
            </div>
          </div>

          <!-- QR Code Illustration Mockup -->
          <div class="ticket-qr-section">
            <svg class="ticket-qr-mockup" viewBox="0 0 100 100" fill="none" stroke="currentColor">
              <rect x="5" y="5" width="30" height="30" rx="3" fill="#191724"/>
              <rect x="11" y="11" width="18" height="18" rx="2" fill="#FFFFFF"/>
              <rect x="15" y="15" width="10" height="10" fill="#191724"/>
              
              <rect x="65" y="5" width="30" height="30" rx="3" fill="#191724"/>
              <rect x="71" y="11" width="18" height="18" rx="2" fill="#FFFFFF"/>
              <rect x="75" y="15" width="10" height="10" fill="#191724"/>

              <rect x="5" y="65" width="30" height="30" rx="3" fill="#191724"/>
              <rect x="11" y="71" width="18" height="18" rx="2" fill="#FFFFFF"/>
              <rect x="15" y="75" width="10" height="10" fill="#191724"/>

              <rect x="42" y="10" width="8" height="8" fill="#191724"/>
              <rect x="42" y="24" width="8" height="18" fill="#191724"/>
              <rect x="54" y="16" width="6" height="14" fill="#191724"/>

              <rect x="42" y="50" width="16" height="8" fill="#191724"/>
              <rect x="65" y="45" width="14" height="8" fill="#191724"/>
              <rect x="85" y="55" width="10" height="18" fill="#191724"/>
              <rect x="45" y="68" width="14" height="18" fill="#191724"/>
              <rect x="65" y="68" width="12" height="10" fill="#191724"/>
              <rect x="65" y="84" width="25" height="8" fill="#191724"/>
            </svg>
            <span style="font-size: 0.65rem; color: var(--color-text-muted); margin-top: 0.4rem; font-family: monospace;">
              SCAN AT ENTRY
            </span>
          </div>
        </div>

        <div class="ticket-pass-footer">
          <span class="text-xs text-muted">Present this digital pass or booking ID at registration.</span>
          <span class="text-xs" style="color: var(--color-primary); font-weight: 600;">Saved in LocalStorage</span>
        </div>
      </div>
    `;

    // Bind Print Button
    const printBtn = document.getElementById('print-ticket-btn');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // Scroll to confirmation view
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});
