/**
 * Gatherly - Explore Events Controller (events.html)
 * Dynamic filtering, real-time search, sorting, URL state sync, and empty states
 */

document.addEventListener('DOMContentLoaded', () => {
  const state = {
    searchQuery: '',
    category: 'all',
    dateFilter: 'all',
    priceFilter: 'all',
    sortBy: 'date-asc'
  };

  // DOM Elements
  const searchInput = document.getElementById('events-search-input');
  const categoryFilters = document.querySelectorAll('.cat-filter-btn');
  const dateSelect = document.getElementById('date-filter-select');
  const priceSelect = document.getElementById('price-filter-select');
  const sortSelect = document.getElementById('sort-select');
  const eventsGrid = document.getElementById('explore-events-grid');
  const countLabel = document.getElementById('results-count-label');
  const clearFiltersBtn = document.getElementById('clear-filters-btn');
  const activeFiltersStrip = document.getElementById('active-filters-strip');

  // Read URL query parameters (e.g., ?q=AI&cat=technology)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('q')) {
    state.searchQuery = urlParams.get('q');
    if (searchInput) searchInput.value = state.searchQuery;
  }
  if (urlParams.has('cat')) {
    state.category = urlParams.get('cat').toLowerCase();
  }

  // Update category buttons active state
  function updateCategoryButtons() {
    categoryFilters.forEach(btn => {
      const cat = btn.getAttribute('data-category');
      if (cat === state.category) {
        btn.classList.add('is-active');
      } else {
        btn.classList.remove('is-active');
      }
    });
  }

  // Filter & Sort Logic
  function applyFilters() {
    const allEvents = StorageService.getEvents();
    const now = new Date();

    const filtered = allEvents.filter(event => {
      // 1. Text Search (title, tagline, venue, city)
      if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(q);
        const matchesTagline = (event.tagline || '').toLowerCase().includes(q);
        const matchesDesc = (event.description || '').toLowerCase().includes(q);
        const matchesVenue = (event.venue || '').toLowerCase().includes(q);
        const matchesCity = (event.city || '').toLowerCase().includes(q);

        if (!matchesTitle && !matchesTagline && !matchesDesc && !matchesVenue && !matchesCity) {
          return false;
        }
      }

      // 2. Category Filter
      if (state.category !== 'all') {
        if ((event.category || '').toLowerCase() !== state.category) {
          return false;
        }
      }

      // 3. Date Filter
      if (state.dateFilter !== 'all') {
        const eventDate = new Date(event.date);
        const diffDays = Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24));

        if (state.dateFilter === 'weekend') {
          // Check if event is on Sat or Sun
          const day = eventDate.getDay();
          if (day !== 0 && day !== 6) return false;
        } else if (state.dateFilter === 'next30') {
          if (diffDays < 0 || diffDays > 30) return false;
        } else if (state.dateFilter === 'future') {
          if (diffDays < 0) return false;
        }
      }

      // 4. Price Filter
      if (state.priceFilter !== 'all') {
        const isFree = event.price === 0 || event.price === '0';
        if (state.priceFilter === 'free' && !isFree) return false;
        if (state.priceFilter === 'paid' && isFree) return false;
      }

      return true;
    });

    // 5. Sorting
    filtered.sort((a, b) => {
      if (state.sortBy === 'date-asc') {
        return new Date(a.date) - new Date(b.date);
      } else if (state.sortBy === 'date-desc') {
        return new Date(b.date) - new Date(a.date);
      } else if (state.sortBy === 'price-asc') {
        return (Number(a.price) || 0) - (Number(b.price) || 0);
      } else if (state.sortBy === 'price-desc') {
        return (Number(b.price) || 0) - (Number(a.price) || 0);
      } else if (state.sortBy === 'title-asc') {
        return a.title.localeCompare(b.title);
      } else if (state.sortBy === 'seats-desc') {
        return (b.availableSeats || 0) - (a.availableSeats || 0);
      }
      return 0;
    });

    renderEvents(filtered, allEvents.length);
    renderActiveFilterTags();
  }

  // Render Grid or Empty State
  function renderEvents(items, totalCount) {
    if (!eventsGrid) return;

    if (countLabel) {
      countLabel.textContent = `Showing ${items.length} of ${totalCount} events`;
    }

    if (items.length === 0) {
      eventsGrid.innerHTML = `
        <div style="grid-column: 1 / -1;">
          <div class="empty-state">
            <div class="empty-state-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </div>
            <h3 class="empty-state-title">No matching events found</h3>
            <p class="empty-state-desc">
              We couldn't find any events matching your current filters. Try searching for a different keyword or resetting your criteria.
            </p>
            <button id="empty-state-reset-btn" class="btn btn-primary">
              Clear All Filters
            </button>
          </div>
        </div>
      `;

      const resetBtn = document.getElementById('empty-state-reset-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
      }
      return;
    }

    eventsGrid.innerHTML = items.map(event => createEventCardHTML(event)).join('');
  }

  // Active filter tags strip
  function renderActiveFilterTags() {
    if (!activeFiltersStrip) return;

    const tags = [];
    if (state.searchQuery) {
      tags.push(`Keyword: "${state.searchQuery}"`);
    }
    if (state.category !== 'all') {
      tags.push(`Category: ${state.category}`);
    }
    if (state.dateFilter !== 'all') {
      const dateLabels = { weekend: 'This Weekend', next30: 'Next 30 Days', future: 'Upcoming' };
      tags.push(`Date: ${dateLabels[state.dateFilter] || state.dateFilter}`);
    }
    if (state.priceFilter !== 'all') {
      tags.push(`Price: ${state.priceFilter === 'free' ? 'Free only' : 'Paid only'}`);
    }

    if (tags.length === 0) {
      activeFiltersStrip.innerHTML = '';
      if (clearFiltersBtn) clearFiltersBtn.style.display = 'none';
      return;
    }

    if (clearFiltersBtn) clearFiltersBtn.style.display = 'inline-flex';

    activeFiltersStrip.innerHTML = tags.map(t => `
      <span class="badge badge-neutral" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;">
        ${DateUtils.escapeHtml(t)}
      </span>
    `).join('');
  }

  // Reset all filters
  function resetFilters() {
    state.searchQuery = '';
    state.category = 'all';
    state.dateFilter = 'all';
    state.priceFilter = 'all';
    state.sortBy = 'date-asc';

    if (searchInput) searchInput.value = '';
    if (dateSelect) dateSelect.value = 'all';
    if (priceSelect) priceSelect.value = 'all';
    if (sortSelect) sortSelect.value = 'date-asc';

    updateCategoryButtons();
    applyFilters();

    // Clear URL parameters smoothly
    window.history.replaceState({}, '', window.location.pathname);
  }

  // Event Listeners
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        state.searchQuery = e.target.value.trim();
        applyFilters();
      }, 250);
    });
  }

  categoryFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      state.category = btn.getAttribute('data-category');
      updateCategoryButtons();
      applyFilters();
    });
  });

  if (dateSelect) {
    dateSelect.addEventListener('change', (e) => {
      state.dateFilter = e.target.value;
      applyFilters();
    });
  }

  if (priceSelect) {
    priceSelect.addEventListener('change', (e) => {
      state.priceFilter = e.target.value;
      applyFilters();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      applyFilters();
    });
  }

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', resetFilters);
  }

  // Initial Run
  updateCategoryButtons();
  applyFilters();
});
