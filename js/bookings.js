/**
 * Gatherly - My Bookings Controller (bookings.html)
 * Displays user registrations, ticket pass rendering, cancellation modal & seat restoration
 */

document.addEventListener('DOMContentLoaded', () => {
  const bookingsContainer = document.getElementById('bookings-list-container');
  const emptyState = document.getElementById('bookings-empty-state');
  const modalBackdrop = document.getElementById('cancel-modal-backdrop');
  const modalConfirmBtn = document.getElementById('confirm-cancel-btn');
  const modalDismissBtns = document.querySelectorAll('.close-cancel-modal');
  const modalBookingTitle = document.getElementById('cancel-modal-event-title');
  const modalBookingId = document.getElementById('cancel-modal-booking-id');

  let activeBookingIdToCancel = null;

  function renderBookings() {
    const bookings = StorageService.getBookings();

    if (!bookings || bookings.length === 0) {
      if (bookingsContainer) bookingsContainer.innerHTML = '';
      if (emptyState) emptyState.style.display = 'flex';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    if (bookingsContainer) {
      bookingsContainer.innerHTML = bookings.map(booking => {
        const isCancelled = booking.status === 'cancelled';
        const formattedPrice = DateUtils.formatPrice(booking.eventPrice);

        return `
          <div class="ticket-pass" data-booking-id="${booking.id}" style="${isCancelled ? 'opacity: 0.65;' : ''}">
            <div class="ticket-pass-header" style="${isCancelled ? 'background: #667085;' : ''}">
              <div>
                <span class="badge ${isCancelled ? 'badge-danger' : 'badge-accent'}" style="background: rgba(255,255,255,0.25); color: #FFFFFF;">
                  ${isCancelled ? 'REGISTRATION CANCELLED' : 'CONFIRMED ADMISSION'}
                </span>
                <h3 style="color: #FFFFFF; font-size: 1.25rem; margin-top: 0.5rem;">
                  <a href="event-details.html?id=${encodeURIComponent(booking.eventId)}" style="color: #FFFFFF; text-decoration: underline; text-underline-offset: 3px;">
                    ${DateUtils.escapeHtml(booking.eventTitle)}
                  </a>
                </h3>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 0.75rem; opacity: 0.8; text-transform: uppercase;">Registration ID</div>
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
                    <span class="ticket-field-label">Registered Email</span>
                    <div class="ticket-field-value" style="word-break: break-all;">${DateUtils.escapeHtml(booking.userEmail)}</div>
                  </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 0.5rem;">
                  <div>
                    <span class="ticket-field-label">Date & Time</span>
                    <div class="ticket-field-value">${DateUtils.formatDate(booking.eventDate)}<br><small style="color: var(--color-text-muted); font-weight: normal;">${DateUtils.escapeHtml(booking.eventTime)}</small></div>
                  </div>
                  <div>
                    <span class="ticket-field-label">Venue</span>
                    <div class="ticket-field-value">${DateUtils.escapeHtml(booking.eventVenue)}</div>
                  </div>
                </div>

                <div style="display: flex; gap: 1.5rem; margin-top: 0.5rem; align-items: center;">
                  <div>
                    <span class="ticket-field-label">Admissions</span>
                    <div class="ticket-field-value">${booking.tickets || 1} Ticket${(booking.tickets || 1) > 1 ? 'es' : ''}</div>
                  </div>
                  <div>
                    <span class="ticket-field-label">Tier / Price</span>
                    <div class="ticket-field-value">${formattedPrice}</div>
                  </div>
                  <div>
                    <span class="ticket-field-label">Status</span>
                    <div>
                      <span class="badge ${isCancelled ? 'badge-danger' : 'badge-success'}">
                        ${isCancelled ? 'Cancelled' : 'Confirmed'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- QR Code Mockup -->
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
                </svg>
                <span style="font-size: 0.65rem; color: var(--color-text-muted); margin-top: 0.4rem; font-family: monospace;">
                  ${isCancelled ? 'VOID / INACTIVE' : 'FAST-PASS CODE'}
                </span>
              </div>
            </div>

            <div class="ticket-pass-footer">
              <span class="text-xs text-muted">
                Booked on ${new Date(booking.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <div class="flex items-center gap-2">
                ${!isCancelled ? `
                  <button class="btn btn-secondary btn-sm print-pass-btn" data-id="${booking.id}">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                    Print
                  </button>
                  <button class="btn btn-danger btn-sm cancel-booking-btn" data-id="${booking.id}" data-title="${DateUtils.escapeHtml(booking.eventTitle)}">
                    Cancel Pass
                  </button>
                ` : `
                  <span class="text-xs text-muted" style="font-style: italic;">Seats released to public pool</span>
                `}
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Bind cancellation buttons
    document.querySelectorAll('.cancel-booking-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const title = btn.getAttribute('data-title');
        openCancelModal(id, title);
      });
    });

    // Bind individual print buttons
    document.querySelectorAll('.print-pass-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.print();
      });
    });
  }

  // Open Cancel Modal
  function openCancelModal(bookingId, eventTitle) {
    activeBookingIdToCancel = bookingId;
    if (modalBookingTitle) modalBookingTitle.textContent = eventTitle;
    if (modalBookingId) modalBookingId.textContent = bookingId;
    if (modalBackdrop) modalBackdrop.classList.add('is-open');
  }

  // Close Cancel Modal
  function closeCancelModal() {
    activeBookingIdToCancel = null;
    if (modalBackdrop) modalBackdrop.classList.remove('is-open');
  }

  modalDismissBtns.forEach(btn => {
    btn.addEventListener('click', closeCancelModal);
  });

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeCancelModal();
    });
  }

  // Confirm Cancellation
  if (modalConfirmBtn) {
    modalConfirmBtn.addEventListener('click', () => {
      if (!activeBookingIdToCancel) return;

      const result = StorageService.cancelBooking(activeBookingIdToCancel);
      closeCancelModal();

      if (result.success) {
        Toast.success(result.message, 'Registration Cancelled');
        renderBookings();
      } else {
        Toast.error(result.error, 'Cancellation Error');
      }
    });
  }

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('is-open')) {
      closeCancelModal();
    }
  });

  // Initial render
  renderBookings();
});
