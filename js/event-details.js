/**
 * Gatherly - Event Details Controller (event-details.html)
 * URL ID resolution, live countdown timer, interactive agenda, seat tracker, and share controls
 */

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('id');

  const mainContainer = document.getElementById('event-details-root');
  if (!mainContainer) return;

  if (!eventId) {
    showNotFound(mainContainer, 'No event was selected.');
    return;
  }

  const event = StorageService.getEventById(eventId);
  if (!event) {
    showNotFound(mainContainer, `We could not find an event with ID "${eventId}". It may have been removed.`);
    return;
  }

  // Update page title
  document.title = `${event.title} – Gatherly`;

  // Render Full Details Page
  renderEventDetails(mainContainer, event);

  // Initialize Countdown Timer
  initCountdownTimer(event.date);

  // Bind Share Button
  bindShareButton(event);

  // Render Related Events
  renderRelatedEvents(event);
});

/**
 * Renders the full event details layout
 */
function renderEventDetails(container, event) {
  const { month, day } = DateUtils.formatMonthDay(event.date);
  const formattedPrice = DateUtils.formatPrice(event.price);
  const isFree = event.price === 0 || event.price === '0';
  const categoryBadgeClass = `badge-cat-${(event.category || 'technology').toLowerCase()}`;

  // Calculate percentage of seats remaining
  const total = event.totalSeats || 100;
  const available = event.availableSeats !== undefined ? event.availableSeats : total;
  const percentLeft = Math.round((available / total) * 100);
  const isSoldOut = available === 0;

  // Build agenda items
  let agendaHTML = '';
  if (event.agenda && event.agenda.length > 0) {
    agendaHTML = `
      <section class="details-section">
        <h2 class="details-heading">Event Schedule & Agenda</h2>
        <div class="agenda-list">
          ${event.agenda.map(item => `
            <div class="agenda-item">
              <div class="agenda-time">${DateUtils.escapeHtml(item.time)}</div>
              <div>
                <h4 class="agenda-title">${DateUtils.escapeHtml(item.title)}</h4>
                <p class="agenda-desc">${DateUtils.escapeHtml(item.desc)}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  container.innerHTML = `
    <!-- Breadcrumb -->
    <nav class="container" style="padding-top: 1.5rem; padding-bottom: 1rem;" aria-label="Breadcrumb">
      <div style="font-size: 0.85rem; color: var(--color-text-muted); display: flex; align-items: center; gap: 0.5rem;">
        <a href="index.html" class="nav-link" style="padding: 0;">Home</a>
        <span>/</span>
        <a href="events.html" class="nav-link" style="padding: 0;">Events</a>
        <span>/</span>
        <span style="color: var(--color-text); font-weight: 500;">${DateUtils.escapeHtml(event.title)}</span>
      </div>
    </nav>

    <div class="container">
      <!-- Big Hero Visual Banner -->
      <div class="event-header-banner">
        <img 
          class="event-banner-img" 
          src="${event.image}" 
          alt="${DateUtils.escapeHtml(event.title)}"
          onerror="this.onerror=null; this.src=DEFAULT_IMAGE_FALLBACK;"
        >
        <div class="event-banner-overlay">
          <div>
            <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
              <span class="badge ${categoryBadgeClass}">
                ${DateUtils.escapeHtml(event.category)}
              </span>
              ${event.trending ? '<span class="badge badge-accent">🔥 Trending</span>' : ''}
            </div>
            <h1 style="font-size: clamp(1.75rem, 4vw, 2.75rem); color: #FFFFFF; text-shadow: 0 2px 10px rgba(0,0,0,0.5);">
              ${DateUtils.escapeHtml(event.title)}
            </h1>
          </div>
        </div>
      </div>

      <!-- Main 2-Column Content Layout -->
      <div class="details-layout">
        <!-- Left: Full Description, Agenda, Venue, Organizer -->
        <div class="details-main">
          <!-- Overview Section -->
          <section class="details-section">
            <h2 class="details-heading">About This Event</h2>
            <p class="lead" style="margin-bottom: 1.5rem; white-space: pre-line;">
              ${DateUtils.escapeHtml(event.description)}
            </p>

            <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1.5rem;">
              <span class="badge badge-neutral" style="padding: 0.4rem 0.85rem;">
                📍 ${DateUtils.escapeHtml(event.city || 'Global')}
              </span>
              <span class="badge badge-neutral" style="padding: 0.4rem 0.85rem;">
                🎟️ Verified Admission
              </span>
              <span class="badge badge-neutral" style="padding: 0.4rem 0.85rem;">
                ⚡ Direct Access Pass
              </span>
            </div>
          </section>

          <!-- Agenda Section -->
          ${agendaHTML}

          <!-- Venue & Location Section -->
          <section class="details-section">
            <h2 class="details-heading">Location & Venue</h2>
            <div style="background-color: var(--color-surface-sunken); padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--color-border); display: flex; gap: 1rem; align-items: flex-start;">
              <div style="width: 44px; height: 44px; border-radius: 12px; background: var(--color-primary-light); color: var(--color-primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div>
                <h4 style="margin-bottom: 0.25rem;">${DateUtils.escapeHtml(event.venue)}</h4>
                <p style="font-size: 0.9rem; color: var(--color-text-secondary); margin-bottom: 0.75rem;">
                  ${DateUtils.escapeHtml(event.address || `${event.venue}, ${event.city}`)}
                </p>
                <a href="https://maps.google.com/?q=${encodeURIComponent(event.address || event.venue)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
                  <span>Open in Maps</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
                </a>
              </div>
            </div>
          </section>

          <!-- Organizer Section -->
          <section class="details-section">
            <h2 class="details-heading">Hosted by Organizer</h2>
            <div class="organizer-card" style="margin-top: 0; padding-top: 0; border-top: none;">
              <div class="organizer-avatar">
                ${DateUtils.escapeHtml(event.organizer?.avatar || event.organizer?.name?.substring(0, 2).toUpperCase() || 'GL')}
              </div>
              <div>
                <h4 style="margin-bottom: 0.2rem;">${DateUtils.escapeHtml(event.organizer?.name || 'Gatherly Verified Host')}</h4>
                <p style="font-size: 0.85rem; color: var(--color-text-muted);">
                  ${DateUtils.escapeHtml(event.organizer?.role || 'Event Organizer')} • <a href="mailto:${DateUtils.escapeHtml(event.organizer?.email || 'contact@gatherly.io')}" style="color: var(--color-primary);">${DateUtils.escapeHtml(event.organizer?.email || 'Contact Host')}</a>
                </p>
              </div>
            </div>
          </section>
        </div>

        <!-- Right: Sticky Ticket Booking Widget -->
        <aside class="details-sidebar" aria-label="Ticket reservation details">
          <!-- Live Countdown Box -->
          <div style="margin-bottom: 1.5rem;">
            <span class="text-xs text-muted" style="font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 0.5rem;">
              Event Starts In
            </span>
            <div id="event-countdown-container" class="countdown-box w-full" style="justify-content: center;">
              <!-- Populated by countdown interval -->
            </div>
          </div>

          <!-- Price & Ticket Status -->
          <div class="sidebar-price-row">
            <div>
              <span class="text-xs text-muted" style="display: block;">Registration Fee</span>
              <div class="sidebar-price">${formattedPrice}</div>
            </div>
            <div>
              ${isFree ? '<span class="badge badge-success">Free Entry</span>' : '<span class="badge badge-primary">Guaranteed Seat</span>'}
            </div>
          </div>

          <!-- Seat Capacity Gauge -->
          <div style="margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.25rem;">
              <span style="font-weight: 600;">Seat Capacity</span>
              <span style="color: ${isSoldOut ? 'var(--color-danger)' : 'var(--color-primary)'}; font-weight: 700;">
                ${isSoldOut ? 'SOLD OUT' : `${available} of ${total} left`}
              </span>
            </div>
            <div class="seats-progress-bar">
              <div class="seats-progress-fill" style="width: ${percentLeft}%;"></div>
            </div>
            <p class="text-xs text-muted">
              ${isSoldOut ? 'Join the waitlist or check other events.' : 'Spots are reserved in real time upon successful submission.'}
            </p>
          </div>

          <!-- Date & Time Info Box -->
          <div style="background-color: var(--color-surface-sunken); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.85rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-primary); flex-shrink: 0;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <div>
                <strong>${DateUtils.formatDate(event.date)}</strong>
                <div style="color: var(--color-text-secondary);">${DateUtils.escapeHtml(event.time)}</div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-primary); flex-shrink: 0;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <div>
                <strong>${DateUtils.escapeHtml(event.venue)}</strong>
                <div style="color: var(--color-text-secondary);">${DateUtils.escapeHtml(event.city || '')}</div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <a 
              href="register.html?id=${encodeURIComponent(event.id)}" 
              class="btn btn-primary btn-lg w-full ${isSoldOut ? 'disabled' : ''}"
              ${isSoldOut ? 'aria-disabled="true" style="pointer-events: none; opacity: 0.5;"' : ''}
            >
              ${isSoldOut ? 'Event Sold Out' : 'Register for Event'}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>

            <button id="share-event-btn" class="btn btn-secondary w-full">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              <span>Share Event Link</span>
            </button>
          </div>
        </aside>
      </div>

      <!-- Related Events Section -->
      <section style="margin-top: 4rem; padding-top: 3rem; border-top: 1px solid var(--color-border);">
        <div class="section-header">
          <span class="section-eyebrow">More to Explore</span>
          <h2 class="section-title">Similar Experiences</h2>
        </div>
        <div id="related-events-grid" class="events-grid">
          <!-- Rendered dynamically -->
        </div>
      </section>
    </div>
  `;
}

/**
 * Live Countdown Timer
 */
function initCountdownTimer(targetDateStr) {
  const container = document.getElementById('event-countdown-container');
  if (!container) return;

  const targetDate = new Date(targetDateStr);
  // Default to 10:00 AM on the target date if only date string is provided
  targetDate.setHours(10, 0, 0, 0);

  function update() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      container.innerHTML = `
        <div style="font-weight: 700; color: var(--color-success); font-size: 1.1rem; text-align: center; width: 100%;">
          🎉 Event is Live Now!
        </div>
      `;
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    container.innerHTML = `
      <div class="countdown-unit">
        <span class="countdown-num">${String(days).padStart(2, '0')}</span>
        <span class="countdown-label">Days</span>
      </div>
      <span class="countdown-sep">:</span>
      <div class="countdown-unit">
        <span class="countdown-num">${String(hours).padStart(2, '0')}</span>
        <span class="countdown-label">Hours</span>
      </div>
      <span class="countdown-sep">:</span>
      <div class="countdown-unit">
        <span class="countdown-num">${String(minutes).padStart(2, '0')}</span>
        <span class="countdown-label">Mins</span>
      </div>
      <span class="countdown-sep">:</span>
      <div class="countdown-unit">
        <span class="countdown-num">${String(seconds).padStart(2, '0')}</span>
        <span class="countdown-label">Secs</span>
      </div>
    `;
  }

  update();
  const timer = setInterval(update, 1000);

  // Clear timer when leaving page
  window.addEventListener('beforeunload', () => clearInterval(timer));
}

/**
 * Share Link to Clipboard
 */
function bindShareButton(event) {
  const btn = document.getElementById('share-event-btn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    const shareUrl = window.location.href;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        Toast.success('Event link copied to clipboard!', 'Link Shared');
      } else {
        // Fallback for older browsers
        const temp = document.createElement('input');
        temp.value = shareUrl;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        Toast.success('Event link copied to clipboard!', 'Link Shared');
      }
    } catch {
      Toast.info(`Share this link: ${shareUrl}`, 'Event URL');
    }
  });
}

/**
 * Render Related Events
 */
function renderRelatedEvents(currentEvent) {
  const container = document.getElementById('related-events-grid');
  if (!container) return;

  const all = StorageService.getEvents();
  const related = all
    .filter(e => e.id !== currentEvent.id && (e.category === currentEvent.category || e.trending))
    .slice(0, 3);

  if (related.length === 0) {
    container.innerHTML = '<p class="text-muted">No related events found at this time.</p>';
    return;
  }

  container.innerHTML = related.map(e => createEventCardHTML(e)).join('');
}

/**
 * Display 404 not found message
 */
function showNotFound(container, message) {
  container.innerHTML = `
    <div class="container section">
      <div class="empty-state" style="max-width: 580px; margin: 3rem auto;">
        <div class="empty-state-icon" style="background-color: var(--color-danger-bg); color: var(--color-danger);">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h2 class="empty-state-title">Event Not Found</h2>
        <p class="empty-state-desc">${DateUtils.escapeHtml(message)}</p>
        <a href="events.html" class="btn btn-primary">
          Back to Explore Events
        </a>
      </div>
    </div>
  `;
}
