/**
 * Gatherly - Homepage Controller (index.html)
 */

document.addEventListener('DOMContentLoaded', () => {
  const events = StorageService.getEvents();

  // 1. Render Featured Spotlight Event
  renderFeaturedEvent(events);

  // 2. Render Trending Events
  renderTrendingEvents(events);

  // 3. Render Upcoming Events
  renderUpcomingEvents(events);

  // 4. Bind Hero Search Form
  bindHeroSearch();
});

/**
 * Renders the primary featured event in the spotlight section
 */
function renderFeaturedEvent(events) {
  const container = document.getElementById('featured-event-container');
  if (!container) return;

  const featured = events.find(e => e.featured) || events[0];
  if (!featured) {
    container.innerHTML = '<p class="text-muted">No featured event currently highlighted.</p>';
    return;
  }

  const { month, day } = DateUtils.formatMonthDay(featured.date);
  const formattedPrice = DateUtils.formatPrice(featured.price);

  container.innerHTML = `
    <div class="featured-card">
      <div class="featured-media">
        <img 
          class="featured-img" 
          src="${featured.image}" 
          alt="${DateUtils.escapeHtml(featured.title)}"
          onerror="this.onerror=null; this.src=DEFAULT_IMAGE_FALLBACK;"
        >
        <div class="event-card-badge-top">
          <span class="badge badge-accent">Featured Spotlight</span>
        </div>
      </div>

      <div class="featured-content">
        <div class="featured-meta">
          <span class="badge badge-cat-${featured.category}">${featured.category}</span>
          <span class="text-xs text-muted font-semibold">• ${DateUtils.formatDate(featured.date)}</span>
        </div>

        <h3 class="featured-title">
          <a href="event-details.html?id=${encodeURIComponent(featured.id)}">
            ${DateUtils.escapeHtml(featured.title)}
          </a>
        </h3>

        <p class="featured-desc">
          ${DateUtils.escapeHtml(featured.tagline || featured.description.slice(0, 140) + '...')}
        </p>

        <div class="featured-details-grid">
          <div class="featured-detail-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <div>
              <strong>${DateUtils.escapeHtml(featured.city || 'Venue')}</strong>
              <div>${DateUtils.escapeHtml(featured.venue)}</div>
            </div>
          </div>
          <div class="featured-detail-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <div>
              <strong>${month} ${day}</strong>
              <div>${DateUtils.escapeHtml(featured.time)}</div>
            </div>
          </div>
        </div>

        <div class="featured-footer">
          <div>
            <span class="text-xs text-muted block">Admission Price</span>
            <span class="featured-price">${formattedPrice}</span>
          </div>
          <div class="flex items-center gap-2">
            <a href="event-details.html?id=${encodeURIComponent(featured.id)}" class="btn btn-secondary">
              Learn More
            </a>
            <a href="register.html?id=${encodeURIComponent(featured.id)}" class="btn btn-primary">
              Book Tickets
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders the top trending events
 */
function renderTrendingEvents(events) {
  const container = document.getElementById('trending-events-grid');
  if (!container) return;

  const trending = events.filter(e => e.trending).slice(0, 3);
  const displayEvents = trending.length > 0 ? trending : events.slice(0, 3);

  container.innerHTML = displayEvents.map(event => createEventCardHTML(event)).join('');
}

/**
 * Renders upcoming events
 */
function renderUpcomingEvents(events) {
  const container = document.getElementById('upcoming-events-grid');
  if (!container) return;

  // Sort by date ascending
  const sorted = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
  const upcoming = sorted.slice(0, 6);

  container.innerHTML = upcoming.map(event => createEventCardHTML(event)).join('');
}

/**
 * Wire hero search input & category selector
 */
function bindHeroSearch() {
  const form = document.getElementById('hero-search-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = document.getElementById('hero-search-query').value.trim();
    const category = document.getElementById('hero-search-category').value;

    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category && category !== 'all') params.set('cat', category);

    window.location.href = `events.html?${params.toString()}`;
  });
}
