/* =====================================================================
   PERSONAL BRAND — MASTER TEMPLATE
   Renderer + interaction layer. Reads window.PB_CONFIG only.
   Sections with no content are removed from the DOM automatically.
   ===================================================================== */

(function () {
  'use strict';

  var CONFIG = window.PB_CONFIG || {};
  var ICONS = window.PB_ICONS || { brand: {}, ui: {} };

  var doc = document;
  var root = doc.documentElement;

  /* ------------------------------------------------------------------
     helpers
     ------------------------------------------------------------------ */

  var ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  function esc(v) {
    return String(v === undefined || v === null ? '' : v).replace(/[&<>"']/g, function (c) {
      return ESC[c];
    });
  }

  function str(v) {
    return typeof v === 'string' ? v.trim() : '';
  }

  function isPh(v) {
    return /^\s*\[.+\]\s*$/.test(str(v));
  }

  function has(v) {
    return str(v) !== '';
  }

  /* renders a config value, flagging placeholders so they can be highlighted */
  function t(v, path) {
    var s = str(v);
    if (!s) return '';
    if (isPh(s)) {
      return '<span class="ph"' + (path ? ' title="config.js \u2192 ' + esc(path) + '"' : '') + '>' + esc(s) + '</span>';
    }
    return esc(s);
  }

  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }

  function svg(inner, filled, cls) {
    var attrs = filled
      ? 'viewBox="0 0 24 24" fill="currentColor"'
      : 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';
    return '<svg class="' + cls + '" ' + attrs + ' aria-hidden="true" focusable="false">' + inner + '</svg>';
  }

  function uiIcon(name, cls) { return svg(ICONS.ui[name] || ICONS.ui.sparkles || '', false, cls || 'icon'); }
  function brandIcon(name, cls) { return svg(ICONS.brand[name] || ICONS.ui.globe || '', true, cls || 'icon'); }

  function glyph(name, cls) {
    if (ICONS.ui[name]) return svg(ICONS.ui[name], false, cls || 'icon');
    if (ICONS.brand[name]) return svg(ICONS.brand[name], true, cls || 'icon');
    return svg(ICONS.ui.sparkles || '', false, cls || 'icon');
  }

  var PLATFORM_LABELS = {
    x: 'X',
    globe: 'Website',
    mail: 'Email',
    phone: 'Phone',
    whatsapp: 'WhatsApp',
    telegram: 'Telegram',
    calendar: 'Booking',
    instagram: 'Instagram',
    tiktok: 'TikTok',
    youtube: 'YouTube',
    linkedin: 'LinkedIn',
    facebook: 'Facebook',
    behance: 'Behance',
    dribbble: 'Dribbble',
    github: 'GitHub',
    spotify: 'Spotify'
  };

  function platformLabel(key) {
    var k = str(key).toLowerCase();
    if (PLATFORM_LABELS[k]) return PLATFORM_LABELS[k];
    return k.replace(/(^|[-_\s])(\w)/g, function (m, a, b) { return b.toUpperCase(); });
  }

  function platformIcon(key) {
    var k = str(key).toLowerCase();
    return ICONS.brand[k] ? brandIcon(k, 'icon icon--brand') : uiIcon(k, 'icon');
  }

  function external(href) {
    return /^https?:\/\//i.test(href);
  }

  function attrsFor(href) {
    return external(href) ? ' target="_blank" rel="noopener noreferrer"' : '';
  }

  /* derives initials for the monogram: "Jane Doe" -> JD, "[CLIENT NAME]" -> CN */
  function monogram(value) {
    var explicit = str(CONFIG.client && CONFIG.client.monogram);
    if (explicit) return explicit.toUpperCase();
    var clean = str(value).replace(/[\[\]]/g, '');
    var words = clean.split(/[\s\-_]+/).filter(function (w) { return /[a-z0-9]/i.test(w); });
    if (!words.length) return '\u00b7';
    return words.slice(0, 2).map(function (w) { return w.charAt(0); }).join('').toUpperCase();
  }

  /* ------------------------------------------------------------------
     small building blocks
     ------------------------------------------------------------------ */

  function eyebrow(label, path) {
    if (!has(label)) return '';
    return '<p class="eyebrow"><span class="eyebrow__dot" aria-hidden="true"></span>' + t(label, path) + '</p>';
  }

  function btn(cfg, variant, path, iconName, extraClass) {
    if (!cfg || !has(cfg.label)) return '';
    var href = str(cfg.href) || '#';
    var cls = 'btn btn--' + (variant || 'primary') + (extraClass ? ' ' + extraClass : '');
    return '<a class="' + cls + '" href="' + esc(href) + '"' + attrsFor(href) + '>' +
      '<span class="btn__label">' + t(cfg.label, path + '.label') + '</span>' +
      '<span class="btn__icon">' + (iconName ? glyph(iconName, 'icon') : uiIcon('arrow-right', 'icon')) + '</span>' +
      '</a>';
  }

  function frame(options) {
    var o = options || {};
    var img = has(o.src)
      ? '<img class="frame__img" src="' + esc(str(o.src)) + '" alt="' + esc(str(o.alt)) + '" loading="' + (o.eager ? 'eager' : 'lazy') + '" decoding="async">'
      : '';
    var empty =
      '<span class="frame__empty" aria-hidden="true">' +
        '<span class="frame__grid" aria-hidden="true"></span>' +
        '<span class="frame__monogram">' + esc(o.monogram || '') + '</span>' +
        '<span class="frame__label">' + esc(str(o.label) || str(o.alt) || 'IMAGE') + '</span>' +
      '</span>';
    return '<span class="frame ' + esc(o.modifier || '') + '" data-empty="true">' +
      '<span class="frame__glow" aria-hidden="true"></span>' + img + empty +
      '<span class="frame__tick frame__tick--tl" aria-hidden="true"></span>' +
      '<span class="frame__tick frame__tick--tr" aria-hidden="true"></span>' +
      '<span class="frame__tick frame__tick--bl" aria-hidden="true"></span>' +
      '<span class="frame__tick frame__tick--br" aria-hidden="true"></span>' +
      '</span>';
  }

  function sectionHead(o) {
    return '<header class="section-head" data-reveal>' +
      eyebrow(o.eyebrow, o.eyebrowPath) +
      '<h2 class="display section-head__title" id="' + esc(o.id) + '">' + t(o.heading, o.headingPath) + '</h2>' +
      (has(o.subtitle) ? '<p class="section-head__sub lead">' + t(o.subtitle, o.subtitlePath) + '</p>' : '') +
      '</header>';
  }

  function revealDelay(ms) { return ms ? ' style="--reveal-delay:' + ms + 'ms"' : ''; }

  /* keeps grids balanced: 1,2,3 items fill one row; 4 becomes 2x2; 5-6 become 3 columns */
  function columnCount(n) {
    if (n <= 3) return n;
    return n === 4 ? 2 : 3;
  }

  function activeItems(group) {
    if (!group) return [];
    var items = Array.isArray(group) ? group : (group.items || []);
    return items.filter(function (it) { return it && it.enabled !== false && has(it.title || it.label || it.handle || it.value); });
  }

  /* ------------------------------------------------------------------
     header
     ------------------------------------------------------------------ */

  var name = (CONFIG.client && CONFIG.client.name) || '';
  var cta = CONFIG.cta || {};

  function brandMarkup(cls) {
    var logo = str(CONFIG.client && CONFIG.client.logo);
    var mark = logo
      ? '<img class="brand__logo" src="' + esc(logo) + '" alt="' + esc(name) + '">'
      : '<span class="brand__mark" aria-hidden="true">' + esc(monogram(name)) + '</span>';
    return '<span class="brand ' + esc(cls || '') + '">' + mark +
      '<span class="brand__name">' + t(name, 'client.name') + '</span></span>';
  }

  function navLinks() {
    var list = CONFIG.nav || [];
    return list
      .filter(function (link) { return link && has(link.label) && doc.getElementById(str(link.target)); })
      .map(function (link) {
        return '<li class="site-nav__item"><a class="site-nav__link" href="#' + esc(str(link.target)) + '" data-nav="' + esc(str(link.target)) + '">' +
          '<span>' + t(link.label, 'nav') + '</span>' +
          '<span class="site-nav__indicator" aria-hidden="true"></span>' +
          '</a></li>';
      }).join('');
  }

  function renderHeader() {
    var f = CONFIG.features || {};
    var links = navLinks();
    var controls = '';

    if (f.themeToggle !== false) {
      controls += '<button class="icon-btn" type="button" data-action="theme" aria-pressed="false" aria-label="Switch to light theme">' +
        '<span class="icon-btn__on-dark">' + uiIcon('sun', 'icon') + '</span>' +
        '<span class="icon-btn__on-light">' + uiIcon('moon', 'icon') + '</span>' +
        '</button>';
    }
    if (f.placeholderHighlight !== false) {
      controls += '<button class="icon-btn" type="button" data-action="ph" aria-pressed="true" aria-label="Highlight editable fields">' +
        uiIcon('highlighter', 'icon') + '</button>';
    }

    var primary = btn(cta.nav, 'primary', 'cta.nav', 'arrow-right', 'site-header__cta');

    return '<a class="skip-link" href="#main">Skip to content</a>' +
      '<header class="site-header" id="siteHeader" data-sticky>' +
        '<div class="container site-header__inner">' +
          '<a class="brand-link" href="#home" aria-label="' + esc(name) + ' \u2014 top of page">' + brandMarkup('') + '</a>' +
          '<nav class="site-nav" aria-label="Primary"><ul class="site-nav__list">' + links + '</ul></nav>' +
          '<div class="site-header__actions">' +
            '<div class="controls">' + controls + '</div>' +
            primary +
            '<button class="icon-btn icon-btn--menu" type="button" data-action="menu" aria-expanded="false" aria-controls="mobileMenu">' +
              '<span class="icon-btn__on-dark menu-open">' + uiIcon('menu', 'icon') + '</span>' +
              '<span class="icon-btn__on-light menu-close">' + uiIcon('x', 'icon') + '</span>' +
              '<span class="sr-only">Open menu</span>' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</header>' +
      '<div class="mobile-menu" id="mobileMenu" data-mobile-menu hidden>' +
        '<div class="mobile-menu__panel" role="dialog" aria-modal="true" aria-label="Site menu">' +
          '<div class="container mobile-menu__inner">' +
            '<nav class="mobile-menu__nav" aria-label="Mobile"><ul class="mobile-menu__list">' +
              (CONFIG.nav || []).filter(function (l) { return l && has(l.label) && doc.getElementById(str(l.target)); })
                .map(function (l, i) {
                  return '<li style="--i:' + i + '"><a class="mobile-menu__link" href="#' + esc(str(l.target)) + '" data-nav="' + esc(str(l.target)) + '">' +
                    '<span class="mobile-menu__num mono">' + String(i + 1).padStart(2, '0') + '</span>' +
                    '<span class="mobile-menu__label">' + t(l.label, 'nav') + '</span>' +
                    '<span class="mobile-menu__arrow">' + uiIcon('arrow-up-right', 'icon') + '</span></a></li>';
                }).join('') +
            '</ul></nav>' +
            '<div class="mobile-menu__foot">' +
              btn(cta.nav, 'primary', 'cta.nav', 'arrow-right') +
              '<ul class="mobile-menu__meta">' +
                (has(CONFIG.client && CONFIG.client.location)
                  ? '<li>' + uiIcon('map-pin', 'icon') + '<span>' + t(CONFIG.client.location, 'client.location') + '</span></li>' : '') +
                socialLinks('mobile-menu__socials') +
              '</ul>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function socialLinks(cls) {
    var items = activeItems(CONFIG.socials);
    if (!items.length) return '';
    return '<ul class="social-links ' + esc(cls || '') + '">' + items.map(function (s) {
      return '<li><a class="social-link" href="' + esc(str(s.url) || '#') + '"' + attrsFor(str(s.url)) +
        ' aria-label="' + esc(platformLabel(s.platform) + (has(s.handle) ? ' ' + str(s.handle) : '')) + '">' +
        platformIcon(s.platform) + '</a></li>';
    }).join('') + '</ul>';
  }

  /* ------------------------------------------------------------------
     hero
     ------------------------------------------------------------------ */

  function renderHero() {
    var c = CONFIG.client || {};
    var ctaPrimary = btn(cta.heroPrimary, 'primary', 'cta.heroPrimary', 'arrow-right');
    var workVisible = doc.getElementById('work');
    var ctaSecondary = workVisible
      ? btn(cta.heroSecondary, 'ghost', 'cta.heroSecondary', 'arrow-up-right')
      : '';

    var facts = [];
    if (has(c.location)) facts.push('<li class="chip">' + uiIcon('map-pin', 'icon') + t(c.location, 'client.location') + '</li>');
    if (has(c.availability)) facts.push('<li class="chip chip--live"><span class="chip__pulse" aria-hidden="true"></span>' + t(c.availability, 'client.availability') + '</li>');

    return '<div class="container hero__inner">' +
      '<div class="hero__content">' +
        eyebrow(cta.heroBadge, 'cta.heroBadge') +
        '<h1 class="display hero__title" id="heroTitle"' + revealDelay(60) + ' data-reveal>' + t(c.name, 'client.name') + '</h1>' +
        '<p class="hero__role"' + revealDelay(120) + ' data-reveal>' + t(c.role, 'client.role') + '</p>' +
        '<p class="lead hero__tagline"' + revealDelay(180) + ' data-reveal>' + t(c.tagline, 'client.tagline') + '</p>' +
        '<div class="btn-row"' + revealDelay(240) + ' data-reveal>' + ctaPrimary + ctaSecondary + '</div>' +
        (facts.length ? '<ul class="hero__facts"' + revealDelay(300) + ' data-reveal>' + facts.join('') + '</ul>' : '') +
      '</div>' +
      '<div class="hero__media"' + revealDelay(140) + ' data-reveal="mask">' +
        frame({
          src: c.profileImage,
          alt: c.profileImageAlt,
          label: '[PROFILE IMAGE]',
          monogram: monogram(c.name),
          modifier: 'frame--portrait',
          eager: true
        }) +
        '<span class="hero__badge"><span class="hero__badge-dot" aria-hidden="true"></span>' +
          t(has(cta.heroBadge) ? cta.heroBadge : (c.location || ''), 'cta.heroBadge') + '</span>' +
      '</div>' +
      '</div>';
  }

  /* ------------------------------------------------------------------
     socials
     ------------------------------------------------------------------ */

  function renderSocials() {
    var g = CONFIG.socials || {};
    var items = activeItems(g);
    if (!items.length) return '';

    var cards = items.map(function (s, i) {
      var cover = has(s.cover)
        ? '<span class="social-card__cover"><img src="' + esc(str(s.cover)) + '" alt="" loading="lazy" decoding="async"></span>'
        : '';
      return '<li class="social-grid__item" style="--i:' + i + '">' +
        '<a class="social-card" href="' + esc(str(s.url) || '#') + '"' + attrsFor(str(s.url)) + '>' +
          cover +
          '<span class="social-card__head">' +
            '<span class="icon-tile">' + platformIcon(s.platform) + '</span>' +
            '<span class="social-card__arrow">' + uiIcon('arrow-up-right', 'icon') + '</span>' +
          '</span>' +
          '<span class="social-card__platform">' + t(platformLabel(s.platform), 'socials.items.platform') + '</span>' +
          (has(s.handle) ? '<span class="social-card__handle mono">' + t(s.handle, 'socials.items.handle') + '</span>' : '') +
          (has(s.description) ? '<span class="social-card__desc">' + t(s.description, 'socials.items.description') + '</span>' : '') +
          '<span class="social-card__cta"><span>' + esc('View profile') + '</span>' + uiIcon('arrow-right', 'icon') + '</span>' +
        '</a></li>';
    }).join('');

    return sectionHead({
      eyebrow: 'Online presence',
      eyebrowPath: 'socials.heading',
      heading: g.heading || 'Find me online',
      headingPath: 'socials.heading',
      subtitle: g.subtitle,
      subtitlePath: 'socials.subtitle',
      id: 'socialsTitle'
    }) + '<ul class="social-grid" data-stagger style="--cols:' + columnCount(items.length) + '">' + cards + '</ul>';
  }

  /* ------------------------------------------------------------------
     about
     ------------------------------------------------------------------ */

  function renderAbout() {
    var g = CONFIG.about || {};
    var c = CONFIG.client || {};
    var paragraphs = []
      .concat(g.paragraphs || [])
      .map(function (p) { return String(p || '').trim(); })
      .filter(Boolean)
      .map(function (p) { return p.split(/\n\s*\n/); })
      .reduce(function (a, b) { return a.concat(b); }, [])
      .map(function (p) { return '<p>' + t(p, 'about.paragraphs') + '</p>'; })
      .join('');

    var details = (g.details || []).filter(function (d) { return d && has(d.label) && has(d.value); });
    var facts = details.length
      ? '<dl class="fact-list"' + revealDelay(120) + ' data-reveal>' + details.map(function (d) {
          return '<div class="fact"><dt class="fact__label">' + t(d.label, 'about.details.label') + '</dt>' +
            '<dd class="fact__value">' + t(d.value, 'about.details.value') + '</dd></div>';
        }).join('') + '</dl>'
      : '';

    var secondary = '';
    if (g.showSecondaryImage !== false) {
      secondary =
        '<div class="about__media"' + revealDelay(160) + ' data-reveal="mask">' +
          frame({
            src: c.secondaryImage,
            alt: c.secondaryImageAlt,
            label: '[SECONDARY IMAGE]',
            monogram: '',
            modifier: 'frame--landscape'
          }) +
          ((has(c.experience) || has(c.availability))
            ? '<div class="note-card">' +
                (has(c.experience) ? '<p class="note-card__value">' + t(c.experience, 'client.experience') + '</p>' : '') +
                (has(c.availability) ? '<p class="note-card__label"><span class="note-card__dot" aria-hidden="true"></span>' + t(c.availability, 'client.availability') + '</p>' : '') +
              '</div>'
            : '') +
        '</div>';
    }

    return '<div class="container about__inner">' +
      '<div class="about__content">' +
        eyebrow('Background', 'about.heading') +
        '<h2 class="display about__title" id="aboutTitle"' + revealDelay(60) + ' data-reveal>' + t(g.heading || 'More than a profile.', 'about.heading') + '</h2>' +
        (paragraphs ? '<div class="prose"' + revealDelay(100) + ' data-reveal>' + paragraphs + '</div>' : '') +
        facts +
      '</div>' +
      secondary +
      '</div>';
  }

  /* ------------------------------------------------------------------
     services
     ------------------------------------------------------------------ */

  function renderServices() {
    var g = CONFIG.services || {};
    var items = activeItems(g);
    if (!items.length) return '';

    var cards = items.map(function (s, i) {
      return '<li class="service-grid__item" style="--i:' + i + '">' +
        '<article class="service-card">' +
          '<span class="service-card__top">' +
            '<span class="mono service-card__num">' + String(i + 1).padStart(2, '0') + '</span>' +
            '<span class="icon-tile">' + glyph(s.icon, 'icon') + '</span>' +
          '</span>' +
          '<h3 class="service-card__title">' + t(s.title, 'services.items.title') + '</h3>' +
          '<p class="service-card__desc">' + t(s.description, 'services.items.description') + '</p>' +
          '<span class="service-card__foot">' +
            (has(s.price) ? '<span class="service-card__price mono">' + t(s.price, 'services.items.price') + '</span>' : '<span></span>') +
            '<span class="link-arrow">' + uiIcon('arrow-up-right', 'icon') + '</span>' +
          '</span>' +
        '</article></li>';
    }).join('');

    return '<div class="container">' +
      sectionHead({
        eyebrow: 'Services',
        eyebrowPath: 'services.heading',
        heading: g.heading || 'What I do',
        headingPath: 'services.heading',
        subtitle: g.subtitle,
        subtitlePath: 'services.subtitle',
        id: 'servicesTitle'
      }) +
      '<ol class="service-grid" data-stagger style="--cols:' + columnCount(items.length) + '">' + cards + '</ol></div>';
  }

  /* ------------------------------------------------------------------
     featured work
     ------------------------------------------------------------------ */

  function renderWork() {
    var g = CONFIG.work || {};
    var items = activeItems(g);
    if (!items.length) return '';

    /* work grid: a lead card spans the full row, the rest pair up */
    var cols = items.length === 1 ? 1 : 2;
    var leadSpan = (items.length === 3 || items.length > 4) ? 2 : 1;

    var cards = items.map(function (w, i) {
      var link = str(w.link) || '#';
      var tags = (w.tags || []).filter(function (tag) { return has(tag); });
      return '<li class="work-grid__item' + (i === 0 && leadSpan === 2 ? ' work-grid__item--lead' : '') + '"' +
        ' data-reveal style="--i:' + i + ';--reveal-delay:' + (i * 90) + 'ms">' +
        '<a class="work-card" href="' + esc(link) + '"' + attrsFor(link) + '>' +
          '<span class="work-card__media">' +
            frame({
              src: w.image,
              alt: w.imageAlt,
              label: '[PROJECT IMAGE]',
              monogram: '',
              modifier: 'frame--work'
            }) +
          '</span>' +
          '<span class="work-card__body">' +
            (tags.length ? '<span class="tag-row">' + tags.map(function (tag) {
              return '<span class="tag">' + t(tag, 'work.items.tags') + '</span>';
            }).join('') + '</span>' : '') +
            '<span class="work-card__title">' + t(w.title, 'work.items.title') + '</span>' +
            (has(w.description) ? '<span class="work-card__desc">' + t(w.description, 'work.items.description') + '</span>' : '') +
            '<span class="link-arrow link-arrow--accent"><span>' + esc('View') + '</span>' + uiIcon('arrow-right', 'icon') + '</span>' +
          '</span>' +
        '</a></li>';
    }).join('');

    return '<div class="container">' +
      sectionHead({
        eyebrow: 'Selected work',
        eyebrowPath: 'work.heading',
        heading: g.heading || 'Featured Work',
        headingPath: 'work.heading',
        subtitle: g.subtitle,
        subtitlePath: 'work.subtitle',
        id: 'workTitle'
      }) +
      '<ul class="work-grid" data-stagger style="--work-cols:' + cols + ';--lead-span:' + leadSpan + '">' + cards + '</ul></div>';
  }

  /* ------------------------------------------------------------------
     proof
     ------------------------------------------------------------------ */

  function renderProof() {
    var g = CONFIG.proof || {};
    var stats = (g.stats || []).filter(function (s) { return s && has(s.value); });
    var quotes = (g.testimonials || []).filter(function (q) { return q && has(q.quote); });
    if (!stats.length && !quotes.length) return '';

    var html = '<div class="container">' + sectionHead({
      eyebrow: 'Proof',
      eyebrowPath: 'proof.heading',
      heading: g.heading || 'Results',
      headingPath: 'proof.heading',
      subtitle: g.subtitle,
      subtitlePath: 'proof.subtitle',
      id: 'proofTitle'
    });

    if (stats.length) {
      html += '<ul class="stat-grid" data-stagger>' + stats.map(function (s, i) {
        return '<li class="stat-grid__item" style="--i:' + i + '">' +
          '<p class="stat__value">' + t(s.value, 'proof.stats.value') + '</p>' +
          '<p class="stat__label">' + t(s.label, 'proof.stats.label') + '</p></li>';
      }).join('') + '</ul>';
    }

    if (quotes.length) {
      html += '<ul class="quote-grid" data-stagger>' + quotes.map(function (q, i) {
        return '<li class="quote-grid__item" style="--i:' + i + '">' +
          '<figure class="quote">' +
            '<span class="quote__mark" aria-hidden="true">\u201c</span>' +
            '<blockquote class="quote__text">' + t(q.quote, 'proof.testimonials.quote') + '</blockquote>' +
            '<figcaption class="quote__by">' +
              '<span class="quote__name">' + t(q.name, 'proof.testimonials.name') + '</span>' +
              (has(q.role) ? '<span class="quote__role">' + t(q.role, 'proof.testimonials.role') + '</span>' : '') +
            '</figcaption>' +
          '</figure></li>';
      }).join('') + '</ul>';
    }

    return html + '</div>';
  }

  /* ------------------------------------------------------------------
     contact
     ------------------------------------------------------------------ */

  function renderContact() {
    var g = CONFIG.contact || {};
    var methods = (g.methods || []).filter(function (m) { return m && m.enabled !== false && has(m.label) && has(m.value); });
    var socials = activeItems(CONFIG.socials);
    var socialsVisible = (CONFIG.socials || {}).enabled !== false && socials.length && doc.getElementById('social');

    var methodList = methods.length
      ? '<ul class="method-list"' + revealDelay(120) + ' data-reveal>' + methods.map(function (m) {
          var href = str(m.url) || '#';
          return '<li><a class="method" href="' + esc(href) + '"' + attrsFor(href) + '>' +
            '<span class="method__icon">' + platformIcon(m.type) + '</span>' +
            '<span class="method__body"><span class="method__label">' + t(m.label, 'contact.methods.label') + '</span>' +
            '<span class="method__value">' + t(m.value, 'contact.methods.value') + '</span></span>' +
            '<span class="method__arrow">' + uiIcon('arrow-up-right', 'icon') + '</span></a></li>';
        }).join('') + '</ul>'
      : '';

    var secondary = g.secondary && socialsVisible
      ? btn({ label: g.secondary.label, href: g.secondary.href }, 'ghost', 'contact.secondary', 'arrow-up-right')
      : '';

    return '<div class="container">' +
      '<div class="contact-panel"' + revealDelay(60) + ' data-reveal="mask">' +
        '<span class="contact-panel__glow" aria-hidden="true"></span>' +
        '<div class="contact-panel__inner">' +
          eyebrow('Contact', 'contact.heading') +
          '<h2 class="display contact__title" id="contactTitle">' + t(g.heading || "Let's build something great.", 'contact.heading') + '</h2>' +
          (has(g.description) ? '<p class="lead contact__desc">' + t(g.description, 'contact.description') + '</p>' : '') +
          '<div class="btn-row">' + btn(g.primary, 'primary', 'contact.primary', 'send') + secondary + '</div>' +
          methodList +
        '</div>' +
      '</div></div>';
  }

  /* ------------------------------------------------------------------
     footer
     ------------------------------------------------------------------ */

  function renderFooter() {
    var c = CONFIG.client || {};
    var f = CONFIG.footer || {};
    var year = new Date().getFullYear();
    var holder = has(f.copyrightName) ? str(f.copyrightName) : str(c.name);

    var nav = (CONFIG.nav || []).filter(function (l) { return l && has(l.label) && doc.getElementById(str(l.target)); });
    var socials = activeItems(CONFIG.socials);
    var methods = ((CONFIG.contact || {}).methods || []).filter(function (m) { return m && m.enabled !== false && has(m.value); });

    var navCol = nav.length
      ? '<nav class="footer__col" aria-label="Footer"><h2 class="footer__heading">Navigate</h2><ul class="footer__list">' +
        nav.map(function (l) {
          return '<li><a class="footer__link" href="#' + esc(str(l.target)) + '">' + t(l.label, 'nav') + '</a></li>';
        }).join('') + '</ul></nav>'
      : '';

    var contactCol = f.showContact !== false && methods.length
      ? '<div class="footer__col"><h2 class="footer__heading">Contact</h2><ul class="footer__list">' + methods.map(function (m) {
          var href = str(m.url) || '#';
          return '<li><a class="footer__link" href="' + esc(href) + '"' + attrsFor(href) + '>' + t(m.value, 'contact.methods.value') + '</a></li>';
        }).join('') + '</ul></div>'
      : '';

    var socialCol = f.showSocials !== false && (CONFIG.socials || {}).enabled !== false && socials.length
      ? '<div class="footer__col"><h2 class="footer__heading">Elsewhere</h2>' + socialLinks('social-links--footer') + '</div>'
      : '';

    return '<div class="container footer__inner">' +
      '<div class="footer__brand">' + brandMarkup('brand--footer') +
      (has(f.description) ? '<p class="footer__desc">' + t(f.description, 'footer.description') + '</p>' : '') + '</div>' +
      navCol + contactCol + socialCol +
      '</div>' +
      '<div class="container footer__bottom">' +
        '<p class="footer__copy">' + uiIcon('compass', 'icon footer__copy-icon') +
          '<span>' + esc('\u00a9 ' + year + ' ' + holder + '. All rights reserved.') + '</span></p>' +
        (has(f.note) ? '<p class="footer__note">' + t(f.note, 'footer.note') + '</p>' : '') +
      '</div>';
  }

  /* ------------------------------------------------------------------
     render pipeline
     ------------------------------------------------------------------ */

  function paint(key, html) {
    var node = doc.querySelector('[data-render="' + key + '"]');
    if (!node) return;
    if (!html) { node.parentNode.removeChild(node); return; }
    node.innerHTML = html;
    node.removeAttribute('hidden');
  }

  var RENDERERS = {
    hero: renderHero,
    socials: (CONFIG.socials || {}).enabled === false ? function () { return ''; } : renderSocials,
    about: (CONFIG.about || {}).enabled === false ? function () { return ''; } : renderAbout,
    services: (CONFIG.services || {}).enabled === false ? function () { return ''; } : renderServices,
    work: (CONFIG.work || {}).enabled === false ? function () { return ''; } : renderWork,
    proof: (CONFIG.proof || {}).enabled === false ? function () { return ''; } : renderProof,
    contact: (CONFIG.contact || {}).enabled === false ? function () { return ''; } : renderContact
  };

  function renderAll() {
    doc.getElementById('site-header-root').innerHTML = renderHeader();
    Object.keys(RENDERERS).forEach(function (key) { paint(key, RENDERERS[key]()); });
    doc.querySelector('[data-render="footer"]').innerHTML = renderFooter();

    if ((CONFIG.features || {}).backToTop !== false) {
      doc.body.insertAdjacentHTML('beforeend',
        '<button class="to-top" type="button" data-action="top" aria-label="Back to top">' +
        uiIcon('arrow-up-right', 'icon') + '</button>');
    }
  }

  /* ------------------------------------------------------------------
     theme + accent
     ------------------------------------------------------------------ */

  function hexToRgb(hex) {
    var h = str(hex).replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    if (!/^[0-9a-f]{6}$/i.test(h)) return null;
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }

  function setAccent(hex) {
    var rgb = hexToRgb(hex);
    if (!rgb) return;
    var lum = (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255;
    root.style.setProperty('--accent', str(hex));
    root.style.setProperty('--accent-soft', 'rgba(' + rgb.join(',') + ', .13)');
    root.style.setProperty('--accent-line', 'rgba(' + rgb.join(',') + ', .34)');
    root.style.setProperty('--accent-glow', 'rgba(' + rgb.join(',') + ', .28)');
    root.style.setProperty('--accent-ink', lum > 0.6 ? '#14110a' : '#ffffff');
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', str(hex));
  }

  var THEME_KEY = 'pb-theme';

  function applyTheme(mode, persist) {
    var next = mode === 'light' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    $$('[data-action="theme"]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(next === 'light'));
      btn.setAttribute('aria-label', next === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    });
    if (persist) { try { localStorage.setItem(THEME_KEY, next); } catch (e) {} }
  }

  function applyFonts() {
    var fonts = (CONFIG.theme || {}).fonts || {};
    if (has(fonts.display)) root.style.setProperty('--font-display', str(fonts.display));
    if (has(fonts.body)) root.style.setProperty('--font-body', str(fonts.body));
  }

  function applyRadius() {
    var r = (CONFIG.theme || {}).radius;
    if (typeof r === 'number' && r > 0) {
      root.style.setProperty('--radius', r + 'px');
      root.style.setProperty('--radius-sm', Math.max(4, Math.round(r * 0.55)) + 'px');
      root.style.setProperty('--radius-lg', Math.round(r * 1.45) + 'px');
    }
  }

  /* ------------------------------------------------------------------
     meta + structured data
     ------------------------------------------------------------------ */

  function applyMeta() {
    var meta = CONFIG.meta || {};
    var title = has(meta.title) ? str(meta.title) : str((CONFIG.client || {}).name);
    var description = has(meta.description) ? str(meta.description) : str((CONFIG.client || {}).tagline);
    var image = str(meta.image);

    doc.title = title;
    var pairs = {
      'description': description,
      'og:title': title,
      'og:description': description,
      'og:type': 'profile',
      'og:image': image,
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': image
    };
    if (has(meta.url)) pairs['og:url'] = str(meta.url);

    Object.keys(pairs).forEach(function (key) {
      if (!pairs[key]) return;
      var attr = key.indexOf(':') > -1 ? 'property' : 'name';
      var el = doc.querySelector('meta[' + attr + '="' + key + '"]');
      if (!el) {
        el = doc.createElement('meta');
        el.setAttribute(attr, key);
        doc.head.appendChild(el);
      }
      el.setAttribute('content', pairs[key]);
    });

    var logo = $('link[rel="icon"]');
    if (logo) logo.setAttribute('href', 'assets/branding/favicon.svg');
  }

  function applyStructuredData() {
    var c = CONFIG.client || {};
    var clean = function (v) { return has(v) && !isPh(v) ? str(v) : ''; };
    var sameAs = activeItems(CONFIG.socials).map(function (s) { return clean(s.url); }).filter(function (u) { return external(u); });
    var knowsAbout = activeItems(CONFIG.services).map(function (s) { return clean(s.title); }).filter(Boolean);

    var person = { '@type': 'Person', name: str(c.name) };
    if (clean(c.role)) person.jobTitle = clean(c.role);
    if (clean(c.tagline)) person.description = clean(c.tagline);
    if (clean(c.profileImage)) person.image = clean(c.profileImage);
    if (clean((CONFIG.meta || {}).url)) person.url = clean(CONFIG.meta.url);
    if (sameAs.length) person.sameAs = sameAs;
    if (knowsAbout.length) person.knowsAbout = knowsAbout;
    if (clean(c.location)) person.address = { '@type': 'PostalAddress', addressLocality: clean(c.location) };

    var email = ((CONFIG.contact || {}).methods || []).filter(function (m) {
      return m && m.enabled !== false && m.type === 'mail' && clean(m.value);
    })[0];
    if (email) person.email = clean(email.value);

    var existing = doc.querySelector('script[data-pb-schema]');
    if (existing) existing.parentNode.removeChild(existing);
    var tag = doc.createElement('script');
    tag.type = 'application/ld+json';
    tag.setAttribute('data-pb-schema', '');
    tag.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': [person] });
    doc.head.appendChild(tag);
  }

  /* ------------------------------------------------------------------
     images: fall back to the designed empty state
     ------------------------------------------------------------------ */

  function watchFrames() {
    $$('.frame[data-empty]').forEach(function (frame) {
      var img = $('img', frame);
      if (!img) return;
      var loaded = function () { frame.setAttribute('data-empty', 'false'); };
      var failed = function () { frame.setAttribute('data-empty', 'true'); };
      if (img.complete && img.naturalWidth > 0) loaded();
      else { img.addEventListener('load', loaded, { once: true }); img.addEventListener('error', failed, { once: true }); }
    });
    $$('.social-card__cover img').forEach(function (img) {
      img.addEventListener('error', function () { img.parentNode.style.display = 'none'; }, { once: true });
    });
  }

  /* ------------------------------------------------------------------
     motion
     ------------------------------------------------------------------ */

  function prefersReduced() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function setupReveal() {
    $$('[data-stagger]').forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (child, i) {
        if (!child.hasAttribute('data-reveal')) child.setAttribute('data-reveal', '');
        if (child.style.getPropertyValue('--i') === '') {
          child.style.setProperty('--i', String(i));
        }
      });
    });

    var items = $$('[data-reveal]');

    if (prefersReduced() || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add('is-visible');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    items.forEach(function (el) {
      var i = parseInt(el.style.getPropertyValue('--i'), 10);
      if (!isNaN(i) && !el.style.getPropertyValue('--reveal-delay')) {
        el.style.setProperty('--reveal-delay', Math.min(i * 70, 420) + 'ms');
      }
      io.observe(el);
    });
  }

  /* ------------------------------------------------------------------
     header behaviour
     ------------------------------------------------------------------ */

  function setupHeader() {
    var header = $('#siteHeader');
    if (!header) return;
    var ticking = false;

    var update = function () {
      var y = window.pageYOffset || doc.documentElement.scrollTop;
      header.classList.toggle('is-scrolled', y > 24);
      var top = $('[data-action="top"]');
      if (top) top.classList.toggle('is-visible', y > 640);
      ticking = false;
    };

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });

    update();
  }

  function setupActiveNav() {
    var links = $$('[data-nav]');
    if (!links.length || !('IntersectionObserver' in window)) return;

    var sections = links.map(function (l) { return doc.getElementById(l.getAttribute('data-nav')); })
      .filter(function (s, i) { return !!s; });

    var setActive = function (id) {
      links.forEach(function (l) {
        var on = l.getAttribute('data-nav') === id;
        l.classList.toggle('is-active', on);
        if (on) l.setAttribute('aria-current', 'true');
        else l.removeAttribute('aria-current');
      });
    };

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (s) { io.observe(s); });
  }

  /* ------------------------------------------------------------------
     mobile menu
     ------------------------------------------------------------------ */

  function setupMenu() {
    var menu = $('[data-mobile-menu]');
    var trigger = $('[data-action="menu"]');
    if (!menu || !trigger) return;

    var panel = $('.mobile-menu__panel', menu);
    var open = false;
    var lastFocus = null;

    function setOpen(state) {
      open = state;
      menu.hidden = false;
      root.classList.toggle('nav-open', state);
      trigger.setAttribute('aria-expanded', String(state));
      trigger.setAttribute('aria-label', state ? 'Close menu' : 'Open menu');
      var label = $('.sr-only', trigger);
      if (label) label.textContent = state ? 'Close menu' : 'Open menu';

      if (state) {
        if (prefersReduced()) menu.classList.add('is-open');
        else window.requestAnimationFrame(function () { menu.classList.add('is-open'); });
        var first = $('a, button', panel);
        if (first) first.focus({ preventScroll: true });
      } else {
        menu.classList.remove('is-open');
        window.setTimeout(function () {
          if (!open) menu.hidden = true;
        }, 320);
        if (lastFocus) lastFocus.focus({ preventScroll: true });
      }
    }

    trigger.addEventListener('click', function () {
      lastFocus = trigger;
      setOpen(!open);
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    doc.addEventListener('keydown', function (e) {
      if (!open) return;
      if (e.key === 'Escape') { setOpen(false); return; }
      if (e.key !== 'Tab') return;

      var focusables = $$('a[href], button:not([disabled])', panel).filter(function (el) {
        return el.offsetParent !== null;
      });
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    var wide = window.matchMedia('(min-width: 961px)');
    var onChange = function (e) { if (e.matches && open) setOpen(false); };
    if (wide.addEventListener) wide.addEventListener('change', onChange);
    else if (wide.addListener) wide.addListener(onChange);
  }

  /* ------------------------------------------------------------------
     global controls
     ------------------------------------------------------------------ */

  function setupControls() {
    doc.addEventListener('click', function (e) {
      var el = e.target.closest('[data-action]');
      if (!el) return;

      if (el.getAttribute('data-action') === 'theme') {
        applyTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light', true);
      }
      if (el.getAttribute('data-action') === 'ph') {
        var on = !root.classList.contains('show-ph');
        root.classList.toggle('show-ph', on);
        el.setAttribute('aria-pressed', String(on));
      }
      if (el.getAttribute('data-action') === 'top') {
        window.scrollTo({ top: 0, behavior: prefersReduced() ? 'auto' : 'smooth' });
      }
    });
  }

  function setupAnchors() {
    doc.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var id = link.getAttribute('href');
      if (!id || id === '#') return;
      var target = doc.getElementById(id.slice(1));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block: 'start' });
      try { if (history.replaceState) history.replaceState(null, '', id); } catch (err) {}
    });
  }

  /* ------------------------------------------------------------------
     boot
     ------------------------------------------------------------------ */

  function boot() {
    var theme = CONFIG.theme || {};
    setAccent(theme.accent || '#d8b26b');
    applyFonts();
    applyRadius();

    var stored = null;
    try { stored = localStorage.getItem(THEME_KEY); } catch (e) {}
    applyTheme(stored || theme.default || 'dark', false);

    if (theme.accent) root.classList.add('has-custom-accent');
    if ((CONFIG.features || {}).placeholderHighlight !== false) root.classList.add('show-ph');

    renderAll();
    watchFrames();
    setupReveal();
    setupHeader();
    setupActiveNav();
    setupMenu();
    setupControls();
    setupAnchors();
    applyMeta();
    applyStructuredData();

    doc.body.classList.add('is-ready');

    window.PB = {
      config: CONFIG,
      setAccent: setAccent,
      setTheme: function (m) { applyTheme(m, true); }
    };
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
