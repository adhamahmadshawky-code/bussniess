/* =====================================================================
   PERSONAL BRAND — MASTER TEMPLATE
   CLIENT CONFIGURATION · the only file you need to edit for a new client
   ---------------------------------------------------------------------
   Anything written like [SOMETHING] is a visible placeholder.
   Delete a value (set it to "") to hide that element or section.
   Nothing here contains real client data.
   ===================================================================== */

window.PB_CONFIG = {

  /* ------------------------------------------------------------------
     META · browser tab, share cards, structured data
     ------------------------------------------------------------------ */
  meta: {
    title: '[CLIENT NAME] — [CLIENT ROLE]',
    description: '[SHORT SEO DESCRIPTION — ONE SENTENCE]',
    url: '',                                  // e.g. 'https://example.com'
    image: '/assets/branding/og-image.jpg',   // 1200x630 share image
    locale: 'en'
  },

  /* ------------------------------------------------------------------
     THEME · brand colour, defaults, typography pairing
     Change theme.accent and the entire site re-skins instantly.
     ------------------------------------------------------------------ */
  theme: {
    accent: '#d8b26b',
    default: 'dark',                          // 'dark' | 'light'
    radius: 18,                               // corner softness in px
    fonts: {
      // Leave empty to use the built-in pairing defined in styles.css.
      // To use another font, load it in index.html, then name it here.
      display: '',
      body: ''
    }
  },

  /* ------------------------------------------------------------------
     CLIENT · identity, positioning, imagery
     ------------------------------------------------------------------ */
  client: {
    name: '[CLIENT NAME]',
    monogram: '',                             // optional, e.g. 'JD' (auto-derived if empty)
    logo: '',                                 // optional path, e.g. '/assets/branding/logo.svg'
    role: '[CLIENT ROLE / PROFESSION]',
    tagline: '[SHORT TAGLINE]',
    bio: '[SHORT BIO]',
    profileImage: '/assets/profile/profile.jpg',
    profileImageAlt: '[PROFILE IMAGE ALT TEXT]',
    secondaryImage: '/assets/profile/secondary.jpg',
    secondaryImageAlt: '[SECONDARY IMAGE ALT TEXT]',
    location: '[LOCATION]',
    availability: '[AVAILABILITY STATUS]',
    experience: '[X YEARS / DESCRIPTION]'
  },

  /* ------------------------------------------------------------------
     NAVIGATION · links are filtered out automatically if their
     target section is disabled or empty
     ------------------------------------------------------------------ */
  nav: [
    { label: 'Home', target: 'home' },
    { label: 'About', target: 'about' },
    { label: 'Services', target: 'services' },
    { label: 'Work', target: 'work' },
    { label: 'Contact', target: 'contact' }
  ],

  /* ------------------------------------------------------------------
     CTA · every button label lives here so nothing is hard-coded
     ------------------------------------------------------------------ */
  cta: {
    nav: { label: "Let's Talk", href: '#contact' },
    heroPrimary: { label: "Let's Work Together", href: '#contact' },
    heroSecondary: { label: 'View My Work', href: '#work' },
    heroBadge: '[LOCATION / AVAILABLE FOR WORK]',
    scrollCue: 'Scroll'
  },

  /* ------------------------------------------------------------------
     SOCIAL ACCOUNTS · set enabled:false to remove a platform entirely,
     or set handle/description to "" to keep the platform but drop a line
     Available brand icons: instagram, tiktok, youtube, linkedin, facebook,
     x, behance, dribbble, github, whatsapp, telegram, spotify
     ------------------------------------------------------------------ */
  socials: {
    enabled: true,
    heading: 'Find me online',
    subtitle: '[SHORT SOCIAL MEDIA DESCRIPTION]',
    items: [
      {
        platform: 'instagram',
        handle: '@[USERNAME]',
        description: '[SHORT DESCRIPTION OR @FOLLOWER PLACEHOLDER]',
        url: '#',
        cover: '/assets/social/instagram.jpg',
        enabled: true
      },
      {
        platform: 'youtube',
        handle: '[CHANNEL NAME]',
        description: '[SHORT DESCRIPTION OR SUBSCRIBER PLACEHOLDER]',
        url: '#',
        cover: '/assets/social/youtube.jpg',
        enabled: true
      },
      {
        platform: 'tiktok',
        handle: '@[USERNAME]',
        description: '[SHORT DESCRIPTION OR @FOLLOWER PLACEHOLDER]',
        url: '#',
        cover: '',
        enabled: true
      },
      {
        platform: 'linkedin',
        handle: '[FULL NAME]',
        description: '[SHORT DESCRIPTION OR ROLE PLACEHOLDER]',
        url: '#',
        cover: '',
        enabled: true
      },
      {
        platform: 'x',
        handle: '@[USERNAME]',
        description: '[SHORT DESCRIPTION OR @FOLLOWER PLACEHOLDER]',
        url: '#',
        cover: '',
        enabled: true
      },
      {
        platform: 'globe',
        handle: '[DOMAIN.COM]',
        description: '[SHORT DESCRIPTION OR "PERSONAL SITE"]',
        url: '#',
        cover: '',
        enabled: true
      },
      {
        platform: 'behance',
        handle: '@[USERNAME]',
        description: '[SHORT DESCRIPTION]',
        url: '#',
        cover: '',
        enabled: false
      },
      {
        platform: 'dribbble',
        handle: '@[USERNAME]',
        description: '[SHORT DESCRIPTION]',
        url: '#',
        cover: '',
        enabled: false
      },
      {
        platform: 'github',
        handle: '@[USERNAME]',
        description: '[SHORT DESCRIPTION]',
        url: '#',
        cover: '',
        enabled: false
      },
      {
        platform: 'facebook',
        handle: '[PAGE NAME]',
        description: '[SHORT DESCRIPTION]',
        url: '#',
        cover: '',
        enabled: false
      }
    ]
  },

  /* ------------------------------------------------------------------
     ABOUT · paragraphs accept plain text; "\n\n" splits paragraphs
     ------------------------------------------------------------------ */
  about: {
    enabled: true,
    heading: 'More than a profile.',
    paragraphs: [
      '[BIO / ABOUT TEXT — FIRST PARAGRAPH. WRITE IN PLAIN, HUMAN LANGUAGE ABOUT WHO THIS PERSON IS AND WHAT THEY STAND FOR.]',
      '[SECOND PARAGRAPH — WHAT THEY DO, WHO THEY DO IT FOR, AND HOW THEY WORK. KEEP IT SPECIFIC AND HONEST.]'
    ],
    details: [
      { label: 'Based in', value: '[LOCATION]' },
      { label: 'Experience', value: '[X YEARS / DESCRIPTION]' },
      { label: 'Available for', value: '[AVAILABILITY]' }
    ],
    showSecondaryImage: true
  },

  /* ------------------------------------------------------------------
     SERVICES · 3 to 6 items. Supported icons: sparkles, layers, pen-tool,
     code, camera, video, mic, compass, zap, heart, box, briefcase, users,
     palette, target, feather, globe, trending-up
     ------------------------------------------------------------------ */
  services: {
    enabled: true,
    heading: 'What I do',
    subtitle: '[SHORT SERVICES INTRODUCTION]',
    items: [
      { title: '[SERVICE NAME]', description: '[SHORT SERVICE DESCRIPTION]', icon: 'sparkles', price: '[FROM $X]' },
      { title: '[SERVICE NAME]', description: '[SHORT SERVICE DESCRIPTION]', icon: 'layers', price: '' },
      { title: '[SERVICE NAME]', description: '[SHORT SERVICE DESCRIPTION]', icon: 'target', price: '' },
      { title: '[SERVICE NAME]', description: '[SHORT SERVICE DESCRIPTION]', icon: 'compass', price: '[FROM $X]' }
    ]
  },

  /* ------------------------------------------------------------------
     FEATURED WORK · optional section. Set enabled:false for a client with
     no portfolio. 2 to 6 items look best.
     ------------------------------------------------------------------ */
  work: {
    enabled: true,
    heading: 'Featured Work',
    subtitle: '[SHORT WORK / OFFERINGS INTRODUCTION]',
    items: [
      {
        title: '[PROJECT / WORK NAME]',
        description: '[SHORT DESCRIPTION]',
        image: '/assets/projects/project-1.jpg',
        imageAlt: '[PROJECT IMAGE ALT TEXT]',
        link: '#',
        tags: ['[TAG]', '[TAG]']
      },
      {
        title: '[PROJECT / WORK NAME]',
        description: '[SHORT DESCRIPTION]',
        image: '/assets/projects/project-2.jpg',
        imageAlt: '[PROJECT IMAGE ALT TEXT]',
        link: '#',
        tags: ['[TAG]']
      },
      {
        title: '[PROJECT / WORK NAME]',
        description: '[SHORT DESCRIPTION]',
        image: '/assets/projects/project-3.jpg',
        imageAlt: '[PROJECT IMAGE ALT TEXT]',
        link: '#',
        tags: ['[TAG]', '[TAG]']
      }
    ]
  },

  /* ------------------------------------------------------------------
     SOCIAL PROOF · optional. Every number and quote stays a placeholder
     until the client supplies their own.
     ------------------------------------------------------------------ */
  proof: {
    enabled: false,
    heading: '[SECTION HEADING]',
    subtitle: '[SHORT CREDIBILITY STATEMENT]',
    stats: [
      { value: '[OPTIONAL STAT]', label: '[DESCRIPTION]' },
      { value: '[OPTIONAL STAT]', label: '[DESCRIPTION]' },
      { value: '[OPTIONAL STAT]', label: '[DESCRIPTION]' }
    ],
    testimonials: [
      { quote: '[CLIENT TESTIMONIAL]', name: '[TESTIMONIAL NAME]', role: '[ROLE / COMPANY]' },
      { quote: '[CLIENT TESTIMONIAL]', name: '[TESTIMONIAL NAME]', role: '[ROLE / COMPANY]' }
    ]
  },

  /* ------------------------------------------------------------------
     CONTACT · only the methods you enable are rendered.
     Supported types: mail, phone, whatsapp, calendar, globe,
     instagram, linkedin, telegram
     ------------------------------------------------------------------ */
  contact: {
    enabled: true,
    heading: "Let's build something great.",
    description: '[SHORT CTA DESCRIPTION]',
    methods: [
      { type: 'mail', label: 'Email', value: '[EMAIL ADDRESS]', url: 'mailto:[EMAIL ADDRESS]', enabled: true },
      { type: 'calendar', label: 'Booking', value: '[BOOKING LINK LABEL]', url: '#', enabled: true },
      { type: 'phone', label: 'Phone', value: '[PHONE NUMBER]', url: 'tel:[PHONE NUMBER]', enabled: true },
      { type: 'whatsapp', label: 'WhatsApp', value: '[WHATSAPP NUMBER]', url: '#', enabled: false },
      { type: 'instagram', label: 'Instagram DM', value: '@[USERNAME]', url: '#', enabled: false }
    ],
    primary: { label: 'Send an email', href: 'mailto:[EMAIL ADDRESS]' },
    secondary: { label: 'View my socials', href: '#social' }
  },

  /* ------------------------------------------------------------------
     FOOTER
     ------------------------------------------------------------------ */
  footer: {
    description: '[SHORT DESCRIPTION]',
    showSocials: true,
    showContact: true,
    note: '',
    copyrightName: ''                         // defaults to client.name
  },

  /* ------------------------------------------------------------------
     INTERFACE · optional chrome
     ------------------------------------------------------------------ */
  features: {
    themeToggle: true,
    placeholderHighlight: true,
    backToTop: true,
    stickyHeader: true
  }
};