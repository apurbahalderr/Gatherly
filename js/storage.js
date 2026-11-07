/**
 * Gatherly - Storage & State Management
 * Robust LocalStorage API for Events, Bookings, Validation & Seat Synchronization
 */

const STORAGE_KEYS = {
  EVENTS: 'gatherly_events',
  BOOKINGS: 'gatherly_bookings',
  THEME: 'gatherly_theme'
};

const StorageService = {
  /**
   * Initializes LocalStorage with seed data if not already present
   */
  init() {
    try {
      const storedEvents = localStorage.getItem(STORAGE_KEYS.EVENTS);
      if (!storedEvents || JSON.parse(storedEvents).length === 0) {
        localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(SEED_EVENTS));
      }

      if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
        // Seed 1 realistic sample booking so the user can immediately experience the "My Bookings" page
        const sampleBooking = {
          id: 'GATH-9842-831',
          eventId: 'evt-ai-summit-2026',
          eventTitle: 'NextGen AI & Spatial Computing Summit 2026',
          eventDate: '2026-11-20',
          eventTime: '09:00 AM - 05:30 PM PST',
          eventVenue: 'Metropolitan Tech Center, Hall A',
          eventImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
          eventPrice: 149,
          userName: 'Alex Chen',
          userEmail: 'alex.chen@innovate.dev',
          userPhone: '+1 (555) 234-5678',
          tickets: 1,
          status: 'confirmed',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
        };
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify([sampleBooking]));
      }
    } catch (err) {
      console.error('StorageService init error:', err);
    }
  },

  /**
   * Returns all stored events
   * @returns {Array} List of events
   */
  getEvents() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
      return data ? JSON.parse(data) : [...SEED_EVENTS];
    } catch (err) {
      console.error('getEvents error:', err);
      return [...SEED_EVENTS];
    }
  },

  /**
   * Retrieves single event by ID
   * @param {string} id 
   * @returns {Object|null}
   */
  getEventById(id) {
    if (!id) return null;
    const events = this.getEvents();
    return events.find(e => e.id === id) || null;
  },

  /**
   * Creates or updates an event in LocalStorage
   * @param {Object} eventData 
   * @returns {Object} saved event
   */
  saveEvent(eventData) {
    const events = this.getEvents();
    const existingIndex = events.findIndex(e => e.id === eventData.id);

    if (existingIndex >= 0) {
      // Update existing
      events[existingIndex] = { ...events[existingIndex], ...eventData };
    } else {
      // Create new
      if (!eventData.id) {
        eventData.id = 'evt-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);
      }
      events.unshift(eventData);
    }

    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    return eventData;
  },

  /**
   * Deletes an event by ID
   * @param {string} id 
   * @returns {boolean}
   */
  deleteEvent(id) {
    const events = this.getEvents().filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    return true;
  },

  /**
   * Resets events back to seed data
   */
  resetToSampleData() {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(SEED_EVENTS));
    return SEED_EVENTS;
  },

  /**
   * Returns all bookings
   * @returns {Array}
   */
  getBookings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.error('getBookings error:', err);
      return [];
    }
  },

  /**
   * Retrieves single booking by ID
   * @param {string} bookingId 
   * @returns {Object|null}
   */
  getBookingById(bookingId) {
    const bookings = this.getBookings();
    return bookings.find(b => b.id === bookingId) || null;
  },

  /**
   * Validates and registers a new booking
   * Enforces: Required fields, valid email, phone, duplicate prevention, and seat limits
   * Decrements available event seats on success
   */
  createBooking({ eventId, userName, userEmail, userPhone, tickets = 1 }) {
    // 1. Validation checks
    if (!eventId) return { success: false, error: 'Please select an event.' };
    if (!userName || userName.trim().length < 2) return { success: false, error: 'Please enter your full name.' };
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userEmail || !emailRegex.test(userEmail.trim())) {
      return { success: false, error: 'Please provide a valid email address.' };
    }

    const phoneClean = (userPhone || '').replace(/[\s\-\(\)\.]/g, '');
    if (!userPhone || phoneClean.length < 7) {
      return { success: false, error: 'Please provide a valid contact phone number.' };
    }

    // 2. Fetch event & check seat availability
    const event = this.getEventById(eventId);
    if (!event) {
      return { success: false, error: 'Selected event could not be found.' };
    }

    const requestedTickets = parseInt(tickets, 10) || 1;
    if (event.availableSeats < requestedTickets) {
      return { 
        success: false, 
        error: `Sorry, this event only has ${event.availableSeats} seat${event.availableSeats === 1 ? '' : 's'} remaining.` 
      };
    }

    // 3. Duplicate Registration Prevention
    const existingBookings = this.getBookings();
    const isDuplicate = existingBookings.some(b => 
      b.eventId === eventId && 
      b.userEmail.toLowerCase().trim() === userEmail.toLowerCase().trim() && 
      b.status === 'confirmed'
    );

    if (isDuplicate) {
      return { 
        success: false, 
        error: `A confirmed registration for "${event.title}" under ${userEmail.trim()} already exists. Check 'My Bookings'.` 
      };
    }

    // 4. Generate unique registration pass ID
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `GATH-${new Date().getFullYear()}-${randomHex}`;

    const newBooking = {
      id: bookingId,
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: event.time,
      eventVenue: event.venue,
      eventImage: event.image,
      eventPrice: event.price,
      userName: userName.trim(),
      userEmail: userEmail.trim().toLowerCase(),
      userPhone: userPhone.trim(),
      tickets: requestedTickets,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    // 5. Save booking
    existingBookings.unshift(newBooking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(existingBookings));

    // 6. Update available seats on the event
    event.availableSeats = Math.max(0, event.availableSeats - requestedTickets);
    this.saveEvent(event);

    return {
      success: true,
      booking: newBooking,
      remainingSeats: event.availableSeats
    };
  },

  /**
   * Cancels a booking, updates status, and restocks available event seats
   * @param {string} bookingId 
   * @returns {Object} result
   */
  cancelBooking(bookingId) {
    const bookings = this.getBookings();
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);

    if (bookingIndex === -1) {
      return { success: false, error: 'Registration not found.' };
    }

    const booking = bookings[bookingIndex];
    if (booking.status === 'cancelled') {
      return { success: false, error: 'This registration is already cancelled.' };
    }

    // Mark as cancelled
    booking.status = 'cancelled';
    booking.cancelledAt = new Date().toISOString();
    bookings[bookingIndex] = booking;
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

    // Restock event seats
    const event = this.getEventById(booking.eventId);
    if (event) {
      event.availableSeats = Math.min(event.totalSeats, (event.availableSeats || 0) + (booking.tickets || 1));
      this.saveEvent(event);
    }

    return { 
      success: true, 
      message: 'Registration successfully cancelled. Seats have been released.',
      booking
    };
  }
};

// Auto-run initialization
StorageService.init();

// Utility Formatters
const DateUtils = {
  formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        return d.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      }
      return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  },

  formatMonthDay(dateStr) {
    if (!dateStr) return { month: '', day: '' };
    try {
      const parts = dateStr.split('-');
      const d = parts.length === 3 ? new Date(parts[0], parts[1] - 1, parts[2]) : new Date(dateStr);
      return {
        month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
        day: d.getDate()
      };
    } catch {
      return { month: 'DATE', day: '--' };
    }
  },

  formatPrice(price) {
    if (price === 0 || price === '0' || price === null || price === undefined) {
      return 'Free';
    }
    return `$${Number(price).toFixed(0)}`;
  },

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};
