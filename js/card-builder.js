/**
 * Gatherly - Event Card Component Builder
 * Generates unified, accessible, and resilient event cards
 */

function createEventCardHTML(event) {
  const { month, day } = DateUtils.formatMonthDay(event.date);
  const formattedPrice = DateUtils.formatPrice(event.price);
  const isFree = event.price === 0 || event.price === '0';
  const categoryBadgeClass = `badge-cat-${(event.category || 'technology').toLowerCase()}`;

  // Seat status
  let seatBadge = '';
  if (event.availableSeats === 0) {
    seatBadge = `<span class="seats-pill soldout">Sold Out</span>`;
  } else if (event.availableSeats <= 15) {
    seatBadge = `<span class="seats-pill low">${event.availableSeats} seats left!</span>`;
  } else {
    seatBadge = `<span class="seats-pill">${event.availableSeats} seats available</span>`;
  }

  const safeTitle = DateUtils.escapeHtml(event.title);
  const safeTagline = DateUtils.escapeHtml(event.tagline || event.description?.slice(0, 90) + '...');
  const safeVenue = DateUtils.escapeHtml(event.venue);
  const safeCity = DateUtils.escapeHtml(event.city || '');

  return `
    <article class="event-card" data-event-id="${event.id}">
      <div class="event-card-media">
        <img 
          class="event-card-img" 
          src="${event.image}" 
          alt="${safeTitle}" 
          loading="lazy"
          onerror="this.onerror=null; this.src=DEFAULT_IMAGE_FALLBACK;"
        >
        <div class="event-card-badge-top">
          <span class="badge ${categoryBadgeClass}">
            ${event.category || 'Event'}
          </span>
        </div>
        <div class="event-card-price ${isFree ? 'free' : ''}">
          ${formattedPrice}
        </div>
      </div>

      <div class="event-card-content">
        <div class="event-card-meta">
          <span>${month} ${day}</span>
          <span>•</span>
          <span>${DateUtils.escapeHtml(event.time ? event.time.split('-')[0].trim() : '')}</span>
        </div>

        <h3 class="event-card-title">
          <a href="event-details.html?id=${encodeURIComponent(event.id)}" title="${safeTitle}">
            ${safeTitle}
          </a>
        </h3>

        <p class="event-card-desc">
          ${safeTagline}
        </p>

        <div class="event-card-info-list">
          <div class="event-card-info-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>${safeVenue}${safeCity ? `, ${safeCity}` : ''}</span>
          </div>
          <div class="event-card-info-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>${DateUtils.formatDate(event.date)}</span>
          </div>
        </div>

        <div class="event-card-footer">
          ${seatBadge}
          <a href="event-details.html?id=${encodeURIComponent(event.id)}" class="btn btn-primary btn-sm">
            View Details
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>
    </article>
  `;
}
