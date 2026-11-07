# Gatherly – Premium Event Discovery & Management Platform

> *"Find your people. Find your events."*

[![GitHub repo](https://img.shields.io/badge/GitHub-Gatherly-6941C6?style=flat&logo=github)](https://github.com/apurbahalderr/Gatherly)
[![Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-FF7547?style=flat)](https://github.com/apurbahalderr/Gatherly)
[![Storage](https://img.shields.io/badge/State-LocalStorage-027A48?style=flat)](https://github.com/apurbahalderr/Gatherly)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Gatherly is an editorial-grade, production-quality event discovery and management web application built strictly using **pure HTML5, CSS3, and Vanilla JavaScript (ES6+)** with client-side **LocalStorage** persistence. Designed to stand out in university and college project evaluations, Gatherly rejects generic templates in favor of a polished, startup-caliber experience inspired by modern editorial platforms and modern event software.

---

## 🌟 Highlights & Key Features

### 1. 🏠 Homepage (`index.html`)
- **Visual Identity**: Warm editorial background (`#F8F7F4`), deep purple brand tones (`#6941C6`), energetic coral accents (`#FF7547`), and sharp dark typography (`#191724`).
- **Hero Experience**: Bold headline *"Life happens outside your screen"*, instant omni-search input with integrated category routing, and category quick-filter pills.
- **Featured Spotlight**: Large editorial 2-column spotlight card showcasing the top summit with direct booking actions.
- **Dynamic Content**: Auto-rendered *Trending This Month* and *Upcoming Experiences* sections fed directly from the data layer.
- **Value Proposition Strip**: Explaining platform standards (Verified Hosts, Instant Fast-Passes, Real-time Capacity, Zero Service Fees).

### 2. 🔍 Explore & Discovery Engine (`events.html`)
- **Full Text Search**: Instant real-time search across event titles, taglines, cities, venues, and descriptions.
- **Multi-Filter System**:
  - Filter by Category (*Technology, Music, Sports, Workshops, Cultural, Business*).
  - Filter by Date (*All Dates, This Weekend, Next 30 Days, Upcoming*).
  - Filter by Price (*All, Free Only, Paid Only*).
- **Multi-Factor Sorting**: Sort by date ascending/descending, price low-to-high/high-to-low, title A-Z, or available seats.
- **State Synchronization**: Preserves URL query parameters (`?q=...&cat=...`) seamlessly from the homepage.
- **Resilient Empty States**: Clear filter pills with one-click filter resets and dynamic result counters.

### 3. 🎯 Dedicated Event Details (`event-details.html`)
- **Deep-Linked Routing**: Dynamic resolution using `?id=...` URL parameter with graceful 404 handling.
- **Live Countdown Timer**: Real-time ticker dynamically calculating days, hours, minutes, and seconds until event start.
- **Interactive Details**: Multi-paragraph overview, rich schedule agenda breakdowns, venue geolocation links to Google Maps, and organizer verification card.
- **Capacity Gauge**: Live seat inventory progress bar showing real-time remaining seats and "Sold Out" protection.
- **Share Link**: One-click clipboard copy with feedback toast notifications.
- **Related Recommendations**: Displays 3 contextually relevant events based on category or trending tags.

### 4. 🎟️ Registration & Fast-Pass System (`register.html`)
- **Pre-Selected Event Linking**: Automatically detects event ID from URL query parameters and displays a live preview banner.
- **Form Validation**: Strict real-time validation for legal attendee names, valid email formats, and valid phone numbers without ugly browser alert popups.
- **Duplicate Registration Prevention**: Blocks users from registering twice for the same event with the same email.
- **Seat Limiting**: Prevents registration if seats are sold out.
- **Instant Digital Ticket Pass**: Generates a perforated ticket card with attendee details, registration ID (`GATH-2026-XXXX`), and an SVG QR code mockup for venue check-in.
- **Print / PDF Export**: Built-in print trigger formatted cleanly for physical passes.

### 5. 💼 My Bookings Wallet (`bookings.html`)
- **Pass Management**: Lists all user reservations stored in LocalStorage.
- **Interactive Cancellation**: Cancellation confirmation modal that marks status as *Cancelled* and **automatically restocks event seats** back into the public pool.
- **Print Pass**: Quick-print actions for individual ticket passes.
- **Empty State**: Friendly empty state with direct CTA to explore upcoming events.

### 6. ⚙️ Admin Dashboard (`admin.html`)
- **Operational Metrics**: Real-time metric cards tracking *Total Events*, *Total Registrations*, *Active Confirmed Passes*, and *Remaining Seats*.
- **Event CRUD Operations**:
  - **Create**: Add new events with comprehensive form validation (Title, Category, Date, Time, Venue, City, Price, Seats, Cover Image, Tagline, Description).
  - **Read**: Searchable and filterable data table with category tags and capacity status.
  - **Update**: Edit existing events with prefilled modal fields.
  - **Delete**: Safe delete dialog with confirmation step.
- **Attendee Log**: Dedicated table tracking all registrations, ticket counts, and contact records.
- **Reset Demo Data**: One-click restoration back to default 10 sample events and initial demo booking.

### 7. 🌓 Design System & Bonus Features
- **Dark & Light Mode**: Persistent theme toggle remembering preference in `localStorage` and honoring system `prefers-color-scheme`.
- **Custom Toast Notifications**: Non-blocking toast stack replacing intrusive `window.alert()` calls.
- **Image Fallback System**: High-res Unsplash photography backed by an embedded SVG fallback data URI so images never break offline.
- **Fluid Responsiveness**: Complete CSS Flexbox & Grid architecture tested across ultra-wide monitors, laptops, tablets, and mobile devices without horizontal overflow.

---

## 📁 Project Architecture

```
Gatherly/
├── index.html                 # Homepage (Hero, search, featured, trending, upcoming)
├── events.html                # Explore & Discovery engine (Filters, search, sort)
├── event-details.html         # Dedicated event details & live countdown timer
├── register.html              # Registration form, validation & digital ticket pass
├── bookings.html              # Attendee bookings wallet & cancellation workflow
├── admin.html                 # Admin dashboard (Metrics, Event CRUD, Registrations)
├── README.md                  # Comprehensive project documentation
├── assets/
│   └── favicon.svg            # Custom geometric SVG favicon
├── css/
│   ├── variables.css          # Design tokens (colors, fonts, light/dark themes, spacing)
│   ├── base.css               # Modern reset, typography, buttons, badges, forms
│   ├── components.css         # Navbar, footer, event card, countdown, toast, ticket
│   ├── pages.css              # Page-specific layout & section styling
│   └── responsive.css         # Media queries for tablet and mobile devices
└── js/
    ├── data.js                # Curated seed events & category constants
    ├── storage.js             # LocalStorage service, seat synchronization, validation
    ├── toast.js               # Lightweight toast notification library
    ├── theme.js               # Dark/Light mode theme controller
    ├── navbar.js              # Mobile navigation drawer & header scroll effects
    ├── card-builder.js        # Reusable event card HTML generator
    ├── main.js                # Homepage interactions & spotlight logic
    ├── events.js              # Filter, search, and sort controller
    ├── event-details.js       # Event details view & countdown timer
    ├── register.js            # Registration validation & ticket generation
    ├── bookings.js            # Bookings management & cancellation handling
    └── admin.js               # Dashboard metrics & event CRUD management
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Structure** | Semantic HTML5 | Accessible, SEO-friendly layout primitives |
| **Styling** | Modern CSS3 | Custom variables, Flexbox, Grid, animations, themes |
| **Scripting** | Vanilla JavaScript (ES6+) | Modular architecture with zero external runtime dependencies |
| **Persistence** | Browser LocalStorage | Seamless client-side state for events and bookings |
| **Typography** | Inter & Plus Jakarta Sans | Google Fonts with system font fallbacks |
| **Icons & Media**| Native Inline SVG & Unsplash | Sharp scalable vectors and high-res photography |

---

## 🚀 Getting Started

No build step, compilers, or package installations are required!

### Option 1: Direct File Access
Simply double-click `index.html` or open it in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).

### Option 2: Local HTTP Server (Recommended)
Running through a local web server provides the best experience:

**Using Python 3:**
```bash
python -m http.server 3000
```
Then visit `http://localhost:3000` in your browser.

**Using Node.js (npx serve):**
```bash
npx serve .
```

---

## 🧪 Verification & Testing Checklist

- [x] **Homepage (`index.html`)**: Hero search links smoothly into the explore page; categories navigate properly; featured card and trending cards render dynamically.
- [x] **Explore Page (`events.html`)**: Real-time keyword search functions across multiple fields; category pills filter accurately; date and price filters work; multi-factor sorting executes instantly; empty states show when zero items match.
- [x] **Event Details (`event-details.html`)**: Correct event loads via `?id=...`; live countdown ticks every second; seat capacity is accurately represented; 404 state displays if an invalid ID is provided.
- [x] **Registration (`register.html`)**: Client validation checks required name, email format, and phone number; duplicate registrations for the same email and event are blocked; digital pass with QR code renders on success.
- [x] **My Bookings (`bookings.html`)**: Passes appear in wallet; cancellation modal opens and releases seats back into event capacity; empty state appears if all bookings are removed.
- [x] **Admin Dashboard (`admin.html`)**: Add event creates new entry in LocalStorage; Edit pre-fills and updates; Delete confirms and removes; Reset button restores seed events.
- [x] **Dark / Light Theme**: Toggling between themes works on all 6 pages with instant persistence in LocalStorage.
- [x] **Mobile Responsiveness**: Navigation drawer operates smoothly; layout stacks neatly on narrow viewports without horizontal scrollbars.

---

## 🌐 Deployment Instructions

### Deploying to Vercel (Static)
1. Push this repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import the `Gatherly` repository.
4. Leave build command and output directory empty (pure static site).
5. Click **"Deploy"**.

### Deploying to GitHub Pages
1. Go to repository **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
3. Select branch `main` and folder `/ (root)`.
4. Click **Save**.

---

## 📄 License & Attribution

- Built as an academic college web development project.
- Open-sourced under the MIT License.
- Photographs provided courtesy of [Unsplash](https://unsplash.com).
