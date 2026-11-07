/**
 * Gatherly - Admin Dashboard Controller (admin.html)
 * Live metrics, Event CRUD (Add/Edit/Delete), registration inspection, and sample reset
 */

document.addEventListener('DOMContentLoaded', () => {
  // Stats Elements
  const statTotalEvents = document.getElementById('stat-total-events');
  const statTotalRegistrations = document.getElementById('stat-total-registrations');
  const statActiveBookings = document.getElementById('stat-active-bookings');
  const statAvailableSeats = document.getElementById('stat-available-seats');

  // Tables
  const eventsTableBody = document.getElementById('admin-events-tbody');
  const bookingsTableBody = document.getElementById('admin-bookings-tbody');
  const eventsSearchInput = document.getElementById('admin-events-search');
  const bookingsSearchInput = document.getElementById('admin-bookings-search');

  // Modals & Forms
  const eventModal = document.getElementById('event-modal-backdrop');
  const eventModalTitle = document.getElementById('event-modal-title');
  const eventForm = document.getElementById('admin-event-form');
  const eventIdInput = document.getElementById('admin-event-id');
  const eventTitleInput = document.getElementById('admin-event-title');
  const eventCategoryInput = document.getElementById('admin-event-category');
  const eventDateInput = document.getElementById('admin-event-date');
  const eventTimeInput = document.getElementById('admin-event-time');
  const eventVenueInput = document.getElementById('admin-event-venue');
  const eventCityInput = document.getElementById('admin-event-city');
  const eventPriceInput = document.getElementById('admin-event-price');
  const eventSeatsInput = document.getElementById('admin-event-seats');
  const eventImageInput = document.getElementById('admin-event-image');
  const eventTaglineInput = document.getElementById('admin-event-tagline');
  const eventDescInput = document.getElementById('admin-event-desc');

  // Delete Modal
  const deleteModal = document.getElementById('delete-modal-backdrop');
  const deleteEventTitleSpan = document.getElementById('delete-event-title');
  const confirmDeleteBtn = document.getElementById('confirm-delete-event-btn');

  // Reset Button & Triggers
  const addEventBtn = document.getElementById('open-add-event-modal-btn');
  const resetDataBtn = document.getElementById('reset-sample-data-btn');
  const closeEventModalBtns = document.querySelectorAll('.close-event-modal');
  const closeDeleteModalBtns = document.querySelectorAll('.close-delete-modal');

  let activeDeleteEventId = null;

  // 1. Refresh Metrics & Stat Cards
  function refreshStats() {
    const events = StorageService.getEvents();
    const bookings = StorageService.getBookings();

    const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
    const totalSeats = events.reduce((acc, e) => acc + (Number(e.availableSeats) || 0), 0);

    if (statTotalEvents) statTotalEvents.textContent = events.length;
    if (statTotalRegistrations) statTotalRegistrations.textContent = bookings.length;
    if (statActiveBookings) statActiveBookings.textContent = confirmedBookings.length;
    if (statAvailableSeats) statAvailableSeats.textContent = totalSeats;
  }

  // 2. Render Events Table
  function renderEventsTable(query = '') {
    if (!eventsTableBody) return;
    const events = StorageService.getEvents();
    const q = query.toLowerCase().trim();

    const filtered = events.filter(e => 
      !q || 
      e.title.toLowerCase().includes(q) || 
      e.category.toLowerCase().includes(q) || 
      (e.city || '').toLowerCase().includes(q)
    );

    if (filtered.length === 0) {
      eventsTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 2.5rem; color: var(--color-text-muted);">
            No events found matching your search.
          </td>
        </tr>
      `;
      return;
    }

    eventsTableBody.innerHTML = filtered.map(event => {
      const formattedPrice = DateUtils.formatPrice(event.price);
      return `
        <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <img 
                src="${event.image}" 
                alt="" 
                style="width: 44px; height: 44px; border-radius: 8px; object-fit: cover; background: var(--color-surface-sunken);"
                onerror="this.onerror=null; this.src=DEFAULT_IMAGE_FALLBACK;"
              >
              <div>
                <a href="event-details.html?id=${encodeURIComponent(event.id)}" target="_blank" style="font-weight: 600; color: var(--color-text); display: block;" title="Preview Event">
                  ${DateUtils.escapeHtml(event.title)}
                </a>
                <span class="text-xs text-muted">${DateUtils.escapeHtml(event.city || 'Global')}</span>
              </div>
            </div>
          </td>
          <td>
            <span class="badge badge-cat-${event.category}">
              ${event.category}
            </span>
          </td>
          <td>
            <div style="font-weight: 500;">${DateUtils.formatDate(event.date)}</div>
            <div class="text-xs text-muted">${DateUtils.escapeHtml(event.time || '')}</div>
          </td>
          <td>
            <strong style="color: var(--color-text);">${formattedPrice}</strong>
          </td>
          <td>
            <span class="badge ${event.availableSeats <= 10 ? 'badge-warning' : 'badge-neutral'}">
              ${event.availableSeats} / ${event.totalSeats || 100}
            </span>
          </td>
          <td>
            ${event.trending ? '<span class="badge badge-accent">Trending</span>' : '<span class="text-xs text-muted">Standard</span>'}
          </td>
          <td>
            <div class="table-actions">
              <button class="btn btn-secondary btn-sm edit-event-btn" data-id="${event.id}" title="Edit Event">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Edit
              </button>
              <button class="btn btn-danger btn-sm delete-event-btn" data-id="${event.id}" data-title="${DateUtils.escapeHtml(event.title)}" title="Delete Event">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Bind Edit Buttons
    document.querySelectorAll('.edit-event-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openEditEventModal(id);
      });
    });

    // Bind Delete Buttons
    document.querySelectorAll('.delete-event-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const title = btn.getAttribute('data-title');
        openDeleteModal(id, title);
      });
    });
  }

  // 3. Render Bookings Table
  function renderBookingsTable(query = '') {
    if (!bookingsTableBody) return;
    const bookings = StorageService.getBookings();
    const q = query.toLowerCase().trim();

    const filtered = bookings.filter(b => 
      !q || 
      b.id.toLowerCase().includes(q) || 
      b.userName.toLowerCase().includes(q) || 
      b.userEmail.toLowerCase().includes(q) || 
      b.eventTitle.toLowerCase().includes(q)
    );

    if (filtered.length === 0) {
      bookingsTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 2.5rem; color: var(--color-text-muted);">
            No attendee registrations found.
          </td>
        </tr>
      `;
      return;
    }

    bookingsTableBody.innerHTML = filtered.map(b => {
      const isCancelled = b.status === 'cancelled';
      const formattedPrice = DateUtils.formatPrice(b.eventPrice);

      return `
        <tr>
          <td>
            <strong style="font-family: monospace; font-size: 0.85rem;">${b.id}</strong>
            <div class="text-xs text-muted">${new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
          </td>
          <td>
            <div style="font-weight: 600; color: var(--color-text);">${DateUtils.escapeHtml(b.userName)}</div>
            <div class="text-xs text-muted">${DateUtils.escapeHtml(b.userEmail)}</div>
          </td>
          <td>
            <div style="font-weight: 500;">${DateUtils.escapeHtml(b.eventTitle)}</div>
            <div class="text-xs text-muted">${DateUtils.formatDate(b.eventDate)}</div>
          </td>
          <td>
            <span>${b.tickets || 1} pass • ${formattedPrice}</span>
          </td>
          <td>
            <span class="badge ${isCancelled ? 'badge-danger' : 'badge-success'}">
              ${isCancelled ? 'Cancelled' : 'Confirmed'}
            </span>
          </td>
          <td>
            <div class="text-xs">${DateUtils.escapeHtml(b.userPhone || '—')}</div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // 4. Modal Handlers: Add / Edit Event
  function openAddEventModal() {
    if (eventForm) eventForm.reset();
    if (eventIdInput) eventIdInput.value = '';
    if (eventModalTitle) eventModalTitle.textContent = 'Add New Event';
    if (eventModal) eventModal.classList.add('is-open');
  }

  function openEditEventModal(id) {
    const event = StorageService.getEventById(id);
    if (!event) return;

    if (eventIdInput) eventIdInput.value = event.id;
    if (eventTitleInput) eventTitleInput.value = event.title || '';
    if (eventCategoryInput) eventCategoryInput.value = (event.category || 'technology').toLowerCase();
    if (eventDateInput) eventDateInput.value = event.date || '';
    if (eventTimeInput) eventTimeInput.value = event.time || '';
    if (eventVenueInput) eventVenueInput.value = event.venue || '';
    if (eventCityInput) eventCityInput.value = event.city || '';
    if (eventPriceInput) eventPriceInput.value = event.price !== undefined ? event.price : 0;
    if (eventSeatsInput) eventSeatsInput.value = event.totalSeats || 100;
    if (eventImageInput) eventImageInput.value = event.image || '';
    if (eventTaglineInput) eventTaglineInput.value = event.tagline || '';
    if (eventDescInput) eventDescInput.value = event.description || '';

    if (eventModalTitle) eventModalTitle.textContent = 'Edit Event Details';
    if (eventModal) eventModal.classList.add('is-open');
  }

  function closeEventModal() {
    if (eventModal) eventModal.classList.remove('is-open');
  }

  // 5. Modal Handlers: Delete Event
  function openDeleteModal(id, title) {
    activeDeleteEventId = id;
    if (deleteEventTitleSpan) deleteEventTitleSpan.textContent = title;
    if (deleteModal) deleteModal.classList.add('is-open');
  }

  function closeDeleteModal() {
    activeDeleteEventId = null;
    if (deleteModal) deleteModal.classList.remove('is-open');
  }

  // Bind Openers & Closers
  if (addEventBtn) addEventBtn.addEventListener('click', openAddEventModal);

  closeEventModalBtns.forEach(btn => btn.addEventListener('click', closeEventModal));
  closeDeleteModalBtns.forEach(btn => btn.addEventListener('click', closeDeleteModal));

  if (eventModal) {
    eventModal.addEventListener('click', (e) => {
      if (e.target === eventModal) closeEventModal();
    });
  }

  if (deleteModal) {
    deleteModal.addEventListener('click', (e) => {
      if (e.target === deleteModal) closeDeleteModal();
    });
  }

  // 6. Handle Event Form Submission (Add or Update)
  if (eventForm) {
    eventForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = eventTitleInput.value.trim();
      const category = eventCategoryInput.value;
      const date = eventDateInput.value;
      const time = eventTimeInput.value.trim();
      const venue = eventVenueInput.value.trim();
      const city = eventCityInput.value.trim();
      const price = Number(eventPriceInput.value) || 0;
      const totalSeats = Number(eventSeatsInput.value) || 100;
      let image = eventImageInput.value.trim();
      const tagline = eventTaglineInput.value.trim();
      const description = eventDescInput.value.trim();
      const id = eventIdInput.value;

      if (!title || !category || !date || !time || !venue || !description) {
        Toast.error('Please complete all required fields.', 'Validation Failed');
        return;
      }

      if (!image) {
        image = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80';
      }

      const existingEvent = id ? StorageService.getEventById(id) : null;
      const availableSeats = existingEvent 
        ? Math.min(totalSeats, existingEvent.availableSeats + (totalSeats - (existingEvent.totalSeats || totalSeats)))
        : totalSeats;

      const eventPayload = {
        id: id || undefined,
        title,
        category,
        date,
        time,
        venue,
        city,
        price,
        totalSeats,
        availableSeats: Math.max(0, availableSeats),
        image,
        tagline,
        description,
        featured: existingEvent ? existingEvent.featured : false,
        trending: existingEvent ? existingEvent.trending : false,
        organizer: existingEvent ? existingEvent.organizer : {
          name: 'Gatherly Event Studio',
          email: 'events@gatherly.io',
          role: 'Platform Host',
          avatar: 'GS'
        },
        agenda: existingEvent?.agenda || [
          { time: '10:00 AM', title: 'Registration & Welcome', desc: 'Badge pickup and morning mixer.' },
          { time: '11:00 AM', title: 'Main Session Presentation', desc: 'Keynote and core presentations.' },
          { time: '02:00 PM', title: 'Networking & Workshops', desc: 'Interactive breakouts and wrap-up.' }
        ]
      };

      StorageService.saveEvent(eventPayload);
      closeEventModal();
      Toast.success(id ? 'Event updated successfully!' : 'New event published successfully!', 'Saved');
      
      refreshStats();
      renderEventsTable(eventsSearchInput ? eventsSearchInput.value : '');
    });
  }

  // 7. Handle Delete Confirmation
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', () => {
      if (!activeDeleteEventId) return;

      StorageService.deleteEvent(activeDeleteEventId);
      closeDeleteModal();
      Toast.success('Event was successfully deleted.', 'Event Removed');

      refreshStats();
      renderEventsTable(eventsSearchInput ? eventsSearchInput.value : '');
    });
  }

  // 8. Handle Reset to Sample Data
  if (resetDataBtn) {
    resetDataBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to restore the original 10 sample events and reset bookings?')) {
        StorageService.resetToSampleData();
        Toast.success('Sample events and demo data restored!', 'Reset Completed');
        refreshStats();
        renderEventsTable();
        renderBookingsTable();
      }
    });
  }

  // 9. Table Search Filters
  if (eventsSearchInput) {
    eventsSearchInput.addEventListener('input', (e) => {
      renderEventsTable(e.target.value);
    });
  }

  if (bookingsSearchInput) {
    bookingsSearchInput.addEventListener('input', (e) => {
      renderBookingsTable(e.target.value);
    });
  }

  // Initial Data Load
  refreshStats();
  renderEventsTable();
  renderBookingsTable();
});
