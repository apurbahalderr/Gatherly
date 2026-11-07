/**
 * Gatherly - Core Seed Data & Constants
 * High-quality seed events across Technology, Music, Sports, Workshops, Cultural, and Business
 */

const GATHERLY_CATEGORIES = [
  { id: 'all', name: 'All Events', icon: 'grid' },
  { id: 'technology', name: 'Technology', icon: 'cpu' },
  { id: 'music', name: 'Music', icon: 'music' },
  { id: 'sports', name: 'Sports', icon: 'activity' },
  { id: 'workshops', name: 'Workshops', icon: 'book-open' },
  { id: 'cultural', name: 'Cultural', icon: 'globe' },
  { id: 'business', name: 'Business', icon: 'briefcase' }
];

// High-reliability SVG image fallback data URI
const DEFAULT_IMAGE_FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect width='100%25' height='100%25' fill='%236941C6'/%3E%3Cpath d='M0 0l800 500M800 0L0 500' stroke='rgba(255,255,255,0.08)' stroke-width='3'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='28' font-weight='700' fill='%23FFFFFF'%3EGatherly Event%3C/text%3E%3C/svg%3E";

const SEED_EVENTS = [
  {
    id: 'evt-ai-summit-2026',
    title: 'NextGen AI & Spatial Computing Summit 2026',
    tagline: 'The premier symposium on autonomous agents, frontier models, and spatial design.',
    category: 'technology',
    date: '2026-11-20',
    time: '09:00 AM - 05:30 PM PST',
    venue: 'Metropolitan Tech Center, Hall A',
    address: '742 Innovation Parkway, San Francisco, CA',
    city: 'San Francisco',
    price: 1499,
    totalSeats: 250,
    availableSeats: 48,
    featured: true,
    trending: true,
    organizer: {
      name: 'Apex Horizons Foundation',
      email: 'summit@apexhorizons.io',
      role: 'Lead Innovation Consortium',
      avatar: 'AH'
    },
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    description: `Join world-class AI researchers, product visionaries, and systems engineers for an immersive one-day deep dive into the next paradigm of cognitive computing. 

Discover breakthrough work across large foundation models, on-device spatial perception, agentic workflows, and privacy-preserving neural hardware. Featuring 14 keynote lectures, interactive hardware sandboxes, and an exclusive networking mixer.`,
    agenda: [
      { time: '09:00 AM', title: 'Breakfast & Registration', desc: 'Badge pickup, networking coffee, and demo exploration.' },
      { time: '10:00 AM', title: 'Opening Keynote: Agents in the Wild', desc: 'Frontier model architectures driving autonomous workflows.' },
      { time: '12:30 PM', title: 'Executive Networking Luncheon', desc: 'Catered artisanal lunch and moderated roundtables.' },
      { time: '02:00 PM', title: 'Spatial Computing & XR Interfaces', desc: 'Live hands-on breakdown of next-generation spatial SDKs.' },
      { time: '04:30 PM', title: 'Closing Fireside & Investor Mixer', desc: 'Connecting founders, researchers, and venture partners.' }
    ]
  },
  {
    id: 'evt-velvet-music-fest',
    title: 'Velvet Horizon Indie & Ambient Music Festival',
    tagline: 'Two twilight stages celebrating groundbreaking indie-pop, ambient electronic, and neo-folk.',
    category: 'music',
    date: '2026-11-25',
    time: '04:00 PM - 11:30 PM EST',
    venue: 'Riverside Botanical Amphitheater',
    address: '180 Waterfront Drive, Brooklyn, NY',
    city: 'New York',
    price: 499,
    totalSeats: 500,
    availableSeats: 94,
    featured: false,
    trending: true,
    organizer: {
      name: 'Moonlit Sound Collective',
      email: 'contact@moonlitsound.org',
      role: 'Curated Music Production',
      avatar: 'MS'
    },
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    description: `Velvet Horizon brings together nine trailblazing independent artists for an unforgettable sunset-to-midnight auditory spectacle. Set against Brooklyn's scenic waterfront amphitheater, enjoy mesmerizing spatial acoustic design, organic farm-to-table food pavilions, and boutique vinyl pop-ups.`,
    agenda: [
      { time: '04:00 PM', title: 'Gates Open & Acoustic Preludes', desc: 'Ambient lawn sets, botanical garden walks, and vinyl market.' },
      { time: '05:45 PM', title: 'Sunset Stage: Ethereal Folk & Strings', desc: 'Acoustic sets featuring quartet arrangements.' },
      { time: '08:00 PM', title: 'Mainstage: Velvet Horizon Ensemble', desc: 'Synthesizer and live percussion headline spectacle.' },
      { time: '10:15 PM', title: 'Twilight Ambient Afterglow', desc: 'Subtle soundscapes and laser projection visual art.' }
    ]
  },
  {
    id: 'evt-city-lights-marathon',
    title: 'Metropolis Twilight Half Marathon & 10K Run',
    tagline: 'Lace up for an illuminated nocturnal run through iconic illuminated bridges and avenues.',
    category: 'sports',
    date: '2026-11-28',
    time: '06:00 PM - 10:00 PM CST',
    venue: 'Millennium Plaza Starting Gate',
    address: '201 Michigan Avenue, Chicago, IL',
    city: 'Chicago',
    price: 399,
    totalSeats: 400,
    availableSeats: 112,
    featured: false,
    trending: true,
    organizer: {
      name: 'Windy City Striders',
      email: 'run@citylightsmarathon.org',
      role: 'Athletic Event Org',
      avatar: 'WC'
    },
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1200&q=80',
    description: `Experience the exhilarating rush of the Metropolis Twilight Run. Open to both competitive runners and passionate fitness enthusiasts, the USATF-certified scenic course loops across the illuminated riverfront, past historic architecture, with live cheer DJs along every kilometer.`,
    agenda: [
      { time: '05:00 PM', title: 'Runner Warmup & Gear Check', desc: 'Bib verification, LED wristband distribution, and stretching clinics.' },
      { time: '06:00 PM', title: 'Wave 1: Half Marathon Start', desc: 'Competitive pacers and chip-timed elite runners.' },
      { time: '06:30 PM', title: 'Wave 2: 10K Open Start', desc: 'Community runners, corporate teams, and joggers.' },
      { time: '08:30 PM', title: 'Finishers Festival & Awards', desc: 'Medal ceremonies, recovery smoothies, and live podium celebration.' }
    ]
  },
  {
    id: 'evt-design-systems-masterclass',
    title: 'Enterprise UI/UX Architecture & Design Systems Masterclass',
    tagline: 'Build resilient design tokens, composable component libraries, and cross-platform UX.',
    category: 'workshops',
    date: '2026-12-02',
    time: '10:00 AM - 04:00 PM GMT',
    venue: 'The White Collar Studio, Shoreditch',
    address: '42 Silicon Roundabout, London, UK',
    city: 'London',
    price: 1899,
    totalSeats: 60,
    availableSeats: 14,
    featured: false,
    trending: false,
    organizer: {
      name: 'Studio Bauhaus Digital',
      email: 'workshops@bauhausdigital.design',
      role: 'Product Design Practice',
      avatar: 'SB'
    },
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80',
    description: `A masterclass designed for senior designers and lead frontend engineers. Learn how to architect, govern, and scale unified design systems across enterprise organizations. We cover Figma token synchronization, multi-brand themes, accessibility compliance, and developer handover tooling.`,
    agenda: [
      { time: '10:00 AM', title: 'Foundations of Design Tokens', desc: 'Setting up semantic aliasing, color spaces, and dark mode logic.' },
      { time: '11:45 AM', title: 'Component Composition Patterns', desc: 'Avoiding state bloat and building bulletproof UI primitives.' },
      { time: '01:00 PM', title: 'Interactive Lunch & Design Teardown', desc: 'Live critique of popular industry design libraries.' },
      { time: '02:30 PM', title: 'Figma-to-Code Pipeline Automation', desc: 'Automating tokens export, CI/CD linting, and docs generators.' }
    ]
  },
  {
    id: 'evt-global-folk-gala',
    title: 'Echoes of Heritage: Global Folk & Culinary Gala',
    tagline: 'A multi-sensory celebration of indigenous acoustic traditions, textiles, and street gastronomy.',
    category: 'cultural',
    date: '2026-12-06',
    time: '01:00 PM - 09:00 PM PST',
    venue: 'Heritage Pavilion & Gardens',
    address: '1200 Pacific Boulevard, Vancouver, BC',
    city: 'Vancouver',
    price: 0,
    totalSeats: 350,
    availableSeats: 65,
    featured: false,
    trending: false,
    organizer: {
      name: 'Pacific Arts Alliance',
      email: 'gala@pacificartsalliance.ca',
      role: 'Cultural Exchange Non-Profit',
      avatar: 'PA'
    },
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    description: `Echoes of Heritage brings together artisans, folk musicians, and culinary masters representing over 20 distinct cultural traditions. Stroll through living crafts demonstrations, experience traditional storytellers, and sample delicacies prepared with heritage ingredients.`,
    agenda: [
      { time: '01:00 PM', title: 'Ceremonial Opening & Welcome Blessing', desc: 'Traditional drum honors and welcome procession.' },
      { time: '02:30 PM', title: 'Artisan Craft Showcases', desc: 'Pottery, loom weaving, and metalwork live demonstrations.' },
      { time: '05:00 PM', title: 'World Cuisine Tasting Tour', desc: 'Curated small plates from acclaimed international chefs.' },
      { time: '07:00 PM', title: 'Acoustic Folk Fusion Ensemble', desc: 'Cross-cultural instrumental concert on the garden stage.' }
    ]
  },
  {
    id: 'evt-venture-capital-forum',
    title: 'Founders & Angel Capital Pitch Arena 2026',
    tagline: 'Where 30 vetted pre-seed to Series A founders pitch top global VC partners and angels.',
    category: 'business',
    date: '2026-12-10',
    time: '08:30 AM - 06:00 PM EST',
    venue: 'The Atrium Executive Forum',
    address: '500 Boylston Street, Boston, MA',
    city: 'Boston',
    price: 2499,
    totalSeats: 180,
    availableSeats: 22,
    featured: false,
    trending: true,
    organizer: {
      name: 'VentureScale Capital',
      email: 'arena@venturescalecap.com',
      role: 'Early Stage Investment Network',
      avatar: 'VS'
    },
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
    description: `Connect directly with the minds backing the next generational software, fintech, and biotech powerhouses. 30 high-growth startups present their traction in rapid 5-minute pitches followed by unfiltered investor Q&A. Includes private 1:1 deal rooms and networking cocktail hour.`,
    agenda: [
      { time: '08:30 AM', title: 'VIP Investor Breakfast', desc: 'Accredited investors and GP roundtable discussions.' },
      { time: '09:30 AM', title: 'Cohort 1: Fintech & B2B SaaS', desc: '10 startup pitches with live investor valuation polls.' },
      { time: '12:00 PM', title: 'Keynote: Macro Venture Trends in 2027', desc: 'Navigating private markets, liquidity, and secondary sales.' },
      { time: '01:30 PM', title: 'Cohort 2: DeepTech & Health Innovations', desc: '10 high-science startups presenting technical validation.' },
      { time: '04:00 PM', title: '1-on-1 Term Sheet Speed Meetings', desc: 'Facilitated meetings between founders and active lead investors.' }
    ]
  },
  {
    id: 'evt-devops-cloud-bootcamp',
    title: 'Cloud Native & Kubernetes Reliability Workshop',
    tagline: 'Hands-on zero-downtime deployments, multi-region failover, and observability engineering.',
    category: 'technology',
    date: '2026-12-15',
    time: '10:00 AM - 05:00 PM CET',
    venue: 'Berlin Tech Loft',
    address: 'Köpenicker Str. 124, Berlin, Germany',
    city: 'Berlin',
    price: 999,
    totalSeats: 80,
    availableSeats: 31,
    featured: false,
    trending: false,
    organizer: {
      name: 'KubeCraft Engineering',
      email: 'trainings@kubecraft.io',
      role: 'Cloud Engineering Academy',
      avatar: 'KC'
    },
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    description: `Level up your infrastructure game. This intensive workshop walks engineers through building production-grade Kubernetes clusters, configuring automated GitOps pipelines with ArgoCD, and implementing OpenTelemetry traces for distributed microservices debugging.`,
    agenda: [
      { time: '10:00 AM', title: 'Cluster Hardening & Service Mesh', desc: 'Istio security policies, mTLS, and RBAC lockdown.' },
      { time: '12:00 PM', title: 'GitOps Workflow Automation', desc: 'Declarative manifests and automated canary rollouts.' },
      { time: '02:00 PM', title: 'Chaos Engineering & Game Day', desc: 'Simulating node outages and network latency spikes.' },
      { time: '04:00 PM', title: 'Distributed Tracing with OpenTelemetry', desc: 'Visualizing bottleneck microservice queries in real time.' }
    ]
  },
  {
    id: 'evt-neo-jazz-experience',
    title: 'Neo-Jazz Nights & Vinyl Tasting Experience',
    tagline: 'Intimate candlelit jazz quintet performance paired with rare natural wines and record listening.',
    category: 'music',
    date: '2026-12-19',
    time: '07:30 PM - 11:00 PM CST',
    venue: 'The Velvet Lounge & Cellar',
    address: '614 Congress Avenue, Austin, TX',
    city: 'Austin',
    price: 599,
    totalSeats: 90,
    availableSeats: 8,
    featured: false,
    trending: true,
    organizer: {
      name: 'Blue Note Society',
      email: 'events@bluenotesociety.org',
      role: 'Acoustic Arts Society',
      avatar: 'BN'
    },
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80',
    description: `Immerse yourself in warm analogue sound and soulful improvisation. An award-winning modern jazz ensemble performs original compositions and re-imaginings of classic modal jazz standards, accompanied by an artisanal tasting of biodynamic wines curated by master sommeliers.`,
    agenda: [
      { time: '07:30 PM', title: 'Aperitivo & Hi-Fi Listening Lounge', desc: 'Welcome glass, analog vinyl playback on custom tube amps.' },
      { time: '08:30 PM', title: 'Live Quintet Performance – Set 1', desc: 'Original post-bop compositions and trumpet solos.' },
      { time: '09:45 PM', title: 'Intermission & Wine Pairings', desc: 'Guided wine notes and conversation with musicians.' },
      { time: '10:15 PM', title: 'Late Night Jam & Modern Improvisations', desc: 'Spontaneous jam session and closing nocturne.' }
    ]
  },
  {
    id: 'evt-padel-championship',
    title: 'Metropolis Premier Padel & Pickleball Open',
    tagline: 'Compete or spectate at the fastest growing racket sports festival with pro exhibitions.',
    category: 'sports',
    date: '2027-01-09',
    time: '08:00 AM - 07:00 PM EST',
    venue: 'Biscayne Bay Racquet Club',
    address: '150 Ocean Drive, Miami, FL',
    city: 'Miami',
    price: 349,
    totalSeats: 300,
    availableSeats: 76,
    featured: false,
    trending: false,
    organizer: {
      name: 'Sunbelt Racket Association',
      email: 'tournament@sunbeltrackets.com',
      role: 'Tournament Director',
      avatar: 'SR'
    },
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1200&q=80',
    description: `Join over 150 teams across Open, Intermediate, and Beginner divisions at the sun-soaked Biscayne Bay Club. Enjoy tournament play across 12 championship panoramic padel courts, courtside DJ beats, gourmet recovery bowls, and exhibition matches from international touring pros.`,
    agenda: [
      { time: '08:00 AM', title: 'Check-in & Warm-up Courts Open', desc: 'Player gift bags, tournament bracket announcements.' },
      { time: '09:00 AM', title: 'Round Robin Qualifying Matches', desc: 'Fast-paced pool matches across all divisions.' },
      { time: '02:00 PM', title: 'Pro Exhibition Match & Clinic', desc: 'World Padel Tour athletes showcase trick shots and strategy.' },
      { time: '04:30 PM', title: 'Championship Finals & Trophy Social', desc: 'Center court showdowns followed by sunset cocktail reception.' }
    ]
  },
  {
    id: 'evt-cleantech-expo',
    title: 'GreenTech & Climate Solutions World Expo',
    tagline: 'Discover next-generation solar storage, electric mobility, and circular economy breakthroughs.',
    category: 'business',
    date: '2027-01-16',
    time: '09:00 AM - 06:00 PM PST',
    venue: 'Convention Center West Wings',
    address: '800 Convention Way, Seattle, WA',
    city: 'Seattle',
    price: 0,
    totalSeats: 600,
    availableSeats: 195,
    featured: false,
    trending: true,
    organizer: {
      name: 'Global Climate Innovation Forum',
      email: 'info@cleantechexpo.org',
      role: 'Sustainability Coalition',
      avatar: 'GC'
    },
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80',
    description: `The premier gathering of climate innovators, institutional buyers, and policymakers dedicated to accelerating global decarbonization. Over 100 enterprise exhibits showcase breakthrough clean energy generation, carbon capture technologies, and sustainable supply chain infrastructure.`,
    agenda: [
      { time: '09:00 AM', title: 'Expo Floor Grand Opening', desc: 'Exploration of 100+ clean technology showcases.' },
      { time: '11:00 AM', title: 'Panel: Grid Modernization & Battery Tech', desc: 'Long-duration storage and decentralized microgrids.' },
      { time: '02:00 PM', title: 'Green Startup Pitch & Grants Ceremony', desc: '$500,000 in non-dilutive climate innovation awards.' },
      { time: '04:30 PM', title: 'Closing Plenary on Global Policy Accord', desc: 'Keynote insights from international environmental leaders.' }
    ]
  }
];
