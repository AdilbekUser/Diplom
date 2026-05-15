/* ═══════════════════════════════════════════════════════════════════════════
   ORDA Smart Event System — map.js
   Полноценная интерактивная карта площадок и мероприятий
   Leaflet.js + OpenStreetMap
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  function currentLang() {
    return (window.ORDA && window.ORDA.lang) || localStorage.getItem('lang') || 'ru';
  }

  function t(key) {
    return (window.ORDA && window.ORDA.i18n && window.ORDA.i18n.translate(currentLang(), key)) || key;
  }

  function tr(key, vars) {
    let value = t(key);
    Object.entries(vars || {}).forEach(([name, payload]) => {
      value = value.replaceAll(`{{${name}}}`, String(payload));
    });
    return value;
  }

  function locale() {
    const lang = currentLang();
    return lang === 'kk' ? 'kk-KZ' : lang === 'en' ? 'en-US' : 'ru-RU';
  }

  /* ── Данные площадок ──────────────────────────────────────────────────── */
  const VENUES = [
    {
      id: 'h_grand',
      name: 'Grand Hall A',
      type: 'conference',
      typeKey: 'mapTypeConference',
      city: 'floor1',
      cityKey: 'mapFloor1',
      address: '1 этаж · Central Wing · вход A',
      lat: 51.0907,
      lng: 71.4190,
      capacity: 420,
      status: 'soon',
      statusKey: 'mapLegendSoon',
      description: 'Флагманский зал для форумов, keynote-сессий и крупных конференций. Пространство оснащено сценическим светом, LED-экраном, зонами регистрации и синхронным переводом.',
      nextEvent: 'AI & Innovation Summit 2026',
      nextDate: '2026-06-05',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=700&q=80',
      equipment: ['LED wall 12m', 'Stage lighting', 'Translation booths', 'Broadcast desk', 'VIP entrance'],
      events: [
        { title: 'AI & Innovation Summit 2026', date: '5 июня 2026', time: '10:00', status: 'soon', attendees: 380 },
        { title: 'Cybersecurity Day Kazakhstan', date: '7 октября 2026', time: '09:00', status: 'upcoming', attendees: 300 },
      ],
      freeDates: ['2026-05-20', '2026-05-27', '2026-06-12', '2026-07-01', '2026-07-08'],
    },
    {
      id: 'h_atrium',
      name: 'Atrium Expo Space',
      type: 'expo',
      typeKey: 'mapTypeExpo',
      city: 'floor1',
      cityKey: 'mapFloor1',
      address: '1 этаж · Main Atrium · зона регистрации',
      lat: 51.0903,
      lng: 71.4197,
      capacity: 650,
      status: 'busy',
      statusKey: 'mapLegendBusy',
      description: 'Открытое выставочное пространство для стендов, партнерских зон, нетворкинга и демонстрации технологических решений перед основными сессиями.',
      nextEvent: 'Business Technology Expo 2026',
      nextDate: '2026-05-13',
      image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=700&q=80',
      equipment: ['Expo booths', 'Registration desks', 'Media wall', 'Sponsor zones', 'Catering line'],
      events: [
        { title: 'Business Technology Expo 2026', date: '13–15 мая 2026', time: '10:00', status: 'busy', attendees: 620 },
      ],
      freeDates: ['2026-06-10', '2026-06-17', '2026-07-15', '2026-08-05'],
    },
    {
      id: 'h_orion',
      name: 'Orion Hall B',
      type: 'conference',
      typeKey: 'mapTypeConference',
      city: 'floor2',
      cityKey: 'mapFloor2',
      address: '2 этаж · North Wing · секционный блок',
      lat: 51.0910,
      lng: 71.4200,
      capacity: 180,
      status: 'free',
      statusKey: 'mapLegendFree',
      description: 'Универсальный зал для корпоративных конференций, презентаций продуктов и гибридных программ с отдельной зоной для спикеров.',
      nextEvent: 'Smart Business Forum',
      nextDate: '2026-09-12',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=700&q=80',
      equipment: ['4K projector', 'Zoom room', 'Acoustic system', 'Video wall', 'Hybrid kit'],
      events: [
        { title: 'Smart Business Forum', date: '12 сентября 2026', time: '10:30', status: 'upcoming', attendees: 160 },
      ],
      freeDates: ['2026-05-16', '2026-05-23', '2026-06-01', '2026-06-08', '2026-06-22'],
    },
    {
      id: 'h_workshop',
      name: 'Workshop Hub C',
      type: 'business',
      typeKey: 'mapTypeBusiness',
      city: 'floor2',
      cityKey: 'mapFloor2',
      address: '2 этаж · South Wing · учебный кластер',
      lat: 51.0906,
      lng: 71.4205,
      capacity: 90,
      status: 'free',
      statusKey: 'mapLegendFree',
      description: 'Гибкое пространство для тренингов, дизайн-сессий, образовательных интенсивов и командных workshop-программ.',
      nextEvent: 'Product Community Meetup',
      nextDate: '2026-05-28',
      image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=700&q=80',
      equipment: ['Modular furniture', 'Flipcharts', 'VR kit', 'Interactive panels', 'Team zones'],
      events: [
        { title: 'Product Community Meetup', date: '28 мая 2026', time: '18:30', status: 'upcoming', attendees: 80 },
      ],
      freeDates: ['2026-05-18', '2026-05-21', '2026-06-01', '2026-06-07', '2026-06-14'],
    },
    {
      id: 'h_board',
      name: 'Boardroom D',
      type: 'business',
      typeKey: 'mapTypeBusiness',
      city: 'floor3',
      cityKey: 'mapFloor3',
      address: '3 этаж · Executive Zone · переговорная',
      lat: 51.0914,
      lng: 71.4194,
      capacity: 36,
      status: 'free',
      statusKey: 'mapLegendFree',
      description: 'Закрытая переговорная для совещаний руководителей, стратегических встреч и private briefing-сессий с отдельным лобби.',
      nextEvent: 'Finance Briefing 2026',
      nextDate: '2026-11-19',
      image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=700&q=80',
      equipment: ['Video conference', 'Smart display', 'Coffee station', 'Private lobby'],
      events: [
        { title: 'Finance Briefing 2026', date: '19 ноября 2026', time: '09:30', status: 'upcoming', attendees: 28 },
      ],
      freeDates: ['2026-05-15', '2026-05-22', '2026-06-05', '2026-06-19'],
    },
    {
      id: 'h_silk',
      name: 'Silk Road Conference Room',
      type: 'conference',
      typeKey: 'mapTypeConference',
      city: 'floor3',
      cityKey: 'mapFloor3',
      address: '3 этаж · East Wing · пресс-зона',
      lat: 51.0916,
      lng: 71.4201,
      capacity: 120,
      status: 'busy',
      statusKey: 'mapLegendBusy',
      description: 'Премиальный конференц-зал для международных деловых встреч, пресс-конференций и переговоров с системой синхронного перевода.',
      nextEvent: 'FinTech Conference Central Asia',
      nextDate: '2026-08-20',
      image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=700&q=80',
      equipment: ['Conference table', 'Interpretation system', 'Wireless microphones', 'Press wall'],
      events: [
        { title: 'FinTech Conference Central Asia', date: '20 августа 2026', time: '11:00', status: 'busy', attendees: 110 },
      ],
      freeDates: ['2026-06-03', '2026-06-17', '2026-07-08', '2026-07-22'],
    },
    {
      id: 'h_nova',
      name: 'Nova Training Lab',
      type: 'business',
      typeKey: 'mapTypeBusiness',
      city: 'floor4',
      cityKey: 'mapFloor4',
      address: '4 этаж · Education Cluster · лаборатория',
      lat: 51.0920,
      lng: 71.4198,
      capacity: 54,
      status: 'free',
      statusKey: 'mapLegendFree',
      description: 'Учебная лаборатория для практических семинаров, сертификаций, интенсивов и hands-on занятий с записью занятий.',
      nextEvent: 'Education Seminar: AI in Learning',
      nextDate: '2026-06-26',
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=700&q=80',
      equipment: ['Laptops', 'Smart board', 'Lab desks', 'Recording camera'],
      events: [
        { title: 'Education Seminar: AI in Learning', date: '26 июня 2026', time: '14:00', status: 'upcoming', attendees: 50 },
      ],
      freeDates: ['2026-05-20', '2026-06-03', '2026-06-17', '2026-07-08'],
    },
    {
      id: 'h_sky',
      name: 'Skyline Networking Lounge',
      type: 'venue',
      typeKey: 'mapTypeVenue',
      city: 'floor5',
      cityKey: 'mapFloor5',
      address: '5 этаж · Panorama Zone · lounge',
      lat: 51.0923,
      lng: 71.4203,
      capacity: 110,
      status: 'soon',
      statusKey: 'mapLegendSoon',
      description: 'Лаунж-пространство для afterparty, coffee break, VIP networking и неформальных встреч участников с панорамным видом.',
      nextEvent: 'HR Leadership Forum networking',
      nextDate: '2026-06-18',
      image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=700&q=80',
      equipment: ['Lounge seating', 'Catering line', 'Ambient audio', 'City view'],
      events: [
        { title: 'HR Leadership Forum networking', date: '18 июня 2026', time: '17:00', status: 'soon', attendees: 95 },
      ],
      freeDates: ['2026-05-23', '2026-07-04', '2026-07-18'],
    },
  ];

  /* ── Бегущая строка событий ─────────────────────────────────────────── */
  const TICKER_EVENTS = [
    { title: 'Business Technology Expo 2026', venue: 'Atrium Expo Space', date: '13–15 мая', status: 'busy' },
    { title: 'AI & Innovation Summit 2026', venue: 'Grand Hall A', date: '5 июня', status: 'soon' },
    { title: 'HR Leadership Forum networking', venue: 'Skyline Lounge', date: '18 июня', status: 'soon' },
    { title: 'Education Seminar: AI in Learning', venue: 'Nova Training Lab', date: '26 июня', status: 'upcoming' },
    { title: 'Smart Business Forum', venue: 'Orion Hall B', date: '12 сентября', status: 'upcoming' },
  ];

  /* ── Стейт ────────────────────────────────────────────────────────────── */
  let map = null;
  let markers = {};
  let activeVenueId = null;
  let activeDrawerTab = 'info';
  let viewMode = 'list'; // 'list' | 'grid'
  let filters = { city: 'all', type: 'all', capacity: 'all', status: 'all', search: '' };

  function venueTypeLabel(venue) {
    return t(venue.typeKey || 'mapTypeConference');
  }

  function venueFloorLabel(venue) {
    return t(venue.cityKey || 'mapFloorAll');
  }

  function venueStatusLabel(venue) {
    return t(venue.statusKey || 'mapLegendFree');
  }

  /* ── Инициализация ────────────────────────────────────────────────────── */
  function init() {
    if (!document.getElementById('mapContainer')) return;
    if (typeof L === 'undefined') {
      setTimeout(init, 300);
      return;
    }
    buildMap();
    buildVenueList();
    buildTicker();
    bindFilters();
    bindFloorSelector();
    bindDrawer();
    bindViewToggle();
  }

  /* ── Карта Leaflet ────────────────────────────────────────────────────── */
  function buildMap() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    map = L.map('mapContainer', {
      center: [51.0914, 71.4198],
      zoom: 16,
      zoomControl: false,
      attributionControl: true,
    });

    // OpenStreetMap tiles with subtle style
    const tileUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    L.tileLayer(tileUrl, {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Zoom controls custom position
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Markers
    VENUES.forEach(venue => addMarker(venue));
  }

  function getMarkerIcon(venue) {
    const colors = {
      free: '#0D7A54',
      busy: '#B02828',
      soon: '#B8722A',
    };
    const color = colors[venue.status] || '#1B3F78';
    const pulse = venue.status === 'soon' ? `
      <div style="
        position:absolute;top:50%;left:50%;
        transform:translate(-50%,-50%);
        width:36px;height:36px;
        border-radius:50%;
        background:${color}33;
        animation:mapPulse 1.8s ease-out infinite;
      "></div>` : '';

    const typeIcons = {
      conference: 'H',
      expo: 'E',
      business: 'M',
      venue: 'L',
    };
    const icon = typeIcons[venue.type] || 'P';

    const html = `
      <div class="map-marker-wrap" data-status="${venue.status}">
        ${pulse}
        <div class="map-marker-pin" style="background:${color};box-shadow:0 4px 16px ${color}55">
          <span class="map-marker-icon">${icon}</span>
        </div>
        <div class="map-marker-label">${venue.name}</div>
      </div>`;

    return L.divIcon({
      html,
      className: '',
      iconSize: [48, 64],
      iconAnchor: [24, 56],
      popupAnchor: [0, -58],
    });
  }

  function addMarker(venue) {
    const marker = L.marker([venue.lat, venue.lng], { icon: getMarkerIcon(venue) })
      .addTo(map)
      .bindPopup(buildPopupHtml(venue), {
        maxWidth: 280,
        minWidth: 260,
        className: 'orda-popup',
        closeButton: false,
        offset: [0, -8],
      });

    marker.on('click', () => {
      highlightSidebarItem(venue.id);
    });

    // Popup action buttons
    marker.on('popupopen', () => {
      setTimeout(() => {
        const detailBtn = document.querySelector('.map-popup-detail-btn');
        const bookBtn = document.querySelector('.map-popup-book-btn');
        if (detailBtn) detailBtn.addEventListener('click', () => openDrawer(venue.id));
        if (bookBtn) bookBtn.addEventListener('click', () => openBookingFromMap(venue));
      }, 50);
    });

    markers[venue.id] = marker;
  }

  function buildPopupHtml(venue) {
    const statusClass = { free: 'status-free', busy: 'status-busy', soon: 'status-soon' }[venue.status] || '';
    const capacityStr = venue.capacity >= 1000
      ? (venue.capacity / 1000).toFixed(1) + 'K'
      : `${venue.capacity} ${t('mapPeopleShort')}`;

    return `
      <div class="map-popup">
        <div class="map-popup-img" style="background-image:url('${venue.image}')"></div>
        <div class="map-popup-body">
          <div class="map-popup-meta">
            <span class="map-popup-type">${venueTypeLabel(venue)}</span>
            <span class="map-status-badge ${statusClass}">${venueStatusLabel(venue)}</span>
          </div>
          <h4 class="map-popup-title">${venue.name}</h4>
          <p class="map-popup-address">${venue.address}</p>
          <div class="map-popup-stats">
            <span>👥 ${capacityStr}</span>
            <span>📅 ${venue.nextDate}</span>
          </div>
          <p class="map-popup-event">▶ ${venue.nextEvent}</p>
          <div class="map-popup-actions">
            <button class="map-popup-detail-btn">${t('details')}</button>
            <button class="map-popup-book-btn secondary">${t('hallBookButton')}</button>
          </div>
        </div>
      </div>`;
  }

  /* ── Список площадок в сайдбаре ───────────────────────────────────────── */
  function buildVenueList() {
    const filtered = getFiltered();
    const container = document.getElementById('mapVenueList');
    if (!container) return;

    const countEl = document.getElementById('mapSidebarCount');
    if (countEl) countEl.textContent = `${t('mapSidebarTitle')} · ${filtered.length}`;

    container.innerHTML = '';

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="map-empty">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="var(--line)" stroke-width="2"/>
            <path d="M14 20h12M20 14v12" stroke="var(--muted)" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <p>${t('mapEmptyTitle')}</p>
          <span>${t('mapEmptyText')}</span>
        </div>`;
      return;
    }

    filtered.forEach(venue => {
      const el = document.createElement('button');
      el.className = 'map-venue-card' + (viewMode === 'grid' ? ' map-venue-card--grid' : '');
      el.dataset.venueId = venue.id;

      const statusClass = { free: 'status-free', busy: 'status-busy', soon: 'status-soon' }[venue.status] || '';
      const capacityStr = venue.capacity >= 1000
        ? (venue.capacity / 1000).toFixed(1) + 'K+'
        : venue.capacity + '';

      el.innerHTML = `
        <div class="map-venue-img" style="background-image:url('${venue.image}')">
          <span class="map-status-badge ${statusClass}">${venueStatusLabel(venue)}</span>
        </div>
        <div class="map-venue-body">
          <div class="map-venue-type">${venueTypeLabel(venue)} · ${venueFloorLabel(venue)}</div>
          <div class="map-venue-name">${venue.name}</div>
          <div class="map-venue-address">${venue.address}</div>
          <div class="map-venue-footer">
            <span class="map-venue-capacity">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="4" r="2" stroke="currentColor" stroke-width="1.3"/><path d="M1.5 11c0-2.5 2-4.5 4.5-4.5S10.5 8.5 10.5 11" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
              ${capacityStr} ${t('mapPeopleShort')}
            </span>
            <span class="map-venue-event">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="2" width="10" height="9" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M1 5h10M4 1v2M8 1v2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
              ${venue.nextDate}
            </span>
          </div>
        </div>`;

      el.addEventListener('click', () => {
        flyToVenue(venue);
        openDrawer(venue.id);
      });

      container.appendChild(el);
    });
  }

  function getFiltered() {
    return VENUES.filter(v => {
      if (filters.city !== 'all' && v.city !== filters.city) return false;
      if (filters.type !== 'all' && v.type !== filters.type) return false;
      if (filters.capacity !== 'all') {
        if (filters.capacity === 'small' && v.capacity >= 100) return false;
        if (filters.capacity === 'medium' && (v.capacity < 100 || v.capacity >= 500)) return false;
        if (filters.capacity === 'large' && v.capacity < 500) return false;
      }
      if (filters.status !== 'all' && v.status !== filters.status) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!v.name.toLowerCase().includes(q) &&
            !v.address.toLowerCase().includes(q) &&
            !v.nextEvent.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }

  function highlightSidebarItem(id) {
    document.querySelectorAll('.map-venue-card').forEach(el => {
      el.classList.toggle('active', String(el.dataset.venueId) === String(id));
    });
    const active = document.querySelector('.map-venue-card.active');
    if (active) active.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function flyToVenue(venue) {
    if (!map) return;
    map.flyTo([venue.lat, venue.lng], 14, { duration: 1.2 });
    setTimeout(() => {
      if (markers[venue.id]) markers[venue.id].openPopup();
    }, 1300);
    highlightSidebarItem(venue.id);
  }

  /* ── Drawer (детальная карточка) ──────────────────────────────────────── */
  function openDrawer(venueId) {
    const venue = VENUES.find(v => v.id === venueId);
    if (!venue) return;
    activeVenueId = venueId;

    const drawer = document.getElementById('mapDrawer');
    if (!drawer) return;

    // Fill header
    setText('drawerName', venue.name);
    setText('drawerAddress', venue.address);
    setHTML('drawerType', `<span>${venueTypeLabel(venue)} · ${venueFloorLabel(venue)}</span>`);

    // Image
    const imgWrap = document.getElementById('drawerImageWrap');
    if (imgWrap) imgWrap.style.backgroundImage = `url('${venue.image}')`;

    // Status bar
    const statusClass = { free: 'status-free', busy: 'status-busy', soon: 'status-soon' }[venue.status] || '';
    const badge = document.getElementById('drawerStatusBadge');
    if (badge) { badge.textContent = venueStatusLabel(venue); badge.className = `map-status-badge ${statusClass}`; }

    const capText = document.getElementById('drawerCapacityText');
    if (capText) capText.textContent = tr('mapCapacityUpTo', { count: venue.capacity });

    const nextText = document.getElementById('drawerNextEventText');
    if (nextText) nextText.textContent = venue.nextDate;

    // Info tab
    setText('drawerDesc', venue.description);
    const equipList = document.getElementById('drawerEquipList');
    if (equipList) {
      equipList.innerHTML = venue.equipment.map(e => `
        <span class="map-equip-tag">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5l2.5 2.5L9 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          ${e}
        </span>`).join('');
    }

    // Events tab
    const eventsList = document.getElementById('drawerEventsList');
    if (eventsList) {
      eventsList.innerHTML = venue.events.map(ev => {
        const sc = { busy: 'status-busy', soon: 'status-soon', upcoming: 'status-free' }[ev.status] || '';
        const sl = { busy: t('mapEventLive'), soon: t('mapLegendSoon'), upcoming: t('calendarStatusPlanned') }[ev.status] || '';
        return `
          <div class="map-drawer-event-item">
            <div class="map-drawer-event-info">
              <strong>${ev.title}</strong>
              <span>${ev.date} · ${ev.time} · ${ev.attendees} ${t('mapPeopleShort')}</span>
            </div>
            <span class="map-status-badge ${sc}">${sl}</span>
          </div>`;
      }).join('');
    }

    // Free dates tab
    const datesList = document.getElementById('drawerDatesList');
    if (datesList) {
      datesList.innerHTML = venue.freeDates.map(d => {
        const dt = new Date(d + 'T00:00:00');
        const formatted = dt.toLocaleDateString(locale(), { day: 'numeric', month: 'long', year: 'numeric' });
        return `
          <button class="map-date-chip" type="button" data-free-date="${d}">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="2.5" width="11" height="10" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M1 6h11M4 1v2M9 1v2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
            ${formatted}
          </button>`;
      }).join('');
    }

    // Activate first tab
    switchDrawerTab('info');

    drawer.classList.remove('hidden');
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    const drawer = document.getElementById('mapDrawer');
    if (!drawer) return;
    drawer.classList.remove('open');
    setTimeout(() => drawer.classList.add('hidden'), 320);
    document.body.style.overflow = '';
    activeVenueId = null;
  }

  function switchDrawerTab(tab) {
    activeDrawerTab = tab;
    document.querySelectorAll('.map-drawer-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.drawerTab === tab);
    });
    const panels = { info: 'drawerTabInfo', events: 'drawerTabEvents', dates: 'drawerTabDates' };
    Object.entries(panels).forEach(([key, id]) => {
      const el = document.getElementById(id);
      if (el) el.classList.toggle('hidden', key !== tab);
    });
  }

  function openBookingFromMap(venue) {
    // Trigger existing hall booking modal if available
    closeDrawer();
    if (map) map.closePopup();

    // Try to use existing booking system
    if (window.ORDA && typeof window.ORDA.openHallBooking === 'function') {
      window.ORDA.openHallBooking(venue.id);
    } else {
      // Fallback: navigate to halls view
      const navBtn = document.querySelector('[data-view="halls"]');
      if (navBtn) navBtn.click();
      setTimeout(() => {
        const toast = window.ORDA && window.ORDA.toast;
        if (toast && typeof toast.show === 'function') toast.show(`${t('mapChooseInCatalog')}: ${venue.name}`, 'success');
      }, 300);
    }
  }

  /* ── Бегущая строка ───────────────────────────────────────────────────── */
  function buildTicker() {
    const container = document.getElementById('mapTickerItems');
    if (!container) return;

    const statusColors = { busy: '#B02828', soon: '#B8722A', upcoming: '#0D7A54' };
    const statusLabels = { busy: t('mapEventLive'), soon: t('mapLegendSoon'), upcoming: t('calendarStatusPlanned') };

    container.innerHTML = TICKER_EVENTS.map(ev => `
      <span class="map-ticker-item">
        <span class="map-ticker-dot" style="background:${statusColors[ev.status] || '#1B3F78'}"></span>
        <strong>${ev.title}</strong>
        <span>${ev.venue}</span>
        <span class="map-ticker-date">${ev.date}</span>
        <span class="map-ticker-status" style="color:${statusColors[ev.status]}">${statusLabels[ev.status]}</span>
      </span>
    `).join('<span class="map-ticker-sep">·</span>');

    // Auto-scroll ticker
    let pos = 0;
    const scroll = () => {
      pos += 0.5;
      if (pos > container.scrollWidth / 2) pos = 0;
      container.scrollLeft = pos;
    };
    setInterval(scroll, 30);
  }

  /* ── Фильтры ──────────────────────────────────────────────────────────── */
  function bindFilters() {
    const bind = (id, key) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('change', () => {
        filters[key] = el.value;
        applyFilters();
      });
    };

    bind('mapCityFilter', 'city');
    bind('mapTypeFilter', 'type');
    bind('mapCapacityFilter', 'capacity');
    bind('mapStatusFilter', 'status');

    const search = document.getElementById('mapSearchInput');
    if (search) {
      search.addEventListener('input', () => {
        filters.search = search.value.trim();
        applyFilters();
      });
    }

    const reset = document.getElementById('mapFilterReset');
    if (reset) {
      reset.addEventListener('click', () => {
        filters = { city: 'all', type: 'all', capacity: 'all', status: 'all', search: '' };
        ['mapCityFilter', 'mapTypeFilter', 'mapCapacityFilter', 'mapStatusFilter'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.value = 'all';
        });
        if (search) search.value = '';
        updateFloorButtons('all');
        applyFilters();
      });
    }
  }

  function bindFloorSelector() {
    document.querySelectorAll('[data-map-floor]').forEach(btn => {
      btn.addEventListener('click', () => {
        const value = btn.dataset.mapFloor || 'all';
        filters.city = value;
        const select = document.getElementById('mapCityFilter');
        if (select) select.value = value;
        updateFloorButtons(value);
        applyFilters();
      });
    });

    const select = document.getElementById('mapCityFilter');
    if (select) {
      select.addEventListener('change', () => updateFloorButtons(select.value || 'all'));
    }
  }

  function updateFloorButtons(value) {
    document.querySelectorAll('[data-map-floor]').forEach(btn => {
      btn.classList.toggle('active', (btn.dataset.mapFloor || 'all') === value);
    });
  }

  function applyFilters() {
    const filtered = getFiltered();

    // Update markers visibility
    VENUES.forEach(venue => {
      const marker = markers[venue.id];
      if (!marker) return;
      const visible = filtered.some(v => v.id === venue.id);
      if (visible) {
        if (!map.hasLayer(marker)) marker.addTo(map);
      } else {
        if (map.hasLayer(marker)) map.removeLayer(marker);
      }
    });

    // Update list
    buildVenueList();

    // Fit bounds to visible
    if (filtered.length > 0) {
      const bounds = L.latLngBounds(filtered.map(v => [v.lat, v.lng]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 });
    }
  }

  /* ── Переключение вид список/карточки ──────────────────────────────────── */
  function bindViewToggle() {
    const gridBtn = document.getElementById('mapGridBtn');
    if (listBtn) listBtn.addEventListener('click', () => { viewMode = 'list'; listBtn.classList.add('active'); gridBtn && gridBtn.classList.remove('active'); buildVenueList(); });
    if (gridBtn) gridBtn.addEventListener('click', () => { viewMode = 'grid'; gridBtn.classList.add('active'); listBtn && listBtn.classList.remove('active'); buildVenueList(); });
  }

  /* ── Drawer bindings ──────────────────────────────────────────────────── */
  function bindDrawer() {
    const closeBtn = document.getElementById('mapDrawerClose');
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

    const backdrop = document.getElementById('mapDrawerBackdrop');
    if (backdrop) backdrop.addEventListener('click', closeDrawer);

    document.querySelectorAll('.map-drawer-tab').forEach(btn => {
      btn.addEventListener('click', () => switchDrawerTab(btn.dataset.drawerTab));
    });

    const bookBtn = document.getElementById('drawerBookBtn');
    if (bookBtn) bookBtn.addEventListener('click', () => {
      if (activeVenueId) {
        const venue = VENUES.find(v => v.id === activeVenueId);
        if (venue) openBookingFromMap(venue);
      }
    });

    const hallsBtn = document.getElementById('drawerHallsBtn');
    if (hallsBtn) hallsBtn.addEventListener('click', () => {
      closeDrawer();
      const navBtn = document.querySelector('[data-view="halls"]');
      if (navBtn) navBtn.click();
    });
  }

  /* ── Helpers ──────────────────────────────────────────────────────────── */
  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val || '';
  }
  function setHTML(id, val) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = val || '';
  }

  /* ── Theme change listener ────────────────────────────────────────────── */
  const observer = new MutationObserver(() => {
    if (!map) return;
    map.eachLayer(layer => { if (layer._url) map.removeLayer(layer); });
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const tileUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    L.tileLayer(tileUrl, {
      attribution: '© OpenStreetMap © CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  /* ── Boot when floorplan view is shown ───────────────────────────────── */
  document.addEventListener('click', function onViewClick(e) {
    const btn = e.target.closest('[data-view]');
    if (btn && btn.dataset.view === 'floorplan') {
      setTimeout(() => {
        if (!map) init();
        else map.invalidateSize();
      }, 80);
    }
  });

  // Also init if already visible
  if (document.getElementById('floorplanView') &&
      document.getElementById('floorplanView').classList.contains('active-view')) {
    setTimeout(init, 200);
  }

  // Expose for external calls
  window.ORDA = window.ORDA || {};
  window.ORDA.mapModule = { init, flyToVenue, openDrawer };

})();
