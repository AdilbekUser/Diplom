const STORAGE_KEYS = {
  lang: "lang",
  demoDb: "orda-demo-db-v4",
  portal: "portal",
  currentView: "orda-current-view",
  controlState: "orda-control-state-v1",
  cabinetTab: "orda-cabinet-tab",
};

const API_BASE_URL = String(window.ORDA_CONFIG?.API_BASE_URL || "").trim().replace(/\/+$/, "");
const LOCAL_FALLBACK_ENABLED = window.ORDA_CONFIG?.USE_LOCAL_FALLBACK !== false;

const state = {
  ...window.ORDA.session.read(),
  lang: localStorage.getItem(STORAGE_KEYS.lang) || "ru",
  portal: localStorage.getItem(STORAGE_KEYS.portal) || "client",
  events: [],
  halls: [],
  bookings: [],
  hallBookings: [],
  adminBookings: [],
  adminUsers: [],
  adminNotifications: [],
  clientNotifications: [],
  supportMessages: [],
  profile: null,
  dataMode: API_BASE_URL ? "remote" : "local",
  currentView: localStorage.getItem(STORAGE_KEYS.currentView) || "dashboard",
  currentTicketId: "",
};

const els = {
  sidebar: document.querySelector("#sidebar"),
  sidebarToggle: document.querySelector("#sidebarToggle"),
  browseBtn: document.querySelector("#browseBtn"),
  portalClientBtn: document.querySelector("#portalClientBtn"),
  portalAdminBtn: document.querySelector("#portalAdminBtn"),
  themeToggle: document.querySelector("#themeToggle"),
  languageSelect: document.querySelector("#languageSelect"),
  accountName: document.querySelector("#accountName"),
  loginBtn: document.querySelector("#loginBtn"),
  logoutBtn: document.querySelector("#logoutBtn"),
  dataModeBadge: document.querySelector("#dataModeBadge"),
  authSection: document.querySelector("#authSection"),
  authCloseBtn: document.querySelector("#authCloseBtn"),
  loginForm: document.querySelector("#loginForm"),
  registerForm: document.querySelector("#registerForm"),
  profileForm: document.querySelector("#profileForm"),
  message: document.querySelector("#message"),
  seedBtn: document.querySelector("#seedBtn"),
  homeSearchInput: document.querySelector("#homeSearchInput"),
  homeSearchBtn: document.querySelector("#homeSearchBtn"),
  searchInput: document.querySelector("#searchInput"),
  categoryFilter: document.querySelector("#categoryFilter"),
  formatFilter: document.querySelector("#formatFilter"),
  hallSearchInput: document.querySelector("#hallSearchInput"),
  hallCapacityFilter: document.querySelector("#hallCapacityFilter"),
  adminRequestTypeFilter: document.querySelector("#adminRequestTypeFilter"),
  adminRequestStatusFilter: document.querySelector("#adminRequestStatusFilter"),
  eventsList: document.querySelector("#eventsList"),
  hallsList: document.querySelector("#hallsList"),
  dashboardEvents: document.querySelector("#dashboardEvents"),
  dashboardCalendar: document.querySelector("#dashboardCalendar"),
  dashboardHallLoad: document.querySelector("#dashboardHallLoad"),
  recentActionsList: document.querySelector("#recentActionsList"),
  adminNotificationsList: document.querySelector("#adminNotificationsList"),
  adminNotificationsFeed: document.querySelector("#adminNotificationsFeed"),
  calendarList: document.querySelector("#calendarList"),
  calendarAgendaList: document.querySelector("#calendarAgendaList"),
  calendarSearchInput: document.querySelector("#calendarSearchInput"),
  calendarTypeFilter: document.querySelector("#calendarTypeFilter"),
  calendarHallFilter: document.querySelector("#calendarHallFilter"),
  calendarStatusFilter: document.querySelector("#calendarStatusFilter"),
  myBookingsList: document.querySelector("#myBookingsList"),
  myBookingsListFull: document.querySelector("#myBookingsListFull"),
  myHallBookingsList: document.querySelector("#myHallBookingsList"),
  myNotificationsList: document.querySelector("#myNotificationsList"),
  supportForm: document.querySelector("#supportForm"),
  supportMessageText: document.querySelector("#supportMessageText"),
  adminBookingsList: document.querySelector("#adminBookingsList"),
  adminSupportList: document.querySelector("#adminSupportList"),
  exportBookingsBtn: document.querySelector("#exportBookingsBtn"),
  eventForm: document.querySelector("#eventForm"),
  eventFormTitle: document.querySelector("#eventFormTitle"),
  resetEventForm: document.querySelector("#resetEventForm"),
  metricEvents: document.querySelector("#metricEvents"),
  metricSeats: document.querySelector("#metricSeats"),
  metricBookings: document.querySelector("#metricBookings"),
  metricSeatsLabel: document.querySelector("#metricSeatsLabel"),
  metricBookingsLabel: document.querySelector("#metricBookingsLabel"),
  metricNext: document.querySelector("#metricNext"),
  heroMetricEvents: document.querySelector("#heroMetricEvents"),
  heroMetricHalls: document.querySelector("#heroMetricHalls"),
  heroMetricRequests: document.querySelector("#heroMetricRequests"),
  adminStatEvents: document.querySelector("#adminStatEvents"),
  adminStatBookings: document.querySelector("#adminStatBookings"),
  adminStatUsers: document.querySelector("#adminStatUsers"),
  adminStatCheckedIn: document.querySelector("#adminStatCheckedIn"),
  adminStatPaidTickets: document.querySelector("#adminStatPaidTickets"),
  adminStatHallApproved: document.querySelector("#adminStatHallApproved"),
  eventModal: document.querySelector("#eventModal"),
  closeModal: document.querySelector("#closeModal"),
  eventDetails: document.querySelector("#eventDetails"),
  hallModal: document.querySelector("#hallModal"),
  closeHallModal: document.querySelector("#closeHallModal"),
  cancelHallBooking: document.querySelector("#cancelHallBooking"),
  hallBookingForm: document.querySelector("#hallBookingForm"),
  hallBookingTitle: document.querySelector("#hallBookingTitle"),
  hallBookingSubtitle: document.querySelector("#hallBookingSubtitle"),
  hallForm: document.querySelector("#hallForm"),
  hallFormTitle: document.querySelector("#hallFormTitle"),
  resetHallForm: document.querySelector("#resetHallForm"),
  adminHallsList: document.querySelector("#adminHallsList"),
  adminUsersList: document.querySelector("#adminUsersList"),
  ticketModal: document.querySelector("#ticketModal"),
  closeTicketModal: document.querySelector("#closeTicketModal"),
  downloadTicketBtn: document.querySelector("#downloadTicketBtn"),
  paymentModal: document.querySelector("#paymentModal"),
  closePaymentModal: document.querySelector("#closePaymentModal"),
  cancelPayment: document.querySelector("#cancelPayment"),
  paymentForm: document.querySelector("#paymentForm"),
  paymentEventTitle: document.querySelector("#paymentEventTitle"),
  paymentAmount: document.querySelector("#paymentAmount"),
  payLaterBtn: document.querySelector("#payLaterBtn"),
  payCardFields: document.querySelector("#payCardFields"),
  payKaspiFields: document.querySelector("#payKaspiFields"),
  payWalletFields: document.querySelector("#payWalletFields"),
  paymentMethodPreview: document.querySelector("#paymentMethodPreview"),
  paymentOrderStatus: document.querySelector("#paymentOrderStatus"),
  paymentProcessText: document.querySelector("#paymentProcessText"),
  adminRequestModal: document.querySelector("#adminRequestModal"),
  closeAdminRequestModal: document.querySelector("#closeAdminRequestModal"),
  cancelAdminRequestEdit: document.querySelector("#cancelAdminRequestEdit"),
  adminRequestForm: document.querySelector("#adminRequestForm"),
  requestHallGrid: document.querySelector("#requestHallGrid"),
  requestHallPlanner: document.querySelector("#requestHallPlanner"),
  ownEventFields: document.querySelector("#ownEventFields"),
  requestDate: document.querySelector("#requestDate"),
  requestSlotGrid: document.querySelector("#requestSlotGrid"),
  requestSelectedSummary: document.querySelector("#requestSelectedSummary"),
  requestRentPreview: document.querySelector("#requestRentPreview"),
  customRequestForm: document.querySelector("#customRequestForm"),
  requestServicesSection: document.querySelector("#requestServicesSection"),
  requestTotalPreview: document.querySelector("#requestTotalPreview"),
  requestPaymentModal: document.querySelector("#requestPaymentModal"),
  closeRequestPaymentModal: document.querySelector("#closeRequestPaymentModal"),
  cancelRequestPayment: document.querySelector("#cancelRequestPayment"),
  requestPaymentSummary: document.querySelector("#requestPaymentSummary"),
  requestPaymentForm: document.querySelector("#requestPaymentForm"),
  requestAnnouncementPayment: document.querySelector("#requestAnnouncementPayment"),
  requestCardPaymentFields: document.querySelector("#requestCardPaymentFields"),
  requestPaymentProcessText: document.querySelector("#requestPaymentProcessText"),
  clientWorkspace: document.querySelector("#clientWorkspace"),
  adminWorkspace: document.querySelector("#adminWorkspace"),
  eventsCount: document.querySelector("#eventsCount"),
  sidebarBackdrop: document.querySelector("#sidebarBackdrop"),
  portalSwitcher: document.querySelector("#portalSwitcher"),
};

const { categoryKeys, formatKeys } = window.ORDA.domain;
const requestSlots = [
  { id: "morning", start: "09:00", end: "11:00" },
  { id: "midday", start: "12:00", end: "14:00" },
  { id: "afternoon", start: "15:00", end: "18:00" },
];
const requestServiceConfig = [
  { id: "registration", key: "serviceRegistration", price: 9000 },
  { id: "assistants", label: "Ассистенты / координаторы", price: 22000 },
  { id: "tech", label: "Технический специалист", price: 18000 },
  { id: "projector", key: "serviceProjector", price: 10000 },
  { id: "microphones", key: "serviceMicrophones", price: 8000 },
  { id: "audio", label: "Звуковая система", price: 12000 },
  { id: "led", label: "Экран / LED-панель", price: 16000 },
  { id: "coffee", key: "serviceCoffee", price: 25000 },
  { id: "badges", label: "Бейджи участников", price: 6000 },
  { id: "security", label: "Охрана", price: 30000 },
  { id: "cleaning", label: "Уборка после мероприятия", price: 12000 },
  { id: "streaming", label: "Онлайн-трансляция", price: 35000 },
  { id: "translator", label: "Переводчик", price: 28000 },
];
const announcementRequestPrice = 10000;
const hallImageFallbacks = {
  h_grand: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
  h_orion: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
  h_workshop: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
  h_board: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=1200&q=80",
  h_atrium: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80",
  h_silk: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80",
  h_nova: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
  h_sky: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80",
  "Grand Hall A": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
  "Orion Hall B": "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
  "Workshop Hub C": "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
  "Boardroom D": "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=1200&q=80",
  "Atrium Expo Space": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80",
  "Silk Road Conference Room": "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80",
  "Nova Training Lab": "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
  "Skyline Networking Lounge": "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80",
  default: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
};
let requestSelection = { hallId: "", date: "", slotId: "" };
let pendingCustomRequest = null;
let calendarAgendaExpanded = false;
let requestMode = "hall";
let supportRefreshTimer = null;
const persistentControlKeys = [
  "homeSearchInput",
  "searchInput",
  "categoryFilter",
  "formatFilter",
  "hallSearchInput",
  "hallCapacityFilter",
  "calendarSearchInput",
  "calendarTypeFilter",
  "calendarHallFilter",
  "calendarStatusFilter",
  "adminRequestTypeFilter",
  "adminRequestStatusFilter",
];
const cabinetTabs = new Set(["profile-data", "my-events", "my-halls", "notifications"]);

function t(key) {
  return window.ORDA.i18n.translate(state.lang, key);
}

function tr(key, vars = {}) {
  let value = t(key);
  Object.entries(vars).forEach(([name, payload]) => {
    value = value.replaceAll(`{{${name}}}`, String(payload));
  });
  return value;
}

window.ORDA.getToken = () => state.token;
window.ORDA.getErrorMessage = (response, data = {}) => {
  if (data.messageKey) return tr(data.messageKey, data.messageVars || {});
  if (data.message) return data.message;
  if (response.status === 401) return t("loginRequired");
  if (response.status === 403) return t("adminOnly");
  return `HTTP ${response.status}`;
};

function readControlState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.controlState) || "{}") || {};
  } catch (error) {
    return {};
  }
}

function saveControlValue(key) {
  const node = els[key];
  if (!node) return;
  const values = readControlState();
  values[key] = node.value;
  localStorage.setItem(STORAGE_KEYS.controlState, JSON.stringify(values));
}

function restoreControlValues() {
  const values = readControlState();
  persistentControlKeys.forEach((key) => {
    const node = els[key];
    if (node && Object.prototype.hasOwnProperty.call(values, key)) {
      node.value = values[key];
    }
  });
}

function bindPersistentControls() {
  persistentControlKeys.forEach((key) => {
    const node = els[key];
    if (!node) return;
    node.addEventListener("input", () => saveControlValue(key));
    node.addEventListener("change", () => saveControlValue(key));
  });
}

function activateCabinetTab(name, persist = true) {
  if (!cabinetTabs.has(name)) name = "profile-data";
  const tab = document.querySelector(`.cabinet-tab[data-cabinet="${name}"]`);
  const panel = document.getElementById(`cabinet-${name}`);
  if (!tab || !panel) return;

  document.querySelectorAll(".cabinet-tab").forEach((node) => node.classList.remove("active"));
  document.querySelectorAll(".cabinet-panel").forEach((node) => node.classList.add("hidden"));
  tab.classList.add("active");
  panel.classList.remove("hidden");

  if (persist) {
    localStorage.setItem(STORAGE_KEYS.cabinetTab, name);
  }
}

function restoreCabinetTab() {
  activateCabinetTab(localStorage.getItem(STORAGE_KEYS.cabinetTab) || "profile-data", false);
}

function escapeHtml(value) {
  return window.ORDA.format.escapeHtml(value);
}

function formatDate(value, options = {}) {
  return window.ORDA.format.date(value, state.lang, options);
}

function dateRangeText(item, options = { month: "short", day: "numeric", year: "numeric" }) {
  if (!item?.endDate || item.endDate === item.date) return formatDate(item?.date, options);
  return `${formatDate(item.date, options)} - ${formatDate(item.endDate, options)}`;
}

function datesBetween(start, end) {
  const result = [];
  const startDate = new Date(`${start}T00:00:00`);
  const endDate = new Date(`${end || start}T00:00:00`);
  if (Number.isNaN(startDate.getTime())) return result;
  const safeEnd = Number.isNaN(endDate.getTime()) || endDate < startDate ? startDate : endDate;

  for (const day = new Date(startDate); day <= safeEnd; day.setDate(day.getDate() + 1)) {
    result.push(day.toISOString().slice(0, 10));
  }
  return result;
}

function formatPrice(event) {
  return window.ORDA.format.price(event, state.lang, t("free"));
}

function dateTimeText(value) {
  return new Date(value).toLocaleString(window.ORDA.format.localeFor(state.lang));
}

function formatCurrency(value, currency = "KZT") {
  const amount = Number(value || 0);
  try {
    return new Intl.NumberFormat(window.ORDA.format.localeFor(state.lang), {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch (error) {
    return `${amount} ${currency}`;
  }
}

function paymentLabel(request) {
  if (request.paymentStatus === "paid") return t("paymentPaid");
  if (request.paymentStatus === "free") return t("paymentFree");
  if (request.paymentStatus === "refunded") return t("paymentRefunded");
  if (request.paymentStatus === "unpaid") return t("paymentUnpaid");
  return "";
}

function paymentClass(request) {
  if (request.paymentStatus === "paid" || request.paymentStatus === "free") return "status-pill-approved";
  if (request.paymentStatus === "refunded") return "status-pill-cancelled";
  if (request.paymentStatus === "unpaid") return "status-pill-pending";
  return "status-pill-pending";
}

function paymentMethodLabel(method) {
  if (method === "kaspi") return t("payMethodKaspi");
  if (method === "applepay") return t("payMethodApple");
  if (method === "googlepay") return t("payMethodGoogle");
  return t("payMethodCard");
}

function selectedPaymentMethod() {
  const node = document.querySelector('input[name="paymentMethod"]:checked');
  return node ? node.value : "card";
}

function setPaymentMethodUI(method = "card") {
  const showCard = method === "card";
  const showKaspi = method === "kaspi";
  const showWallet = method === "applepay" || method === "googlepay";

  if (els.payCardFields) els.payCardFields.classList.toggle("hidden", !showCard);
  if (els.payKaspiFields) els.payKaspiFields.classList.toggle("hidden", !showKaspi);
  if (els.payWalletFields) els.payWalletFields.classList.toggle("hidden", !showWallet);

  document.querySelectorAll(".pay-method-chip").forEach((chip) => {
    const input = chip.querySelector('input[name="paymentMethod"]');
    chip.classList.toggle("active", Boolean(input && input.value === method));
  });

  const cardNames = ["cardHolder", "cardNumber", "cardExp", "cardCvc"];
  const kaspiNames = ["kaspiPhone", "kaspiCode"];
  cardNames.forEach((name) => {
    const field = els.paymentForm?.elements?.namedItem(name);
    if (!field) return;
    field.required = showCard;
  });
  kaspiNames.forEach((name) => {
    const field = els.paymentForm?.elements?.namedItem(name);
    if (!field) return;
    field.required = showKaspi;
  });

  if (els.paymentMethodPreview) els.paymentMethodPreview.textContent = paymentMethodLabel(method);
}

function setPaymentProcessing(active) {
  if (!els.paymentForm) return;
  Array.from(els.paymentForm.elements).forEach((field) => {
    if (field.name === "eventId" || field.name === "bookingId" || field.name === "bookingType") return;
    field.disabled = active;
  });
  if (els.paymentProcessText) els.paymentProcessText.classList.toggle("hidden", !active);
}

function bookingStatusLabel(status) {
  if (status === "new") return t("requestStatusNew");
  if (status === "review") return t("requestStatusReview");
  if (status === "approved") return t("calendarStatusApproved");
  if (status === "pending") return t("calendarStatusPending");
  if (status === "rejected" || status === "cancelled") return t("calendarStatusCancelled");
  return t("calendarStatusPlanned");
}

function relativeTime(iso) {
  if (!iso) return "-";
  const delta = Math.max(0, Date.now() - new Date(iso).getTime());
  const minutes = Math.floor(delta / 60000);
  if (minutes < 1) return t("justNow");
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

function notificationMessage(item) {
  if (!item) return "";
  if (item.messageKey) return tr(item.messageKey, item.messageVars || {});
  return String(item.text || "");
}

function isInactiveRequest(status) {
  return status === "rejected" || status === "cancelled";
}

const clientPortalViews = new Set(["dashboard", "events", "halls", "calendar", "floorplan", "profile", "request", "about"]);
const adminPortalViews = new Set(["dashboard", "events", "halls", "calendar", "floorplan", "profile", "request", "about", "admin"]);

function portalFromRole() {
  return state.role === "admin" ? "admin" : "client";
}

function homeViewForRole() {
  if (state.role === "admin") return "admin";
  return state.token ? "profile" : "dashboard";
}

function showMessage(text, type = "success") {
  if (!text) return;
  els.message.textContent = text;
  els.message.className = `message ${type === "error" ? "error" : ""}`.trim();
  els.message.classList.remove("hidden");

  clearTimeout(showMessage.timer);
  showMessage.timer = setTimeout(() => els.message.classList.add("hidden"), 4200);

  window.ORDA?.toast?.show(text, type);
}

function supportStatusLabel(status) {
  return status === "read" ? "Прочитано" : "Новое";
}

function setAuthTab(authTab = "login") {
  document.querySelectorAll(".tab").forEach((node) => {
    const active = node.dataset.auth === authTab;
    node.classList.toggle("active", active);
  });
  els.loginForm.classList.toggle("hidden", authTab !== "login");
  els.registerForm.classList.toggle("hidden", authTab !== "register");
}

function openAuth(authTab = "login") {
  setAuthTab(authTab);
  els.authSection.classList.remove("hidden");
  const firstField = authTab === "register" ? els.registerForm.querySelector("input") : els.loginForm.querySelector("input");
  firstField?.focus();
}

function closeAuth() {
  els.authSection.classList.add("hidden");
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function uid(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-5)}`;
}

function plusDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function createError(i18nKey, status = 400, i18nVars) {
  const error = new Error(i18nKey);
  error.status = status;
  error.i18nKey = i18nKey;
  error.i18nVars = i18nVars || {};
  return error;
}

function success(messageKey, messageVars) {
  return { success: true, messageKey, messageVars: messageVars || {} };
}

function responseMessage(result) {
  if (!result) return "";
  if (result.messageKey) return tr(result.messageKey, result.messageVars);
  return result.message || "";
}

function setButtonLoading(button, active, label = t("loading")) {
  if (!button) return;
  if (active) {
    if (!button.dataset.originalText) button.dataset.originalText = button.textContent;
    button.textContent = label;
    button.disabled = true;
    button.classList.add("is-loading");
    button.setAttribute("aria-busy", "true");
    return;
  }

  if (button.dataset.originalText) {
    button.textContent = button.dataset.originalText;
    delete button.dataset.originalText;
  }
  button.disabled = false;
  button.classList.remove("is-loading");
  button.removeAttribute("aria-busy");
}

function setFormLoading(form, active) {
  if (!form) return;
  form.classList.toggle("is-submitting", active);
  form.setAttribute("aria-busy", active ? "true" : "false");
  Array.from(form.elements || []).forEach((field) => {
    if (active) {
      field.dataset.wasDisabled = field.disabled ? "true" : "false";
      field.disabled = true;
      return;
    }

    field.disabled = field.dataset.wasDisabled === "true";
    delete field.dataset.wasDisabled;
  });
}

function shouldResetSession(error, path) {
  const message = String(error?.message || error?.data?.message || "").toLowerCase();
  const status = Number(error?.status || error?.responseStatus || 0);
  const authRoute = path === "/login" || path === "/register";
  return (
    Boolean(state.token) &&
    !authRoute &&
    (status === 401 || message.includes("authorization token is invalid") || message.includes("jwt expired"))
  );
}

function resetExpiredSession() {
  clearSession();
  state.portal = "client";
  state.currentTicketId = "";
  state.hallBookings = [];
  state.clientNotifications = [];
  state.adminUsers = [];
  state.adminBookings = [];
  applyPortalVisibility();
  updateShell();
  renderAll();
}

function currentUser(db) {
  if (!state.token) return null;
  if (!isLocalSessionToken(state.token)) {
    return {
      _id: state.email || state.token,
      name: state.name || state.email || "User",
      email: state.email || "",
      role: state.role || "user",
      phone: state.profile?.phone || "",
      organization: state.profile?.organization || "",
      city: state.profile?.city || "",
    };
  }
  const userId = state.token.replace("local::", "");
  return db.users.find((user) => user._id === userId) || null;
}

function isLocalSessionToken(token) {
  return typeof token === "string" && token.startsWith("local::");
}

function ensureEventShape(event, db, user) {
  const activeStatuses = new Set(["pending", "approved"]);
  const related = db.requests.filter((request) => request.type === "event" && request.eventId === event._id);
  const booked = related.filter((request) => activeStatuses.has(request.status)).length;
  const isBookedByMe = Boolean(
    user && related.some((request) => request.userId === user._id && activeStatuses.has(request.status))
  );

  return {
    ...event,
    booked,
    seatsLeft: Math.max(Number(event.capacity || 0) - booked, 0),
    isBookedByMe,
  };
}

function sortEvents(events) {
  return events.slice().sort((a, b) => {
    const left = `${a.date || ""} ${a.time || ""}`;
    const right = `${b.date || ""} ${b.time || ""}`;
    return left.localeCompare(right);
  });
}

function createDemoDatabase() {
  const users = [
    {
      _id: "u_admin",
      name: "ORDA Admin",
      email: "admin@orda.local",
      password: "admin123",
      role: "admin",
      phone: "+7 700 100 10 10",
      organization: "ORDA Venue",
      city: "Astana",
    },
    {
      _id: "u_client_1",
      name: "Aigerim N",
      email: "aigerim@company.kz",
      password: "user123",
      role: "user",
      phone: "+7 700 200 20 20",
      organization: "Future Systems",
      city: "Almaty",
    },
    {
      _id: "u_client_2",
      name: "Erlan S",
      email: "erlan@forum.kz",
      password: "user123",
      role: "user",
      phone: "+7 700 300 30 30",
      organization: "Forum Alliance",
      city: "Shymkent",
    },
  ];

  const halls = [
    {
      _id: "h_grand",
      name: "Grand Hall A",
      floor: "1 этаж",
      location: "Central Wing, Astana Expo District",
      capacity: 420,
      equipment: ["LED wall 12m", "Stage lighting", "Translation booths", "Broadcast desk", "VIP entrance"],
      description: "Флагманский зал для форумов, выставочных открытий и keynote-сессий с профессиональным светом, сценой и синхронным переводом.",
      status: "available",
      pricePerHour: 65000,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
      advantages: ["Панорамная сцена", "Отдельная регистрация", "Потоковая трансляция"],
    },
    {
      _id: "h_orion",
      name: "Orion Hall B",
      floor: "2 этаж",
      location: "North Wing",
      capacity: 180,
      equipment: ["4K projector", "Zoom room", "Acoustic system", "Video wall", "Hybrid kit"],
      description: "Универсальный зал для корпоративных конференций, продуктовых презентаций и гибридных программ.",
      status: "available",
      pricePerHour: 36000,
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
      advantages: ["Гибридный формат", "Сильная акустика", "Быстрая рассадка"],
    },
    {
      _id: "h_workshop",
      name: "Workshop Hub C",
      floor: "2 этаж",
      location: "South Wing",
      capacity: 90,
      equipment: ["Modular furniture", "Flipcharts", "VR kit", "Interactive panels"],
      description: "Гибкое пространство для тренингов, дизайн-сессий, образовательных интенсивов и командных workshop-программ.",
      status: "available",
      pricePerHour: 22000,
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
      advantages: ["Модульная мебель", "Интерактивные панели", "Командные зоны"],
    },
    {
      _id: "h_board",
      name: "Boardroom D",
      floor: "3 этаж",
      location: "Executive Zone",
      capacity: 36,
      equipment: ["Video conference", "Smart display", "Coffee station", "Private lobby"],
      description: "Закрытая переговорная для совещаний руководителей, стратегических встреч и private briefing-сессий.",
      status: "available",
      pricePerHour: 18000,
      image: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=1200&q=80",
      advantages: ["Приватность", "Executive-сервис", "Видеосвязь"],
    },
    {
      _id: "h_atrium",
      name: "Atrium Expo Space",
      floor: "1 этаж",
      location: "Main Atrium",
      capacity: 650,
      equipment: ["Expo booths", "Registration desks", "Media wall", "Sponsor zones"],
      description: "Открытая зона для выставок, партнерских стендов, нетворкинга и демонстрации технологических решений.",
      status: "available",
      pricePerHour: 78000,
      image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80",
      advantages: ["Выставочные стенды", "Высокий трафик", "Sponsor branding"],
    },
    {
      _id: "h_silk",
      name: "Silk Road Conference Room",
      floor: "3 этаж",
      location: "East Wing",
      capacity: 120,
      equipment: ["Conference table", "Interpretation system", "Wireless microphones", "Press wall"],
      description: "Премиальный конференц-зал для международных деловых встреч, пресс-конференций и переговоров.",
      status: "busy",
      pricePerHour: 32000,
      image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80",
      advantages: ["Международный формат", "Пресс-зона", "Синхроперевод"],
    },
    {
      _id: "h_nova",
      name: "Nova Training Lab",
      floor: "4 этаж",
      location: "Education Cluster",
      capacity: 54,
      equipment: ["Laptops", "Smart board", "Lab desks", "Recording camera"],
      description: "Учебная лаборатория для практических семинаров, сертификаций, интенсивов и hands-on занятий.",
      status: "available",
      pricePerHour: 16000,
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
      advantages: ["Учебный формат", "Запись занятий", "Компьютерные места"],
    },
    {
      _id: "h_sky",
      name: "Skyline Networking Lounge",
      floor: "5 этаж",
      location: "Panorama Zone",
      capacity: 110,
      equipment: ["Lounge seating", "Catering line", "Ambient audio", "City view"],
      description: "Лаунж-пространство для afterparty, coffee break, VIP networking и неформальных встреч участников.",
      status: "maintenance",
      pricePerHour: 26000,
      image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80",
      advantages: ["Панорамный вид", "Catering-ready", "Networking формат"],
    },
  ];

  const events = [
    {
      _id: "e_business_expo",
      title: "Business Technology Expo 2026",
      date: "2026-05-13",
      endDate: "2026-05-15",
      time: "10:00",
      category: "conference",
      description: "B2B-платформа для облачных технологий, автоматизации, корпоративной инфраструктуры и партнерских решений для бизнеса.",
      agenda: "Expo opening, cloud keynote, vendor sessions, B2B meetings, closing networking",
      organizer: "ORDA Expo Office",
      location: "Atrium Expo Space",
      city: "Астана, Казахстан",
      format: "hybrid",
      meetingUrl: "https://meet.example.com/business-technology-expo",
      price: 0,
      currency: "KZT",
      featured: true,
      tags: ["B2B", "cloud", "expo", "automation"],
      capacity: 620,
      status: "published",
      image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80",
    },
    {
      _id: "e_orda_summit",
      title: "AI & Innovation Summit 2026",
      date: "2026-06-05",
      time: "10:00",
      category: "conference",
      description: "Саммит о применении искусственного интеллекта, генеративных моделей, автоматизации процессов и инновационных продуктах.",
      agenda: "Opening keynote, AI product tracks, startup showcase, networking",
      organizer: "ORDA",
      location: "Grand Hall A",
      city: "Астана",
      format: "hybrid",
      meetingUrl: "https://meet.example.com/ai-innovation-summit",
      price: 0,
      currency: "KZT",
      featured: true,
      tags: ["AI", "innovation", "digital", "networking"],
      capacity: 420,
      status: "published",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
    },
    {
      _id: "e_go_digital",
      title: "GO DIGITAL EURASIA 2026",
      date: "2026-07-01",
      endDate: "2026-07-02",
      time: "09:30",
      category: "forum",
      description: "Форум о цифровой трансформации бизнеса, клиентском опыте, данных, автоматизации и переходе компаний к digital-first модели.",
      agenda: "Digital strategy, CX analytics, automation cases, boardroom sessions",
      organizer: "Eurasia Digital Alliance",
      location: "Grand Hall A",
      city: "Астана",
      format: "offline",
      meetingUrl: "",
      price: 25000,
      currency: "KZT",
      featured: true,
      tags: ["digital", "transformation", "business"],
      capacity: 390,
      status: "published",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
    },
    {
      _id: "e_fintech_ca",
      title: "FinTech Conference Central Asia",
      date: "2026-08-20",
      time: "11:00",
      category: "conference",
      description: "Конференция о платежных системах, open banking, финтех-регулировании, цифровых кошельках и B2B-платформах.",
      agenda: "Regulation briefing, bank panels, product demos, investor meetups",
      organizer: "Central Asia FinTech Hub",
      location: "Silk Road Conference Room",
      city: "Алматы",
      format: "hybrid",
      meetingUrl: "https://meet.example.com/fintech-central-asia",
      price: 30000,
      currency: "KZT",
      featured: false,
      tags: ["fintech", "banking", "payments"],
      capacity: 120,
      status: "published",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
    },
    {
      _id: "e_smart_business",
      title: "Smart Business Forum",
      date: "2026-09-12",
      time: "10:30",
      category: "forum",
      description: "Деловой форум для предпринимателей и управленцев о росте, продажах, операционных системах и smart-управлении.",
      agenda: "CEO talks, operations clinic, sales systems, networking lounge",
      organizer: "Smart Business Club",
      location: "Orion Hall B",
      city: "Астана",
      format: "offline",
      meetingUrl: "",
      price: 18000,
      currency: "KZT",
      featured: false,
      tags: ["business", "management", "sales"],
      capacity: 180,
      status: "published",
      image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80",
    },
    {
      _id: "e_product_meetup",
      title: "Product Community Meetup",
      date: "2026-05-28",
      time: "18:30",
      category: "meetup",
      description: "Вечерняя встреча продуктовых менеджеров, аналитиков и основателей о discovery, метриках и запуске новых функций.",
      agenda: "Lightning talks, Q&A, networking",
      organizer: "PM Society",
      location: "Workshop Hub C",
      city: "Астана",
      format: "offline",
      meetingUrl: "",
      price: 0,
      currency: "KZT",
      featured: false,
      tags: ["product", "meetup", "analytics"],
      capacity: 90,
      status: "published",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
    },
    {
      _id: "e_hr_forum",
      title: "HR Leadership Forum",
      date: "2026-06-18",
      time: "11:30",
      category: "forum",
      description: "Форум о people strategy, развитии талантов, вовлеченности команд и операционных HR-процессах.",
      agenda: "Panels, practical cases, round table",
      organizer: "People First",
      location: "Orion Hall B",
      city: "Алматы",
      format: "offline",
      meetingUrl: "",
      price: 15000,
      currency: "KZT",
      featured: false,
      tags: ["HR", "leadership", "culture"],
      capacity: 180,
      status: "published",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    },
    {
      _id: "e_ed_seminar",
      title: "Education Seminar: AI in Learning",
      date: "2026-06-26",
      time: "14:00",
      category: "seminar",
      description: "Практический семинар о внедрении AI-инструментов в учебные программы, корпоративное обучение и оценку результатов.",
      agenda: "Opening session, workshop, implementation roadmap",
      organizer: "EdLab",
      location: "Nova Training Lab",
      city: "Астана",
      format: "online",
      meetingUrl: "https://meet.example.com/education-ai",
      price: 5000,
      currency: "KZT",
      featured: false,
      tags: ["education", "AI", "seminar"],
      capacity: 140,
      status: "published",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    },
    {
      _id: "e_cyber_day",
      title: "Cybersecurity Day Kazakhstan",
      date: "2026-10-07",
      time: "09:00",
      category: "briefing",
      description: "Практический день по информационной безопасности: SOC, защита данных, управление рисками и реагирование на инциденты.",
      agenda: "Threat landscape, SOC cases, tabletop exercise, vendor demos",
      organizer: "SecureOps KZ",
      location: "Grand Hall A",
      city: "Астана",
      format: "hybrid",
      meetingUrl: "https://meet.example.com/cyber-day",
      price: 22000,
      currency: "KZT",
      featured: false,
      tags: ["security", "SOC", "risk"],
      capacity: 300,
      status: "published",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
    },
    {
      _id: "e_finance_briefing",
      title: "Finance Briefing 2026",
      date: "2026-11-19",
      time: "09:30",
      category: "briefing",
      description: "Закрытая сессия о корпоративных финансах, прогнозах рынка, бюджетировании и стратегии на следующий год.",
      agenda: "Market overview, forecasts, executive Q&A",
      organizer: "Fin Board",
      location: "Boardroom D",
      city: "Астана",
      format: "hybrid",
      meetingUrl: "https://meet.example.com/finance-briefing",
      price: 20000,
      currency: "KZT",
      featured: false,
      tags: ["finance", "briefing", "strategy"],
      capacity: 36,
      status: "draft",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  const requests = [
    {
      _id: "r_event_1",
      type: "event",
      status: "approved",
      userId: "u_client_1",
      userName: "Aigerim N",
      userEmail: "aigerim@company.kz",
      userPhone: "+7 700 200 20 20",
      organization: "Future Systems",
      eventId: "e_orda_summit",
      eventTitle: "ORDA Tech Summit 2026",
      checkedIn: false,
      price: 0,
      paymentStatus: "free",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    },
    {
      _id: "r_event_2",
      type: "event",
      status: "pending",
      userId: "u_client_2",
      userName: "Erlan S",
      userEmail: "erlan@forum.kz",
      userPhone: "+7 700 300 30 30",
      organization: "Forum Alliance",
      eventId: "e_hr_forum",
      eventTitle: "HR Leadership Forum",
      checkedIn: false,
      price: 15000,
      paymentStatus: "paid",
      paidAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    },
    {
      _id: "r_event_3",
      type: "event",
      status: "rejected",
      userId: "u_client_2",
      userName: "Erlan S",
      userEmail: "erlan@forum.kz",
      userPhone: "+7 700 300 30 30",
      organization: "Forum Alliance",
      eventId: "e_product_meetup",
      eventTitle: "Product Community Meetup",
      checkedIn: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
    },
    {
      _id: "r_hall_1",
      type: "hall",
      status: "pending",
      userId: "u_client_1",
      userName: "Aigerim N",
      userEmail: "aigerim@company.kz",
      userPhone: "+7 700 200 20 20",
      organization: "Future Systems",
      hallId: "h_workshop",
      hallName: "Workshop Hub C",
      date: plusDays(9),
      time: "15:00",
      duration: 3,
      attendees: 45,
      purpose: "Workshop session",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      checkedIn: false,
      pricePerHour: 18000,
      amount: 54000,
      paymentStatus: "unpaid",
    },
    {
      _id: "r_hall_2",
      type: "hall",
      status: "approved",
      userId: "u_client_2",
      userName: "Erlan S",
      userEmail: "erlan@forum.kz",
      userPhone: "+7 700 300 30 30",
      organization: "Forum Alliance",
      hallId: "h_orion",
      hallName: "Orion Hall B",
      date: plusDays(14),
      time: "10:00",
      duration: 6,
      attendees: 90,
      purpose: "Partner strategy session",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
      checkedIn: false,
      pricePerHour: 28000,
      amount: 168000,
      paymentStatus: "paid",
      paidAt: new Date(Date.now() - 1000 * 60 * 60 * 39).toISOString(),
    },
  ];

  return { users, halls, events, requests, notifications: [] };
}

function readDemoDb() {
  const raw = localStorage.getItem(STORAGE_KEYS.demoDb);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      !Array.isArray(parsed.users) ||
      !Array.isArray(parsed.events) ||
      !Array.isArray(parsed.halls) ||
      !Array.isArray(parsed.requests)
    ) {
      return null;
    }
    if (!Array.isArray(parsed.notifications)) parsed.notifications = [];
    return parsed;
  } catch (error) {
    return null;
  }
}

function writeDemoDb(db) {
  localStorage.setItem(STORAGE_KEYS.demoDb, JSON.stringify(db));
  return db;
}

function ensureDemoDb() {
  const existing = readDemoDb();
  if (existing) return ensureDbShape(existing);
  return writeDemoDb(createDemoDatabase());
}

function ensureDbShape(db) {
  if (!Array.isArray(db.notifications)) db.notifications = [];
  return db;
}

function addClientNotification(db, payload = {}) {
  ensureDbShape(db);
  db.notifications.unshift({
    _id: uid("n"),
    userId: String(payload.userId || ""),
    type: String(payload.type || "info"),
    messageKey: String(payload.messageKey || ""),
    messageVars: payload.messageVars && typeof payload.messageVars === "object" ? payload.messageVars : {},
    reason: String(payload.reason || "").trim(),
    requestId: String(payload.requestId || ""),
    requestType: String(payload.requestType || ""),
    read: false,
    createdAt: new Date().toISOString(),
  });
}

function publishLocalCustomEvent(db, request) {
  if (!request || request.type !== "custom-event" || request.eventId) return;
  const event = {
    _id: uid("e"),
    title: request.eventTitle || request.purpose || "Client event",
    date: request.date,
    time: request.time || request.startTime || "10:00",
    category: request.category || "conference",
    description: request.description || request.purpose || "",
    agenda: `Длительность: ${request.duration || 1} ч. ${request.adminNotes || ""}`.trim(),
    organizer: request.organization || request.userName || "Client",
    location: request.location || request.hallName || "",
    city: request.city || "",
    format: ["offline", "online", "hybrid"].includes(request.format) ? request.format : "offline",
    meetingUrl: "",
    price: Number(request.ticketPrice || 0),
    currency: "KZT",
    featured: false,
    tags: [request.category, "client-event"].filter(Boolean),
    capacity: Number(request.attendees || 80),
    status: "published",
    image: hallImageFallbacks.default,
  };
  db.events.push(event);
  request.eventId = event._id;
}

function applyAdminDecision(db, request, nextStatus, reason = "") {
  const normalizedReason = String(reason || "").trim();
  request.status = nextStatus;

  if (nextStatus !== "approved") {
    request.checkedIn = false;
    request.checkedInAt = null;
  }

  if (nextStatus === "rejected" || nextStatus === "cancelled") {
    request.adminReason = normalizedReason;
    request.decidedAt = new Date().toISOString();

    let refunded = false;
    if (request.paymentStatus && request.paymentStatus !== "free") {
      request.paymentStatus = "refunded";
      request.refundedAt = new Date().toISOString();
      refunded = true;
    }

    const messageKey =
      request.type === "hall"
        ? nextStatus === "rejected"
          ? "notifClientHallRejectedRefunded"
          : "notifClientHallCancelledRefunded"
        : nextStatus === "rejected"
          ? "notifClientTicketRejectedRefunded"
          : "notifClientTicketCancelledRefunded";

    addClientNotification(db, {
      userId: request.userId,
      type: refunded ? "warn" : "info",
      messageKey,
      reason: normalizedReason,
      requestId: request._id,
      requestType: request.type,
    });

    return { refunded };
  }

  if (nextStatus === "approved") {
    request.adminReason = "";
    request.decidedAt = new Date().toISOString();
    publishLocalCustomEvent(db, request);
  }

  if (nextStatus === "pending") {
    request.adminReason = "";
  }

  return { refunded: false };
}

function ensureSessionValidity() {
  if (!state.token) return;
  const db = readDemoDb();
  if (isLocalSessionToken(state.token) && (!db || !currentUser(ensureDbShape(db)))) {
    clearSession();
  }
}

function eventPayload(body) {
  return {
    title: String(body.title || "").trim(),
    date: String(body.date || "").trim(),
    time: String(body.time || "10:00").trim(),
    category: String(body.category || "").trim(),
    description: String(body.description || "").trim(),
    agenda: String(body.agenda || "").trim(),
    organizer: String(body.organizer || "ORDA").trim(),
    location: String(body.location || "").trim(),
    format: String(body.format || "offline").trim(),
    meetingUrl: String(body.meetingUrl || "").trim(),
    price: Number(body.price || 0),
    currency: String(body.currency || "KZT").trim(),
    featured: body.featured === true || body.featured === "true" || body.featured === "on",
    tags: String(body.tags || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    capacity: Number(body.capacity || 80),
    status: String(body.status || "published").trim(),
  };
}

function hallPayload(body) {
  const equipment = Array.isArray(body.equipment)
    ? body.equipment
    : String(body.equipment || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

  return {
    name: String(body.name || "").trim(),
    floor: String(body.floor || "").trim(),
    location: String(body.location || "").trim(),
    capacity: Number(body.capacity || 0),
    pricePerHour: Number(body.pricePerHour || 0),
    equipment,
    description: String(body.description || "").trim(),
    status: String(body.status || "available").trim(),
  };
}

function parseBody(options) {
  if (!options.body) return {};
  if (typeof options.body === "string") {
    try {
      return JSON.parse(options.body);
    } catch (error) {
      return {};
    }
  }
  return options.body;
}

async function localApi(url, options = {}) {
  const method = String(options.method || "GET").toUpperCase();
  const parsedUrl = new URL(url, window.location.origin);
  const path = parsedUrl.pathname;
  const params = parsedUrl.searchParams;
  const body = parseBody(options);

  const db = ensureDbShape(ensureDemoDb());
  const user = currentUser(db);

  if (path === "/health" && method === "GET") {
    return { status: "ok", brand: "ORDA Smart Event System", database: "local-demo" };
  }

  if (path === "/seed" && method === "GET") {
    if (!user || user.role !== "admin") throw createError("adminOnly", 403);
    writeDemoDb(createDemoDatabase());
    return success("msgSeedDone");
  }

  if (path === "/register" && method === "POST") {
    const name = String(body.name || "").trim();
    const email = normalizeEmail(body.email);
    const password = String(body.password || "");

    if (!name || !email || !password) throw createError("errAuthRequired");
    if (password.length < 6) throw createError("errPasswordMin");
    if (db.users.some((item) => normalizeEmail(item.email) === email)) throw createError("errEmailExists");

    const isFirstAdmin = !db.users.some((item) => item.role === "admin");
    const nextUser = {
      _id: uid("u"),
      name,
      email,
      password,
      role: isFirstAdmin ? "admin" : "user",
      phone: "",
      organization: "",
      city: "",
    };

    db.users.push(nextUser);
    writeDemoDb(db);

    return {
      ...success(isFirstAdmin ? "msgRegisterAdmin" : "msgRegisterDone"),
      role: nextUser.role,
      data: { role: nextUser.role },
    };
  }

  if (path === "/login" && method === "POST") {
    const email = normalizeEmail(body.email);
    const password = String(body.password || "");

    if (!email || !password) throw createError("errLoginRequired");
    const existing = db.users.find((item) => normalizeEmail(item.email) === email);
    if (!existing) throw createError("errUserNotFound", 404);
    if (existing.password !== password) throw createError("errWrongPassword", 401);

    const token = `local::${existing._id}`;
    return {
      ...success("msgLoginDone"),
      token,
      role: existing.role,
      email: existing.email,
      name: existing.name,
      phone: existing.phone,
      organization: existing.organization,
      city: existing.city,
      data: {
        token,
        role: existing.role,
        email: existing.email,
        name: existing.name,
        phone: existing.phone,
        organization: existing.organization,
        city: existing.city,
      },
    };
  }

  if (path === "/me" && method === "GET") {
    if (!user) throw createError("errSessionExpired", 401);
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      organization: user.organization,
      city: user.city,
    };
  }

  if (path === "/me" && method === "PUT") {
    if (!user) throw createError("errSessionExpired", 401);
    const target = db.users.find((item) => item._id === user._id);

    target.name = String(body.name || target.name || "").trim();
    target.phone = String(body.phone || "").trim();
    target.organization = String(body.organization || "").trim();
    target.city = String(body.city || "").trim();

    db.requests.forEach((request) => {
      if (request.userId === target._id) {
        request.userName = target.name;
        request.userEmail = target.email;
        request.userPhone = target.phone;
        request.organization = target.organization;
      }
    });

    writeDemoDb(db);
    return {
      ...success("profileSaved"),
      user: {
        _id: target._id,
        name: target.name,
        email: target.email,
        role: target.role,
        phone: target.phone,
        organization: target.organization,
        city: target.city,
      },
    };
  }

  if (path === "/events" && method === "GET") {
    const search = String(params.get("search") || "").trim().toLowerCase();
    const category = String(params.get("category") || "all");
    const format = String(params.get("format") || "all");

    let filtered = sortEvents(db.events);
    if (category !== "all") filtered = filtered.filter((item) => item.category === category);
    if (format !== "all") filtered = filtered.filter((item) => item.format === format);

    if (search) {
      filtered = filtered.filter((item) => {
        const haystack = [item.title, item.description, item.location, item.city, item.organizer, (item.tags || []).join(" ")]
          .join(" ")
          .toLowerCase();
        return haystack.includes(search);
      });
    }

    return filtered.map((item) => ensureEventShape(item, db, user));
  }

  const eventMatch = path.match(/^\/events\/([^/]+)$/);
  if (eventMatch && method === "GET") {
    const event = db.events.find((item) => item._id === eventMatch[1]);
    if (!event) throw createError("errEventNotFound", 404);
    const result = ensureEventShape(event, db, user);
    return { ...success("msgEventLoaded"), data: result, ...result };
  }

  if (path === "/events" && method === "POST") {
    if (!user || user.role !== "admin") throw createError("adminOnly", 403);
    const payload = eventPayload(body);
    if (!payload.title || !payload.date || !payload.category || !payload.location) throw createError("errEventRequired");
    if (!Number.isFinite(payload.capacity) || payload.capacity < 1) throw createError("errCapacityPositive");
    if (!Number.isFinite(payload.price) || payload.price < 0) throw createError("errPriceNegative");

    payload._id = uid("e");
    db.events.push(payload);
    writeDemoDb(db);
    return { ...success("msgEventCreated"), event: payload, data: payload };
  }

  if (eventMatch && method === "PUT") {
    if (!user || user.role !== "admin") throw createError("adminOnly", 403);
    const target = db.events.find((item) => item._id === eventMatch[1]);
    if (!target) throw createError("errEventNotFound", 404);

    const payload = eventPayload(body);
    if (!payload.title || !payload.date || !payload.category || !payload.location) throw createError("errEventRequired");
    if (!Number.isFinite(payload.capacity) || payload.capacity < 1) throw createError("errCapacityPositive");
    if (!Number.isFinite(payload.price) || payload.price < 0) throw createError("errPriceNegative");

    Object.assign(target, payload);
    writeDemoDb(db);
    return { ...success("msgEventUpdated"), event: target, data: target };
  }

  if (eventMatch && method === "DELETE") {
    if (!user || user.role !== "admin") throw createError("adminOnly", 403);
    const index = db.events.findIndex((item) => item._id === eventMatch[1]);
    if (index === -1) throw createError("errEventNotFound", 404);

    const [removed] = db.events.splice(index, 1);
    db.requests = db.requests.filter((request) => !(request.type === "event" && request.eventId === removed._id));
    writeDemoDb(db);
    return success("msgEventDeleted");
  }

  if (path === "/book" && method === "POST") {
    if (!user) throw createError("loginRequired", 401);
    const eventId = String(body.eventId || "");
    const event = db.events.find((item) => item._id === eventId);

    if (!event) throw createError("errEventNotFound", 404);
    if (event.status !== "published") throw createError("errEventClosed");

    const existing = db.requests.find(
      (request) =>
        request.type === "event" &&
        request.eventId === eventId &&
        request.userId === user._id &&
        ["pending", "approved"].includes(request.status)
    );
    if (existing) throw createError("errEventAlreadyRequested");

    const booked = db.requests.filter(
      (request) =>
        request.type === "event" &&
        request.eventId === eventId &&
        ["pending", "approved"].includes(request.status)
    ).length;
    if (booked >= Number(event.capacity || 0)) throw createError("errNoSeats");

    const price = Number(event.price || 0);
    const paymentStatus = price > 0 ? String(body.paymentStatus || "unpaid").trim() : "free";
    if (price > 0 && !["paid", "unpaid"].includes(paymentStatus)) throw createError("errPaymentRequired");
    const paymentMethod = price > 0 ? String(body.paymentMethod || "card").trim() : "free";

    const request = {
      _id: uid("r"),
      type: "event",
      status: "pending",
      userId: user._id,
      userName: String(body.userName || body.contactName || user.name || "").trim(),
      userEmail: String(body.userEmail || body.email || user.email || "").trim(),
      userPhone: String(body.userPhone || body.phone || user.phone || "").trim(),
      organization: user.organization || "",
      eventId: event._id,
      eventTitle: event.title,
      price,
      paymentStatus,
      paymentMethod,
      paidAt: paymentStatus === "paid" ? new Date().toISOString() : null,
      checkedIn: false,
      createdAt: new Date().toISOString(),
    };

    db.requests.push(request);

    writeDemoDb(db);
    if (paymentStatus === "paid") return { ...success("msgPaymentSuccess"), booking: request, data: request };
    if (paymentStatus === "unpaid") return { ...success("msgPaymentPending"), booking: request, data: request };
    return { ...success("msgEventRequestSent"), booking: request, data: request };
  }

  if (path === "/my-bookings" && method === "GET") {
    if (!user) throw createError("loginRequired", 401);
    return db.requests
      .filter((request) => request.type === "event" && request.userId === user._id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  const myBookingMatch = path.match(/^\/my-bookings\/([^/]+)$/);
  if (myBookingMatch && method === "PATCH") {
    if (!user) throw createError("loginRequired", 401);
    const request = db.requests.find(
      (item) => item._id === myBookingMatch[1] && item.type === "event" && item.userId === user._id
    );
    if (!request) throw createError("errRequestNotFound", 404);
    if (isInactiveRequest(request.status)) throw createError("errRequestStatusInvalid", 400);

    request.paymentStatus = "paid";
    request.paymentMethod = String(body.paymentMethod || request.paymentMethod || "card").trim();
    request.paidAt = new Date().toISOString();

    writeDemoDb(db);
    return { ...success("msgPaymentSuccess"), booking: request, data: request };
  }

  if (myBookingMatch && method === "DELETE") {
    if (!user) throw createError("loginRequired", 401);
    const request = db.requests.find(
      (item) => item._id === myBookingMatch[1] && item.type === "event" && item.userId === user._id
    );
    if (!request) throw createError("errRequestNotFound", 404);
    request.status = "cancelled";
    writeDemoDb(db);
    return success("msgRequestCancelled");
  }

  if (path === "/halls" && method === "GET") {
    const search = String(params.get("search") || "").trim().toLowerCase();
    const capacityFilter = String(params.get("capacity") || "all");

    let halls = db.halls.slice();
    if (capacityFilter === "small") halls = halls.filter((item) => item.capacity <= 50);
    if (capacityFilter === "medium") halls = halls.filter((item) => item.capacity > 50 && item.capacity <= 150);
    if (capacityFilter === "large") halls = halls.filter((item) => item.capacity > 150);

    if (search) {
      halls = halls.filter((item) => {
        const haystack = [item.name, item.floor, item.location, item.description, (item.equipment || []).join(" "), (item.advantages || []).join(" ")]
          .join(" ")
          .toLowerCase();
        return haystack.includes(search);
      });
    }

    return halls.map((hall) => {
      const active = db.requests.filter(
        (request) =>
          request.type === "hall" &&
          request.hallId === hall._id &&
          ["pending", "approved"].includes(request.status)
      );
      return { ...hall, pricePerHour: Number(hall.pricePerHour || 0), activeRequests: active.length };
    });
  }

  if (path === "/halls" && method === "POST") {
    if (!user || user.role !== "admin") throw createError("adminOnly", 403);
    const payload = hallPayload(body);

    if (!payload.name || !payload.floor || !payload.location) throw createError("errHallFieldsRequired");
    if (!Number.isFinite(payload.capacity) || payload.capacity < 1) throw createError("errCapacityPositive");
    if (!Number.isFinite(payload.pricePerHour) || payload.pricePerHour < 0) throw createError("errPriceNegative");

    payload._id = uid("h");
    db.halls.push(payload);
    writeDemoDb(db);
    return { ...success("msgHallCreated"), hall: payload, data: payload };
  }

  const hallMatch = path.match(/^\/halls\/([^/]+)$/);
  if (hallMatch && method === "PUT") {
    if (!user || user.role !== "admin") throw createError("adminOnly", 403);
    const hall = db.halls.find((item) => item._id === hallMatch[1]);
    if (!hall) throw createError("errHallNotFound", 404);

    const payload = hallPayload(body);
    if (!payload.name || !payload.floor || !payload.location) throw createError("errHallFieldsRequired");
    if (!Number.isFinite(payload.capacity) || payload.capacity < 1) throw createError("errCapacityPositive");
    if (!Number.isFinite(payload.pricePerHour) || payload.pricePerHour < 0) throw createError("errPriceNegative");

    Object.assign(hall, payload);
    writeDemoDb(db);
    return { ...success("msgHallUpdated"), hall, data: hall };
  }

  if (hallMatch && method === "DELETE") {
    if (!user || user.role !== "admin") throw createError("adminOnly", 403);
    const index = db.halls.findIndex((item) => item._id === hallMatch[1]);
    if (index === -1) throw createError("errHallNotFound", 404);
    const hall = db.halls[index];

    const hasActiveRequests = db.requests.some(
      (request) => request.type === "hall" && request.hallId === hall._id && ["pending", "approved"].includes(request.status)
    );
    if (hasActiveRequests) throw createError("errHallHasRequests");

    const usedByEvents = db.events.some((event) => event.location === hall.name && event.status !== "closed");
    if (usedByEvents) throw createError("errHallUsedByEvent");

    db.halls.splice(index, 1);
    db.requests = db.requests.filter((request) => !(request.type === "hall" && request.hallId === hall._id));
    writeDemoDb(db);
    return success("msgHallDeleted");
  }

  if (path === "/hall-bookings" && method === "POST") {
    if (!user) throw createError("loginRequired", 401);

    const type = String(body.type || "hall") === "custom-event" ? "custom-event" : "hall";
    const hall = type === "hall" ? db.halls.find((item) => item._id === String(body.hallId || "")) : null;
    if (type === "hall" && !hall) throw createError("errHallNotFound", 404);

    const date = String(body.date || "").trim();
    const time = String(body.time || "").trim();
    const duration = Number(body.duration || 0);
    const attendees = Number(body.attendees || 0);
    const purpose = String(body.purpose || "").trim();
    const location = String(body.location || "").trim();
    const city = String(body.city || "").trim();
    const pricePerHour = Number(hall?.pricePerHour || 0);
    const amount = Number(body.amount || (type === "custom-event" ? announcementRequestPrice : pricePerHour * duration) || 0);

    if (!date || !time || !duration || !attendees || !purpose) throw createError("errHallFieldsRequired");
    if (type === "custom-event" && (!body.eventTitle || !location || !city)) throw createError("errHallFieldsRequired");
    if (hall && attendees > hall.capacity) throw createError("errHallCapacityExceeded", 400, { hall: hall.name, capacity: hall.capacity });

    const request = {
      _id: uid("r"),
      type,
      status: "pending",
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone || "",
      organization: user.organization || "",
      eventTitle: String(body.eventTitle || "").trim(),
      category: String(body.category || "").trim(),
      format: String(body.format || "offline").trim(),
      description: String(body.description || purpose).trim(),
      hallId: hall?._id || "",
      hallName: hall?.name || "",
      location: type === "custom-event" ? location : hall?.name || "",
      city,
      date,
      time,
      startTime: String(body.startTime || time).trim(),
      endTime: String(body.endTime || "").trim(),
      duration,
      attendees,
      purpose,
      adminNotes: String(body.adminNotes || "").trim(),
      services: Array.isArray(body.services) ? body.services : [],
      ticketPrice: Number(body.ticketPrice || 0),
      pricePerHour,
      amount,
      paymentStatus: String(body.paymentStatus || (amount > 0 ? "unpaid" : "free")),
      paymentMethod: String(body.paymentMethod || "").trim(),
      paidAt: body.paymentStatus === "paid" ? new Date().toISOString() : null,
      createdAt: new Date().toISOString(),
      checkedIn: false,
    };
    db.requests.push(request);

    writeDemoDb(db);
    return { ...success("msgHallRequestSent"), booking: request, data: request };
  }

  if (path === "/my-hall-bookings" && method === "GET") {
    if (!user) throw createError("loginRequired", 401);
    return db.requests
      .filter((request) => ["hall", "custom-event"].includes(request.type) && request.userId === user._id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  const myHallBookingMatch = path.match(/^\/my-hall-bookings\/([^/]+)$/);
  if (myHallBookingMatch && method === "PATCH") {
    if (!user) throw createError("loginRequired", 401);
    const request = db.requests.find(
      (item) => item._id === myHallBookingMatch[1] && ["hall", "custom-event"].includes(item.type) && item.userId === user._id
    );
    if (!request) throw createError("errRequestNotFound", 404);
    if (isInactiveRequest(request.status)) throw createError("errRequestStatusInvalid", 400);

    request.paymentStatus = "paid";
    request.paymentMethod = String(body.paymentMethod || request.paymentMethod || "card").trim();
    request.paidAt = new Date().toISOString();

    writeDemoDb(db);
    return { ...success("msgPaymentSuccess"), booking: request, data: request };
  }

  if (myHallBookingMatch && method === "DELETE") {
    if (!user) throw createError("loginRequired", 401);
    const request = db.requests.find(
      (item) => item._id === myHallBookingMatch[1] && ["hall", "custom-event"].includes(item.type) && item.userId === user._id
    );
    if (!request) throw createError("errRequestNotFound", 404);
    request.status = "cancelled";
    writeDemoDb(db);
    return success("msgRequestCancelled");
  }

  if (path === "/my-notifications" && method === "GET") {
    if (!user) throw createError("loginRequired", 401);
    return db.notifications
      .filter((item) => item.userId === user._id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  const myNotificationMatch = path.match(/^\/my-notifications\/([^/]+)\/read$/);
  if (myNotificationMatch && method === "PATCH") {
    if (!user) throw createError("loginRequired", 401);
    const notification = db.notifications.find((item) => item._id === myNotificationMatch[1] && item.userId === user._id);
    if (!notification) throw createError("errRequestNotFound", 404);
    notification.read = true;
    notification.readAt = new Date().toISOString();
    writeDemoDb(db);
    return success("msgNotificationMarkedRead");
  }

  if (path === "/users" && method === "GET") {
    if (!user || user.role !== "admin") throw createError("adminOnly", 403);
    return db.users.map((item) => ({
      _id: item._id,
      name: item.name,
      email: item.email,
      role: item.role,
      phone: item.phone || "",
      organization: item.organization || "",
      city: item.city || "",
    }));
  }

  if (path === "/bookings" && method === "GET") {
    if (!user || user.role !== "admin") throw createError("adminOnly", 403);
    return db.requests.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  if (path === "/stats" && method === "GET") {
    if (!user || user.role !== "admin") throw createError("adminOnly", 403);

    const stats = {
      events: db.events.length,
      bookings: db.requests.filter((request) => request.status !== "cancelled").length,
      users: db.users.length,
      publishedEvents: db.events.filter((event) => event.status === "published").length,
      checkedIn: db.requests.filter((request) => request.type === "event" && request.checkedIn).length,
      paidTickets: db.requests.filter((request) => request.type === "event" && request.paymentStatus === "paid").length,
      approvedHallBookings: db.requests.filter((request) => request.type === "hall" && request.status === "approved").length,
    };

    return { ...success("msgStatsLoaded"), ...stats, data: stats };
  }

  const checkInMatch = path.match(/^\/bookings\/([^/]+)\/check-in$/);
  if (checkInMatch && method === "PATCH") {
    if (!user || user.role !== "admin") throw createError("adminOnly", 403);

    const request = db.requests.find((item) => item._id === checkInMatch[1]);
    if (!request || request.type !== "event") throw createError("errRequestNotFound", 404);
    if (request.status !== "approved") throw createError("errCheckinOnlyApproved");

    request.checkedIn = true;
    request.checkedInAt = new Date().toISOString();
    writeDemoDb(db);

    return success("msgCheckinDone");
  }

  const bookingMatch = path.match(/^\/bookings\/([^/]+)$/);
  if (bookingMatch && method === "PATCH") {
    if (!user || user.role !== "admin") throw createError("adminOnly", 403);

    const request = db.requests.find((item) => item._id === bookingMatch[1]);
    if (!request) throw createError("errRequestNotFound", 404);

    const nextStatus = String(body.status || request.status).trim();
    if (!["new", "review", "pending", "approved", "rejected", "cancelled"].includes(nextStatus)) throw createError("errRequestStatusInvalid");
    const reason = String(body.reason || body.adminReason || "").trim();

    if (request.type === "hall" || request.type === "custom-event") {
      if (body.date) request.date = String(body.date);
      if (body.time) request.time = String(body.time);
      if (Number(body.duration) > 0) request.duration = Number(body.duration);
      if (Number(body.attendees) > 0) request.attendees = Number(body.attendees);
      if (typeof body.purpose === "string") request.purpose = String(body.purpose).trim();
      request.amount = Number(request.pricePerHour || 0) * Number(request.duration || 0) || Number(request.amount || 0);
    }

    const { refunded } = applyAdminDecision(db, request, nextStatus, reason);

    writeDemoDb(db);
    if (nextStatus === "approved") return success("msgRequestApproved");
    if (nextStatus === "rejected") return success(refunded ? "msgRequestRejectedRefunded" : "msgRequestRejected");
    if (nextStatus === "cancelled") return success(refunded ? "msgRequestCancelledRefunded" : "msgRequestCancelledByAdmin");
    return success("msgRequestUpdated");
  }

  if (bookingMatch && method === "DELETE") {
    if (!user || user.role !== "admin") throw createError("adminOnly", 403);
    const index = db.requests.findIndex((item) => item._id === bookingMatch[1]);
    if (index === -1) throw createError("errRequestNotFound", 404);
    db.requests.splice(index, 1);
    writeDemoDb(db);
    return success("msgRequestDeleted");
  }

  const statusMatch = path.match(/^\/bookings\/([^/]+)\/status$/);
  if (statusMatch && method === "PATCH") {
    if (!user || user.role !== "admin") throw createError("adminOnly", 403);

    const request = db.requests.find((item) => item._id === statusMatch[1]);
    if (!request) throw createError("errRequestNotFound", 404);

    const nextStatus = String(body.status || "").trim();
    if (!["new", "review", "pending", "approved", "rejected", "cancelled"].includes(nextStatus)) throw createError("errRequestStatusInvalid");
    const reason = String(body.reason || "").trim();

    const { refunded } = applyAdminDecision(db, request, nextStatus, reason);

    writeDemoDb(db);
    if (nextStatus === "approved") return success("msgRequestApproved");
    if (nextStatus === "rejected") return success(refunded ? "msgRequestRejectedRefunded" : "msgRequestRejected");
    if (nextStatus === "cancelled") return success(refunded ? "msgRequestCancelledRefunded" : "msgRequestCancelledByAdmin");
    return success("msgRequestUpdated");
  }

  throw createError("errRouteNotFound", 404);
}

async function localApiTranslated(url, options = {}) {
  try {
    return await localApi(url, options);
  } catch (error) {
    if (error?.i18nKey) {
      const translated = new Error(tr(error.i18nKey, error.i18nVars));
      translated.status = error.status;
      throw translated;
    }
    throw error;
  }
}

function isBackendOnlyPath(path) {
  const pathname = String(path || "").split("?")[0];
  return /^(\/login|\/register|\/me|\/users|\/stats|\/events|\/halls|\/book|\/bookings|\/my-bookings|\/hall-bookings|\/my-hall-bookings|\/my-notifications|\/support-messages)(\/|$)/.test(pathname);
}

async function api(url, options = {}) {
  const path = url.startsWith("/") ? url : `/${url}`;
  const { localFallback = true, ...requestOptions } = options;
  const backendOnly = isBackendOnlyPath(path);

  if (!backendOnly && isLocalSessionToken(state.token) && path !== "/login" && path !== "/register") {
    state.dataMode = "local";
    updateDataModeBadge();
    return await localApiTranslated(path, requestOptions);
  }

  if (API_BASE_URL && window.ORDA?.http?.request) {
    try {
      const result = await window.ORDA.http.request(`${API_BASE_URL}${path}`, requestOptions);
      state.dataMode = "remote";
      updateDataModeBadge();
      return result;
    } catch (error) {
      if (shouldResetSession(error, path)) {
        resetExpiredSession();
        throw new Error(t("errSessionExpired"));
      }

      const canFallback =
        localFallback !== false &&
        !backendOnly &&
        LOCAL_FALLBACK_ENABLED &&
        (!error.status || [404, 405, 501, 503].includes(Number(error.status)));
      if (!canFallback) throw error;
      console.warn(`Remote API fallback for ${path}: ${error.message}`);
    }
  }

  if (backendOnly) {
    throw new Error("Backend API is unavailable for this action.");
  }

  state.dataMode = "local";
  updateDataModeBadge();
  return await localApiTranslated(path, requestOptions);
}

function applyTheme() {
  window.ORDA?.theme?.apply(els.themeToggle);
}

function saveSession(data) {
  window.ORDA.session.save(data, state);
}

function clearSession() {
  window.ORDA.session.clear(state);
}

function applyPortalVisibility() {
  const isAdmin = state.role === "admin";

  localStorage.setItem(STORAGE_KEYS.portal, state.portal);
  document.body.dataset.portal = state.portal;

  if (els.portalSwitcher) {
    els.portalSwitcher.classList.toggle("hidden", !isAdmin);
  }
  if (els.portalClientBtn) {
    els.portalClientBtn.classList.toggle("hidden", !isAdmin);
    els.portalClientBtn.classList.toggle("active", state.portal === "client");
  }
  if (els.portalAdminBtn) {
    els.portalAdminBtn.classList.toggle("hidden", !isAdmin);
    els.portalAdminBtn.classList.toggle("active", state.portal === "admin");
  }

  document.querySelectorAll("[data-portal-group]").forEach((node) => {
    const group = node.dataset.portalGroup;
    let hidden = false;
    if (group === "client") {
      hidden = (state.portal === "admin");
    } else if (group === "admin") {
      hidden = !isAdmin;
    }
    node.classList.toggle("portal-hidden", hidden);
  });
}

function setPortal(portal) {
  if (state.role !== "admin") portal = "client";
  state.portal = portal || portalFromRole();
  applyPortalVisibility();

  if (state.portal === "admin") {
    if (!adminPortalViews.has(state.currentView)) {
      setView("admin");
    } else {
      setView(state.currentView);
    }
    return;
  }

  if (!clientPortalViews.has(state.currentView)) {
    setView(state.token ? "dashboard" : "dashboard");
  } else {
    setView(state.currentView);
  }
}

function updateShell() {
  const isLoggedIn = Boolean(state.token);
  const isAdmin = state.role === "admin";

  els.accountName.textContent = isLoggedIn
    ? `${state.name || state.email} - ${isAdmin ? t("roleAdmin") : t("roleUser")}`
    : t("guest");

  document.body.dataset.role = isAdmin ? "admin" : isLoggedIn ? "client" : "guest";

  if (els.loginBtn) els.loginBtn.classList.toggle("hidden", isLoggedIn);
  els.logoutBtn.classList.toggle("hidden", !isLoggedIn);
  if (isLoggedIn) closeAuth();

  document.querySelectorAll(".admin-only").forEach((node) => node.classList.toggle("hidden", !isAdmin));
  if (els.clientWorkspace) els.clientWorkspace.classList.toggle("hidden", isAdmin);
  if (els.adminWorkspace) els.adminWorkspace.classList.toggle("hidden", !isAdmin);
  applyPortalVisibility();
}

function updateDataModeBadge() {
  if (!els.dataModeBadge) return;
  els.dataModeBadge.textContent = state.dataMode === "local" ? t("demoModeBadge") : "";
}

function applyTranslations() {
  document.documentElement.lang = state.lang === "kk" ? "kk" : state.lang;
  els.languageSelect.value = state.lang;
  window.ORDA.lang = state.lang;

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });

  document.querySelectorAll("[data-placeholder]").forEach((node) => {
    node.placeholder = t(node.dataset.placeholder);
  });

  document.querySelectorAll("[data-i18n-title]").forEach((node) => {
    node.setAttribute("title", t(node.dataset.i18nTitle));
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((node) => {
    node.setAttribute("aria-label", t(node.dataset.i18nAriaLabel));
  });

  document.querySelectorAll("[data-i18n-content]").forEach((node) => {
    node.setAttribute("content", t(node.dataset.i18nContent));
  });

  updateDataModeBadge();
  updateShell();
  renderAll();
  if (typeof window.ORDA.renderCalendar === "function") window.ORDA.renderCalendar();
}

function setView(view) {
  const allowedViews = state.portal === "admin" ? adminPortalViews : clientPortalViews;
  if (!allowedViews.has(view)) view = state.portal === "admin" ? "admin" : "dashboard";

  if (view === "admin" && state.role !== "admin") {
    showMessage(t("adminOnly"), "error");
    view = "dashboard";
  }

  if (view === "profile" && !state.token) {
    showMessage(t("loginRequired"), "error");
    view = "dashboard";
  }

  document.querySelectorAll(".view").forEach((node) => node.classList.remove("active-view"));
  document.querySelector(`#${view}View`)?.classList.add("active-view");
  document.querySelectorAll(".nav-item").forEach((button) => button.classList.toggle("active", button.dataset.view === view));
  document.body.dataset.view = view;
  state.currentView = view;
  localStorage.setItem(STORAGE_KEYS.currentView, view);

  els.sidebar.classList.remove("open");
  if (els.sidebarBackdrop) els.sidebarBackdrop.classList.remove("visible");

  if (view === "profile") {
    Promise.all([loadProfile(), loadMyBookings(), loadMyHallBookings(), loadMyNotifications()]).catch((error) =>
      showMessage(error.message, "error")
    );
  }

  if (view === "admin") {
    loadAdmin().catch((error) => showMessage(error.message, "error"));
  }

  if (view === "halls") {
    loadHalls().catch((error) => showMessage(error.message, "error"));
  }

  if (view === "calendar") {
    requestAnimationFrame(() => {
      renderCalendar();
      if (typeof window.ORDA.renderCalendar === "function") window.ORDA.renderCalendar();
      syncCalendarAgendaHeight();
    });
  }
}

function downloadTextFile(filename, text, type = "text/plain;charset=utf-8") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function csvCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function normalizeRequestStatus(status) {
  return status === "registered" ? "pending" : status || "pending";
}

function normalizeAdminBooking(request) {
  const id = String(request._id || request.id || "");
  return {
    ...request,
    _id: id,
    type: request.type || "event",
    status: normalizeRequestStatus(request.status),
  };
}

async function adminBookingApi(requestId, suffix = "", options = {}) {
  const id = String(requestId || "");
  return await api(`/bookings/${id}${suffix}`, { ...options, localFallback: false });
}

async function updateAdminBookingStatus(requestId, payload) {
  const options = {
    method: "PATCH",
    body: JSON.stringify(payload),
  };

  try {
    return await adminBookingApi(requestId, "/status", options);
  } catch (error) {
    if ([404, 405].includes(Number(error.status))) {
      return await adminBookingApi(requestId, "", options);
    }
    throw error;
  }
}

function statusLabel(status) {
  status = normalizeRequestStatus(status);
  if (status === "new") return t("requestStatusNew");
  if (status === "review") return t("requestStatusReview");
  if (status === "approved") return t("requestStatusApproved");
  if (status === "rejected") return t("requestStatusRejected");
  if (status === "cancelled") return t("requestStatusCancelled");
  return t("requestStatusPending");
}

function statusClass(status) {
  status = normalizeRequestStatus(status);
  const map = {
    new: "status-pill-pending",
    review: "status-pill-pending",
    pending: "status-pill-pending",
    approved: "status-pill-approved",
    rejected: "status-pill-rejected",
    cancelled: "status-pill-cancelled",
  };
  return map[status] || "status-pill-pending";
}

function requestTypeLabel(type) {
  if (type === "custom-event") return t("requestTypeCustomEvent");
  return type === "hall" ? t("requestTypeHall") : t("requestTypeEvent");
}

function hallTranslation(hall) {
  return hall?.translations?.[state.lang] || hall?.translations?.ru || hall?.translations?.en || {};
}

function hallText(hall, field) {
  const translated = hallTranslation(hall);
  return translated[field] || hall?.[field] || "";
}

function hallList(hall, field) {
  const translated = hallTranslation(hall);
  const value = translated[field] || hall?.[field] || [];
  if (Array.isArray(value)) return value;
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function hallImage(hall) {
  const name = hall?.name || hallText(hall, "name");
  return hall?.image || hallImageFallbacks[hall?._id] || hallImageFallbacks[name] || hallImageFallbacks.default;
}

function canManageRequest(request) {
  return request.status !== "cancelled";
}

function minutesFromTime(value) {
  const [hours, minutes] = String(value || "00:00").split(":").map((part) => Number(part || 0));
  return hours * 60 + minutes;
}

function requestSlotDuration(slot) {
  return Math.max(1, (minutesFromTime(slot?.end) - minutesFromTime(slot?.start)) / 60);
}

function requestSlotLabel(slot) {
  return `${slot.start}-${slot.end}`;
}

function addHoursToTime(time, duration) {
  const total = minutesFromTime(time) + Number(duration || 0) * 60;
  const hours = Math.floor(total / 60) % 24;
  const minutes = total % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function selectedRequestHall() {
  return state.halls.find((hall) => hall._id === requestSelection.hallId) || null;
}

function selectedRequestSlot() {
  return requestSlots.find((slot) => slot.id === requestSelection.slotId) || null;
}

function requestBlocksSlot(request, hall, date, slot) {
  if (!request || !hall || !date || !slot) return false;
  if (!["new", "review", "pending", "approved"].includes(request.status)) return false;
  const requestHall = request.hallId || "";
  const requestHallName = request.hallName || request.location || "";
  if (requestHall && requestHall !== hall._id) return false;
  if (!requestHall && requestHallName !== hall.name) return false;
  if (request.date !== date) return false;

  const start = minutesFromTime(request.time || request.startTime || "00:00");
  const duration = Number(request.duration || 2);
  const end = request.endTime ? minutesFromTime(request.endTime) : start + duration * 60;
  const slotStart = minutesFromTime(slot.start);
  const slotEnd = minutesFromTime(slot.end);
  return start < slotEnd && end > slotStart;
}

function isRequestSlotBusy(hall, date, slot) {
  if (!hall || !date || !slot) return false;
  const requests = [...state.adminBookings, ...state.hallBookings];
  const requestBusy = requests.some((request) => requestBlocksSlot(request, hall, date, slot));
  const eventBusy = state.events.some((event) => {
    if (event.status && !["published", "draft"].includes(event.status)) return false;
    if (event.date !== date) return false;
    if ((event.location || "") !== hall.name && (event.hallName || "") !== hall.name) return false;
    const start = minutesFromTime(event.time || "10:00");
    const end = start + 120;
    const slotStart = minutesFromTime(slot.start);
    const slotEnd = minutesFromTime(slot.end);
    return start < slotEnd && end > slotStart;
  });
  return requestBusy || eventBusy;
}

function requestBaseRent() {
  if (requestMode !== "hall") return requestMode === "event" ? announcementRequestPrice : 0;
  const hall = selectedRequestHall();
  const duration = Number(els.customRequestForm?.elements.namedItem("duration")?.value || 0);
  if (!hall || duration <= 0) return 0;
  return Number(hall.pricePerHour || 0) * duration;
}

function selectedRequestServices() {
  if (requestMode !== "hall") return [];
  if (!els.customRequestForm) return [];
  return Array.from(els.customRequestForm.querySelectorAll('input[name="services"]:checked')).map((input) => {
    const config = requestServiceConfig.find((item) => item.id === input.value);
    return {
      id: input.value,
      key: config?.key || input.value,
      name: config?.label || t(config?.key || input.value),
      price: Number(input.dataset.price || config?.price || 0),
    };
  });
}

function requestTotalAmount() {
  return requestBaseRent() + selectedRequestServices().reduce((sum, service) => sum + Number(service.price || 0), 0);
}

function updateRequestTotals() {
  const amount = requestTotalAmount();
  if (els.requestRentPreview) els.requestRentPreview.textContent = formatCurrency(requestBaseRent());
  if (els.requestTotalPreview) els.requestTotalPreview.textContent = formatCurrency(amount);
}

function setRequestMode(mode = "hall") {
  requestMode = mode === "event" ? "event" : "hall";
  document.querySelectorAll("[data-request-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.requestMode === requestMode);
  });
  els.requestHallPlanner?.classList.toggle("hidden", requestMode !== "hall");
  els.ownEventFields?.classList.toggle("hidden", requestMode !== "event");
  els.requestServicesSection?.classList.toggle("hidden", requestMode !== "hall");

  ["ownDate", "ownTime", "ownLocation", "ownCity"].forEach((name) => {
    const field = els.customRequestForm?.elements.namedItem(name);
    if (field) field.required = requestMode === "event";
  });

  renderRequestSummary();
}

function renderRequestSummary() {
  if (!els.requestSelectedSummary) return;
  if (requestMode === "event") {
    els.requestSelectedSummary.innerHTML = `
      <div><span>Сценарий</span><strong>Собственное мероприятие</strong></div>
      <div><span>Публикация</span><strong>После модерации</strong></div>
    `;
    els.customRequestForm?.classList.remove("hidden");
    updateRequestTotals();
    return;
  }

  const hall = selectedRequestHall();
  const slot = selectedRequestSlot();
  if (!hall || !requestSelection.date || !slot) {
    els.requestSelectedSummary.innerHTML = `<div class="empty">${escapeHtml(t("requestPickSlotHint"))}</div>`;
    els.customRequestForm?.classList.add("hidden");
    updateRequestTotals();
    return;
  }

  els.requestSelectedSummary.innerHTML = `
    <div><span>${escapeHtml(t("navHalls"))}</span><strong>${escapeHtml(hallText(hall, "name") || "-")}</strong></div>
    <div><span>${escapeHtml(t("date"))}</span><strong>${escapeHtml(formatDate(requestSelection.date))}</strong></div>
    <div><span>${escapeHtml(t("time"))}</span><strong>${escapeHtml(requestSlotLabel(slot))}</strong></div>
    <div><span>${escapeHtml(t("hallDuration"))}</span><strong>${escapeHtml(`${els.customRequestForm?.elements.namedItem("duration")?.value || requestSlotDuration(slot)} ${t("hourShort")}`)}</strong></div>
  `;
  els.customRequestForm?.classList.remove("hidden");
  updateRequestTotals();
}

function renderRequestSlots() {
  if (!els.requestSlotGrid) return;
  const hall = selectedRequestHall();
  const date = requestSelection.date;
  if (!hall || !date) {
    els.requestSlotGrid.innerHTML = `<div class="empty">${escapeHtml(t("requestChooseHallDateHint"))}</div>`;
    renderRequestSummary();
    return;
  }

  els.requestSlotGrid.innerHTML = requestSlots
    .map((slot) => {
      const busy = isRequestSlotBusy(hall, date, slot);
      const active = requestSelection.slotId === slot.id;
      return `
        <button class="request-slot ${active ? "active" : ""}" type="button" data-request-slot="${escapeHtml(slot.id)}" ${busy ? "disabled" : ""}>
          <strong>${escapeHtml(requestSlotLabel(slot))}</strong>
          <span>${escapeHtml(busy ? t("requestSlotBusy") : t("requestSlotFree"))}</span>
        </button>
      `;
    })
    .join("");
  renderRequestSummary();
}

function renderRequestHalls() {
  if (!els.requestHallGrid) return;
  els.requestHallGrid.innerHTML = state.halls.length
    ? state.halls
        .map((hall) => {
          const available = hall.status === "available";
          const active = requestSelection.hallId === hall._id;
          const name = hallText(hall, "name") || "-";
          const floor = hallText(hall, "floor") || "-";
          const description = hallText(hall, "description") || hallText(hall, "location") || "-";
          return `
            <button class="request-hall-card ${active ? "active" : ""}" type="button" data-request-hall="${escapeHtml(hall._id)}" ${available ? "" : "disabled"}>
              <span>${escapeHtml(floor)}</span>
              <strong>${escapeHtml(name)}</strong>
              <p>${escapeHtml(description)}</p>
              <div>
                <small>${escapeHtml(`${hall.capacity || 0} ${t("mapPeopleShort")}`)}</small>
                <small>${escapeHtml(formatCurrency(hall.pricePerHour || 0))} / ${escapeHtml(t("hourShort"))}</small>
                <small>${escapeHtml(hall.status === "maintenance" ? t("hallStatusMaintenance") : hall.status === "busy" ? t("hallStatusBusy") : t("hallStatusAvailable"))}</small>
              </div>
            </button>
          `;
        })
        .join("")
    : `<div class="empty">${escapeHtml(t("hallsEmpty"))}</div>`;
}

function renderRequestView() {
  if (!els.requestHallGrid) return;
  const today = new Date().toISOString().slice(0, 10);
  if (els.requestDate) {
    els.requestDate.min = today;
    if (!els.requestDate.value) els.requestDate.value = requestSelection.date || today;
    requestSelection.date = els.requestDate.value;
  }
  const ownDate = els.customRequestForm?.elements.namedItem("ownDate");
  if (ownDate) {
    ownDate.min = today;
    if (!ownDate.value) ownDate.value = today;
  }
  if (!requestSelection.hallId && state.halls.length) {
    const firstAvailable = state.halls.find((hall) => hall.status === "available") || state.halls[0];
    requestSelection.hallId = firstAvailable?._id || "";
  }
  renderRequestHalls();
  renderRequestSlots();
}

function buildCustomRequestPayload() {
  const payload = Object.fromEntries(new FormData(els.customRequestForm));
  const services = selectedRequestServices();
  const user = state.profile || {};
  const duration = Number(payload.duration || 0);
  const hall = selectedRequestHall();
  const slot = selectedRequestSlot();
  const isOwnEvent = requestMode === "event";
  const date = isOwnEvent ? String(payload.ownDate || "").trim() : requestSelection.date;
  const time = isOwnEvent ? String(payload.ownTime || "").trim() : slot?.start || "";

  if (!duration || !date || !time) throw createError("errHallFieldsRequired");
  if (!isOwnEvent && (!hall || !slot)) throw createError("requestPickSlotHint");
  if (isOwnEvent && (!payload.ownLocation || !payload.ownCity)) throw createError("errHallFieldsRequired");

  return {
    type: isOwnEvent ? "custom-event" : "hall",
    status: "new",
    paymentStatus: "paid",
    paymentMethod: isOwnEvent ? "announcement-demo" : "card",
    paidAt: new Date().toISOString(),
    userId: user?._id || "",
    userName: String(payload.contactName || user?.name || state.name || "").trim(),
    userEmail: String(payload.email || user?.email || state.email || "").trim(),
    userPhone: String(payload.phone || user?.phone || "").trim(),
    organization: user?.organization || "",
    eventTitle: String(payload.eventTitle || "").trim(),
    category: String(payload.category || "").trim(),
    format: "offline",
    description: String(payload.description || "").trim(),
    purpose: String(payload.description || "").trim(),
    adminNotes: String(payload.notes || "").trim(),
    ticketPrice: Number(payload.ticketPrice || 0),
    hallId: isOwnEvent ? "" : hall._id,
    hallName: isOwnEvent ? "" : hall.name,
    location: isOwnEvent ? String(payload.ownLocation || "").trim() : hall.name,
    city: isOwnEvent ? String(payload.ownCity || "").trim() : "",
    date,
    time,
    startTime: time,
    endTime: addHoursToTime(time, duration),
    duration,
    attendees: Number(payload.attendees || 0),
    pricePerHour: isOwnEvent ? 0 : Number(hall.pricePerHour || 0),
    rentAmount: requestBaseRent(),
    services,
    amount: requestTotalAmount(),
    createdAt: new Date().toISOString(),
  };
}

function renderRequestPaymentSummary(request) {
  if (!els.requestPaymentSummary || !request) return;
  const hall = state.halls.find((item) => item._id === request.hallId);
  const hallName = hall ? hallText(hall, "name") : request.hallName;
  const isAnnouncement = request.type === "custom-event";
  const serviceText = request.services.length
    ? request.services.map((service) => `${service.name} (${formatCurrency(service.price)})`).join(", ")
    : t("requestNoServices");
  els.requestPaymentSummary.innerHTML = `
    <div><span>${escapeHtml(isAnnouncement ? "Стоимость объявления" : t("requestRentTotal"))}</span><strong>${escapeHtml(formatCurrency(request.amount))}</strong></div>
    <div><span>${escapeHtml(isAnnouncement ? t("location") : t("navHalls"))}</span><strong>${escapeHtml(isAnnouncement ? request.location : hallName)}</strong></div>
    <div><span>${escapeHtml(t("date"))}</span><strong>${escapeHtml(formatDate(request.date))}</strong></div>
    <div><span>${escapeHtml(t("time"))}</span><strong>${escapeHtml(`${request.startTime}-${request.endTime}`)}</strong></div>
    ${isAnnouncement ? `<div><span>Способ оплаты</span><strong>Имитация оплаты публикации</strong></div>` : `<div class="request-payment-services"><span>${escapeHtml(t("requestServicesTitle"))}</span><strong>${escapeHtml(serviceText)}</strong></div>`}
  `;
}

function setRequestPaymentMode(request) {
  const isAnnouncement = request?.type === "custom-event";
  els.requestAnnouncementPayment?.classList.toggle("hidden", !isAnnouncement);
  els.requestCardPaymentFields?.classList.toggle("hidden", isAnnouncement);
  els.requestCardPaymentFields?.querySelectorAll("input").forEach((input) => {
    input.required = !isAnnouncement;
    input.disabled = isAnnouncement;
  });
}

function openRequestPaymentModal(request) {
  pendingCustomRequest = request;
  renderRequestPaymentSummary(request);
  els.requestPaymentForm?.reset();
  setRequestPaymentMode(request);
  els.requestPaymentModal?.classList.remove("hidden");
}

function closeRequestPaymentModal() {
  els.requestPaymentModal?.classList.add("hidden");
  pendingCustomRequest = null;
}

async function saveCustomEventRequest(request) {
  const options = {
    method: "POST",
    body: JSON.stringify(request),
  };

  try {
    return await api("/hall-bookings", options);
  } catch (error) {
    if (request?.type === "custom-event" && ![401, 403].includes(Number(error.status || 0))) {
      state.dataMode = "local";
      updateDataModeBadge();
      const result = await localApiTranslated("/hall-bookings", options);
      return { ...result, localFallback: true };
    }
    throw error;
  }
}

function eventCard(event) {
  return window.ORDA.eventTemplates.eventCard(event, {
    t,
    escapeHtml,
    formatDate,
    dateRangeText,
    formatPrice,
    isAdmin: state.role === "admin",
    hasToken: Boolean(state.token),
  });
}

function hallCard(hall) {
  const name = hallText(hall, "name");
  const floor = hallText(hall, "floor");
  const location = hallText(hall, "location");
  const description = hallText(hall, "description");
  const features = hallList(hall, "equipment").slice(0, 4);
  const advantages = hallList(hall, "advantages").slice(0, 3);
  const image = hallImage(hall);
  return `
    <article class="hall-card">
      <div class="card-media hall-media">
        <img src="${escapeHtml(image)}" alt="${escapeHtml(name)}" loading="lazy" />
        <span>${escapeHtml(hall.status === "available" ? t("hallStatusAvailable") : hall.status === "busy" ? t("hallStatusBusy") : t("hallStatusMaintenance"))}</span>
      </div>
      <div class="event-top">
        <div>
          <h3>${escapeHtml(name)}</h3>
          <div class="hall-meta">
            <span>${escapeHtml(floor)}</span>
            <span>-</span>
            <span>${escapeHtml(location)}</span>
          </div>
        </div>
        <span class="tag">${escapeHtml(tr("hallCapacityNumber", { count: hall.capacity }))}</span>
      </div>
      <p class="event-description">${escapeHtml(description || "")}</p>
      <div class="hall-features">
        ${features.map((item) => `<span class="hall-pill">${escapeHtml(item)}</span>`).join("")}
      </div>
      ${advantages.length ? `<div class="hall-advantages">${advantages.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>` : ""}
      <div class="capacity-row">
        <span>${escapeHtml(t("hallActiveRequests"))}</span>
        <strong>${Number(hall.activeRequests || 0)}</strong>
      </div>
      <div class="capacity-row">
        <span>${escapeHtml(`${t("price")} / ${t("hourShort")}`)}</span>
        <strong>${escapeHtml(formatCurrency(hall.pricePerHour || 0))}</strong>
      </div>
      <div class="card-actions">
        <button type="button" data-book-hall="${escapeHtml(hall._id)}" ${state.token ? "" : "disabled"}>
          ${escapeHtml(t("hallBookButton"))}
        </button>
        <button class="secondary admin-action" type="button" data-view-hall="${escapeHtml(hall._id)}" title="${escapeHtml(t("details"))}">i</button>
        <button class="secondary admin-action hidden" type="button" aria-hidden="true">-</button>
        <button class="secondary admin-action hidden" type="button" aria-hidden="true">-</button>
      </div>
    </article>
  `;
}

function renderEvents() {
  els.eventsList.innerHTML = state.events.length
    ? state.events.map(eventCard).join("")
    : `<div class="empty">${escapeHtml(t("noEvents"))}</div>`;
}

function renderHalls() {
  els.hallsList.innerHTML = state.halls.length
    ? state.halls.map(hallCard).join("")
    : `<div class="empty">${escapeHtml(t("hallsEmpty"))}</div>`;
}

function renderDashboard() {
  const isAdmin = state.role === "admin";
  const seats = state.events.reduce((sum, event) => sum + Number(event.seatsLeft || 0), 0);
  const nextEvent = state.events[0];
  const myActiveBookings = state.bookings.filter((booking) => ["pending", "approved"].includes(booking.status));
  const allActiveRequests = state.adminBookings.filter((booking) => ["pending", "approved"].includes(booking.status));
  const pendingRequests = state.adminBookings.filter((booking) => booking.status === "pending");
  const hallLoad = state.halls.reduce((sum, hall) => sum + Number(hall.activeRequests || 0), 0);

  els.metricEvents.textContent = state.events.length;
  els.metricSeats.textContent = isAdmin ? hallLoad : seats;
  els.metricBookings.textContent = isAdmin ? pendingRequests.length : myActiveBookings.length;
  els.metricNext.textContent = nextEvent ? formatDate(nextEvent.date, { month: "short", day: "numeric" }) : "-";
  if (els.metricSeatsLabel) els.metricSeatsLabel.textContent = isAdmin ? t("metricHallLoad") : t("metricSeats");
  if (els.metricBookingsLabel) els.metricBookingsLabel.textContent = isAdmin ? t("metricPendingRequests") : t("metricBookings");

  if (els.heroMetricEvents) els.heroMetricEvents.textContent = state.events.length;
  if (els.heroMetricHalls) els.heroMetricHalls.textContent = state.halls.length;
  if (els.heroMetricRequests) {
    els.heroMetricRequests.textContent = isAdmin
      ? allActiveRequests.length
      : state.bookings.length + state.hallBookings.length;
  }

  els.dashboardEvents.innerHTML = state.events.slice(0, 5).length
    ? state.events
        .slice(0, 5)
        .map(
          (event) => `
      <button class="mini-item" type="button" data-details="${event._id}">
        <strong>${escapeHtml(event.title)}</strong>
        <p>${escapeHtml(dateRangeText(event))} - ${escapeHtml(event.city || event.location)}</p>
      </button>
    `
        )
        .join("")
    : `<div class="empty">${escapeHtml(t("noEvents"))}</div>`;

  els.dashboardCalendar.innerHTML = state.events.slice(0, 6).length
    ? state.events
        .slice(0, 6)
        .map(
          (event) => `
      <div class="calendar-item">
        <strong>${escapeHtml(dateRangeText(event, { weekday: "short", day: "numeric", month: "short" }))}</strong>
        <p>${escapeHtml(event.time || "")} - ${escapeHtml(event.title)}</p>
      </div>
    `
        )
        .join("")
    : `<div class="empty">${escapeHtml(t("noEvents"))}</div>`;

  if (els.dashboardHallLoad) {
    const halls = state.halls.slice(0, 6);
    els.dashboardHallLoad.innerHTML = halls.length
      ? halls
          .map((hall) => {
            const req = Number(hall.activeRequests || 0);
            const load = Math.min(100, req * 22 + (hall.status === "busy" ? 34 : hall.status === "maintenance" ? 18 : 6));
            return `
              <div class="hall-load-item">
                <div class="hall-load-head">
                  <strong>${escapeHtml(hallText(hall, "name") || "-")}</strong>
                  <span>${escapeHtml(`${req} ${t("activeRequestsShort")}`)}</span>
                </div>
                <div class="hall-load-bar"><span style="width:${load}%"></span></div>
              </div>
            `;
          })
          .join("")
      : `<div class="empty">${escapeHtml(t("hallsEmpty"))}</div>`;
  }

  const recentSource = state.role === "admin" ? state.adminBookings : [...state.bookings, ...state.hallBookings];
  const recent = recentSource
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  if (els.recentActionsList) {
    els.recentActionsList.innerHTML = recent.length
      ? recent
          .map(
            (item) => `
        <div class="mini-item">
          <strong>${escapeHtml(item.type === "hall" ? item.hallName || "-" : item.eventTitle || "-")}</strong>
          <p>${escapeHtml(statusLabel(item.status))} · ${escapeHtml(dateTimeText(item.createdAt))}</p>
        </div>
      `
          )
          .join("")
      : `<div class="empty">${escapeHtml(t("noBookings"))}</div>`;
  }

  if (els.adminNotificationsList) {
    els.adminNotificationsList.innerHTML = state.adminNotifications.length
      ? state.adminNotifications
          .map(
            (item) => `
        <div class="mini-item">
          <strong>${escapeHtml(item.text)}</strong>
          <p>${escapeHtml(item.sub || "-")}</p>
        </div>
      `
          )
          .join("")
      : `<div class="empty">${escapeHtml(t("noNotifications"))}</div>`;
  }

  if (els.adminNotificationsFeed) {
    els.adminNotificationsFeed.innerHTML = state.adminNotifications.length
      ? state.adminNotifications
          .map(
            (item) => `
        <div class="mini-item">
          <strong>${escapeHtml(item.text)}</strong>
          <p>${escapeHtml(item.sub || "-")}</p>
        </div>
      `
          )
          .join("")
      : `<div class="empty">${escapeHtml(t("noNotifications"))}</div>`;
  }

  const featured = state.events.find((event) => event.featured && event.status === "published") || state.events[0];
  const featuredBanner = document.querySelector("#featuredEventBanner");
  if (featuredBanner && featured) {
    featuredBanner.classList.remove("hidden");
    document.querySelector("#featuredTitle").textContent = featured.title;
    document.querySelector("#featuredMeta").innerHTML = `
      <span class="pill">${escapeHtml(dateRangeText(featured))}</span>
      <span class="pill">${escapeHtml(featured.city || featured.location || "")}</span>
      <span class="pill">${escapeHtml(t(categoryKeys[featured.category] || "category"))}</span>
    `;
    const diff = Math.max(0, new Date(`${featured.date}T${featured.time || "10:00"}`) - new Date());
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    document.querySelector("#cdDays").textContent = String(days).padStart(2, "0");
    document.querySelector("#cdHours").textContent = String(hours).padStart(2, "0");
    document.querySelector("#cdMins").textContent = String(mins).padStart(2, "0");
    const button = document.querySelector("#featuredBookBtn");
    if (button) button.dataset.details = featured._id;
  }
}

function syncCalendarHallFilterOptions() {
  const select = els.calendarHallFilter;
  if (!select) return;

  const current = select.value || "all";
  const options = [];
  state.events
    .map((event) => event.location)
    .filter(Boolean)
    .forEach((location) => options.push({ value: location, label: location }));
  state.halls
    .filter((hall) => hall.name)
    .forEach((hall) => options.push({ value: hall.name, label: hallText(hall, "name") || hall.name }));
  const unique = [...new Map(options.map((item) => [item.value, item])).values()].sort((a, b) =>
    String(a.label).localeCompare(String(b.label))
  );
  select.innerHTML = [
    `<option value="all">${escapeHtml(t("calendarAllHalls"))}</option>`,
    ...unique.map((item) => `<option value="${escapeHtml(item.value)}">${escapeHtml(item.label)}</option>`),
  ].join("");
  select.value = current === "all" || unique.some((item) => item.value === current) ? current : "all";
}

function calendarFilterValues() {
  return {
    search: String(els.calendarSearchInput?.value || "").trim().toLowerCase(),
    type: String(els.calendarTypeFilter?.value || "all"),
    hall: String(els.calendarHallFilter?.value || "all"),
    status: String(els.calendarStatusFilter?.value || "all"),
  };
}

function eventMatchesCalendarFilters(event, filters = calendarFilterValues()) {
  const eventStatuses = new Set(["published", "draft", "closed"]);
  if (filters.status !== "all" && (!eventStatuses.has(filters.status) || event.status !== filters.status)) return false;
  if (filters.type !== "all" && event.category !== filters.type) return false;
  if (filters.hall !== "all" && event.location !== filters.hall) return false;
  if (!filters.search) return true;
  const haystack = [event.title, event.description, event.location, event.city, event.organizer, (event.tags || []).join(" ")]
    .join(" ")
    .toLowerCase();
  return haystack.includes(filters.search);
}

function requestMatchesCalendarFilters(request, filters = calendarFilterValues()) {
  const requestStatuses = new Set(["new", "review", "pending", "approved", "rejected", "cancelled"]);
  if (filters.status !== "all" && (!requestStatuses.has(filters.status) || request.status !== filters.status)) return false;
  if (filters.type !== "all") return false;

  const linkedEvent = request.type === "event" ? state.events.find((event) => event._id === request.eventId) : null;
  const requestHall = request.hallName || linkedEvent?.location || "";
  if (filters.hall !== "all" && requestHall !== filters.hall) return false;

  if (!filters.search) return true;
  const haystack = [
    request.eventTitle,
    request.hallName,
    request.purpose,
    request.organization,
    linkedEvent?.title,
    linkedEvent?.location,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(filters.search);
}

function calendarAgendaToggleText(expanded) {
  const labels = {
    ru: { more: "Показать полностью", less: "Свернуть" },
    kk: { more: "Толық көрсету", less: "Жинау" },
    en: { more: "Show full list", less: "Collapse" },
  };
  const pack = labels[state.lang] || labels.ru;
  return expanded ? pack.less : pack.more;
}

function ensureCalendarAgendaToggle(total) {
  if (!els.calendarAgendaList) return;
  const panel = els.calendarAgendaList.closest(".calendar-agenda-panel");
  if (!panel) return;

  let button = panel.querySelector("#calendarAgendaToggle");
  if (!button) {
    button = document.createElement("button");
    button.id = "calendarAgendaToggle";
    button.className = "secondary calendar-agenda-toggle";
    button.type = "button";
    panel.appendChild(button);
  }

  if (total <= 5) calendarAgendaExpanded = false;
  panel.classList.toggle("calendar-agenda-expanded", calendarAgendaExpanded);
  button.hidden = total <= 5;
  button.textContent = calendarAgendaToggleText(calendarAgendaExpanded);
  button.setAttribute("aria-expanded", String(calendarAgendaExpanded));
  button.onclick = () => {
    calendarAgendaExpanded = !calendarAgendaExpanded;
    renderCalendar();
  };
}

function syncCalendarAgendaHeight() {
  if (!els.calendarAgendaList) return;
  const panel = els.calendarAgendaList.closest(".calendar-agenda-panel");
  const calendar = document.querySelector(".calendar-month-panel");
  if (!panel || !calendar) return;

  if (window.matchMedia("(max-width: 980px)").matches) {
    panel.style.height = "";
    els.calendarAgendaList.style.maxHeight = "";
    return;
  }

  const height = calendar.offsetHeight;
  if (height < 100) {
    panel.style.height = "";
    els.calendarAgendaList.style.maxHeight = "";
    return;
  }

  const head = panel.querySelector(".calendar-agenda-head");
  const toggle = panel.querySelector("#calendarAgendaToggle");
  const available = height - (head?.offsetHeight || 0) - (toggle && !toggle.hidden ? toggle.offsetHeight : 0) - 34;
  panel.style.height = `${height}px`;
  els.calendarAgendaList.style.maxHeight = `${Math.max(180, available)}px`;
}

function renderCalendar() {
  syncCalendarHallFilterOptions();
  const filters = calendarFilterValues();
  const events = state.events.filter((event) => eventMatchesCalendarFilters(event, filters));

  const groups = events.reduce((acc, event) => {
    const month = formatDate(event.date, { month: "long", year: "numeric" });
    if (!acc[month]) acc[month] = [];
    acc[month].push(event);
    return acc;
  }, {});

  els.calendarList.innerHTML = Object.keys(groups).length
    ? Object.entries(groups)
        .map(
          ([month, events]) => `
      <section class="calendar-day">
        <h3>${escapeHtml(month)}</h3>
        <div class="calendar-list">
          ${events
            .map(
              (event) => `
            <button class="calendar-item" type="button" data-details="${event._id}">
              <strong>${escapeHtml(dateRangeText(event, { day: "numeric", weekday: "short" }))} - ${escapeHtml(event.time || "")}</strong>
              <p>${escapeHtml(event.title)} - ${escapeHtml(event.location)}</p>
            </button>
          `
            )
            .join("")}
        </div>
      </section>
    `
        )
        .join("")
    : `<div class="empty">${escapeHtml(t("noEvents"))}</div>`;

  if (els.calendarAgendaList) {
    const visibleAgenda = calendarAgendaExpanded ? events : events.slice(0, 5);
    els.calendarAgendaList.innerHTML = visibleAgenda.length
      ? visibleAgenda
          .map(
            (event) => `
        <button class="calendar-agenda-card" type="button" data-details="${escapeHtml(event._id)}">
          ${event.image ? `<img src="${escapeHtml(event.image)}" alt="${escapeHtml(event.title)}" loading="lazy" />` : ""}
          <span>${escapeHtml(dateRangeText(event, { month: "short", day: "numeric" }))} - ${escapeHtml(event.time || "")}</span>
          <strong>${escapeHtml(event.title)}</strong>
          <p>${escapeHtml(event.location || event.city || "")}</p>
          <small class="calendar-agenda-status">${escapeHtml(t(categoryKeys[event.category] || "category"))} · ${escapeHtml(t(event.status === "draft" ? "calendarStatusPending" : event.status === "closed" ? "calendarStatusCancelled" : "calendarStatusPlanned"))}</small>
        </button>
      `
          )
          .join("")
      : `<div class="empty">${escapeHtml(t("noEvents"))}</div>`;
    ensureCalendarAgendaToggle(events.length);
    requestAnimationFrame(syncCalendarAgendaHeight);
  }
}

function buildCalendarItems() {
  const items = [];
  syncCalendarHallFilterOptions();
  const filters = calendarFilterValues();
  const sourceEvents = state.events.filter((event) => eventMatchesCalendarFilters(event, filters));

  sourceEvents.forEach((event) => {
    datesBetween(event.date, event.endDate).forEach((date, index) => {
      items.push({
        type: "event",
        id: event._id,
        date,
        time: event.time || "10:00",
        title: index > 0 ? `${event.title} · ${index + 1}` : event.title,
        location: event.location,
        hall: event.location,
        status: event.status || "published",
        statusLabel:
          event.status === "draft" ? t("calendarStatusPending") : event.status === "closed" ? t("calendarStatusCancelled") : t("calendarStatusPlanned"),
        attendees: `${Number(event.booked || 0)}/${Number(event.capacity || 0)}`,
        description: event.description || "",
      });
    });
  });

  const requestsSource = (state.role === "admin" ? state.adminBookings : [...state.bookings, ...state.hallBookings]).filter((request) =>
    requestMatchesCalendarFilters(request, filters)
  );
  requestsSource.forEach((request) => {
    const date = request.date || (request.type === "event" ? state.events.find((event) => event._id === request.eventId)?.date : "");
    const time = request.time || (request.type === "event" ? state.events.find((event) => event._id === request.eventId)?.time : "");
    if (!date) return;

    items.push({
      type: request.type,
      id: request._id,
      date,
      time: time || "",
      title:
        request.type === "event"
          ? request.eventTitle || t("requestTypeEvent")
          : request.type === "custom-event"
            ? request.eventTitle || t("requestTypeCustomEvent")
            : request.hallName || t("requestTypeHall"),
      location: request.type === "event"
        ? state.events.find((event) => event._id === request.eventId)?.location || "-"
        : request.hallName || "-",
      hall: request.hallName || state.events.find((event) => event._id === request.eventId)?.location || "-",
      status: request.status,
      statusLabel:
        request.type === "event" && request.paymentStatus === "unpaid"
          ? t("paymentUnpaid")
          : bookingStatusLabel(request.status),
      attendees: request.attendees ? String(request.attendees) : "",
      description: request.purpose || request.organization || "",
      raw: request,
    });
  });

  window.ORDA._calendarItems = items;
}

function renderAvailabilitySlots() {
  const slots = state.halls.slice(0, 6).map((hall) => ({
    hall: hallText(hall, "name") || hall.name,
    time: hall.activeRequests ? `${hall.activeRequests} ${t("activeRequestsShort")}` : t("availableToday"),
    free: Number(hall.activeRequests || 0) < 2,
  }));
  window.ORDA._availSlots = slots;
  if (typeof window.ORDA.renderAvailStrip === "function") {
    window.ORDA.renderAvailStrip(slots);
  }
}

function buildAdminNotifications() {
  const notifications = [];
  if (state.role !== "admin") {
    const userNotifications = (state.clientNotifications || []).slice(0, 12).map((item) => ({
      type: item.type || "info",
      text: notificationMessage(item),
      sub: relativeTime(item.createdAt),
    }));
    window.ORDA._notifications = userNotifications;
    state.adminNotifications = [];
    if (typeof window.ORDA.refreshHeaderNotifications === "function") {
      window.ORDA.refreshHeaderNotifications(userNotifications);
    }
    return;
  }

  state.adminBookings.slice(0, 12).forEach((request) => {
    if (request.type === "hall" && request.status === "pending") {
      notifications.push({
        type: "warn",
        text: `${t("notifNewHallRequest")}: ${request.hallName || "-"}`,
        sub: relativeTime(request.createdAt),
      });
    }

    if (request.type === "event" && request.paymentStatus === "paid") {
      notifications.push({
        type: "success",
        text: `${t("notifTicketPaid")}: ${request.eventTitle || "-"}`,
        sub: relativeTime(request.paidAt || request.createdAt),
      });
    }

    if (request.status === "pending") {
      notifications.push({
        type: "info",
        text: `${t("notifRequestPending")}: ${request.userName || "-"}`,
        sub: relativeTime(request.createdAt),
      });
    }
  });

  const nearest = state.events
    .filter((event) => event.status === "published")
    .slice(0, 3);

  nearest.forEach((event) => {
    notifications.push({
      type: "info",
      text: `${t("notifEventSoon")}: ${event.title}`,
      sub: `${formatDate(event.date)} ${event.time || ""}`.trim(),
    });
  });

  const unique = notifications.filter((item, index, arr) => arr.findIndex((value) => value.text === item.text) === index).slice(0, 12);
  state.adminNotifications = unique;
  window.ORDA._notifications = unique;
  if (typeof window.ORDA.refreshHeaderNotifications === "function") window.ORDA.refreshHeaderNotifications(unique);
}

function renderBookings() {
  const html = state.bookings.length
    ? state.bookings
        .map((booking) => {
          const canPay =
            ["pending", "approved"].includes(booking.status) &&
            Number(booking.price || 0) > 0 &&
            booking.paymentStatus === "unpaid";
          const canUseTicket = !isInactiveRequest(booking.status) && ["paid", "free"].includes(booking.paymentStatus);
          return `
      <article class="booking-row">
        <div>
          <strong>${escapeHtml(booking.eventTitle || "-")}</strong>
          <p>${escapeHtml(dateTimeText(booking.createdAt))}</p>
          ${paymentLabel(booking)
            ? `<span class="status-pill ${paymentClass(booking)}">${escapeHtml(paymentLabel(booking))}</span>`
            : ""}
        </div>
        <div class="row-actions">
          <span class="status-pill ${statusClass(booking.status)}">${escapeHtml(statusLabel(booking.status))}</span>
          ${canUseTicket
            ? `<button class="secondary" type="button" data-ticket="${booking._id}">${escapeHtml(t("ticket"))}</button>`
            : `<button class="secondary" type="button" disabled>${escapeHtml(t("ticketUnavailable"))}</button>`}
          ${canPay
            ? `<button type="button" data-pay-booking="${booking._id}">${escapeHtml(t("payNow"))}</button>`
            : ""}
          ${["pending", "approved"].includes(booking.status)
            ? `<button class="secondary" type="button" data-cancel-event="${booking._id}">${escapeHtml(t("cancel"))}</button>`
            : ""}
        </div>
      </article>
    `;
        })
        .join("")
    : `<div class="empty">${escapeHtml(t("noBookings"))}</div>`;

  if (els.myBookingsList) els.myBookingsList.innerHTML = html;
  if (els.myBookingsListFull) els.myBookingsListFull.innerHTML = html;
}

function renderHallBookings() {
  els.myHallBookingsList.innerHTML = state.hallBookings.length
    ? state.hallBookings
        .map(
          (booking) => {
            const canPay =
              ["pending", "approved"].includes(booking.status) &&
              Number(booking.amount || 0) > 0 &&
              booking.paymentStatus === "unpaid";
            const canUseTicket = !isInactiveRequest(booking.status) && ["paid", "free"].includes(booking.paymentStatus);
            return `
      <article class="booking-row">
        <div>
          <strong>${escapeHtml(booking.type === "custom-event" ? booking.eventTitle || "-" : booking.hallName || "-")}</strong>
          <p>${escapeHtml(
            tr("hallBookingSummary", {
              date: formatDate(booking.date),
              time: booking.time || "",
              duration: booking.duration || 0,
            })
          )}</p>
          ${booking.type === "custom-event" ? `<p>${escapeHtml(booking.location || "")}${booking.city ? `, ${escapeHtml(booking.city)}` : ""}</p>` : ""}
          ${paymentLabel(booking)
            ? `<span class="status-pill ${paymentClass(booking)}">${escapeHtml(paymentLabel(booking))}</span>`
            : ""}
        </div>
        <div class="row-actions">
          <span class="status-pill ${statusClass(booking.status)}">${escapeHtml(statusLabel(booking.status))}</span>
          ${canUseTicket
            ? `<button class="secondary" type="button" data-ticket="${booking._id}">${escapeHtml(t("ticket"))}</button>`
            : `<button class="secondary" type="button" disabled>${escapeHtml(t("ticketUnavailable"))}</button>`}
          ${canPay
            ? `<button type="button" data-pay-hall-booking="${booking._id}">${escapeHtml(t("payNow"))}</button>`
            : ""}
          ${["pending", "approved"].includes(booking.status)
            ? `<button class="secondary" type="button" data-cancel-hall="${booking._id}">${escapeHtml(t("cancel"))}</button>`
            : ""}
        </div>
      </article>
    `;
          }
        )
        .join("")
    : `<div class="empty">${escapeHtml(t("noHallBookings"))}</div>`;
}

function renderClientNotifications() {
  if (!els.myNotificationsList) return;
  const list = state.clientNotifications || [];
  if (!list.length) {
    els.myNotificationsList.innerHTML = `<div class="empty">${escapeHtml(t("noClientNotifications"))}</div>`;
    return;
  }

  els.myNotificationsList.innerHTML = list
    .map((item) => {
      const unread = !item.read;
      const text = notificationMessage(item);
      return `
      <article class="booking-row booking-row-detailed client-notification ${unread ? "unread" : ""}">
        <div class="booking-main">
          <strong>${escapeHtml(text)}</strong>
          ${item.reason ? `<p><b>${escapeHtml(t("notificationReason"))}:</b> ${escapeHtml(item.reason)}</p>` : ""}
          <p>${escapeHtml(dateTimeText(item.createdAt || new Date().toISOString()))}</p>
        </div>
        <div class="row-actions">
          <span class="status-pill ${unread ? "status-pill-pending" : "status-pill-approved"}">
            ${escapeHtml(unread ? t("notificationUnread") : t("notificationRead"))}
          </span>
          ${unread
            ? `<button class="secondary" type="button" data-mark-notification="${escapeHtml(item._id)}">${escapeHtml(
                t("markAsRead")
              )}</button>`
            : ""}
        </div>
      </article>
    `;
    })
    .join("");
}

function renderAdminBookings() {
  if (!els.adminBookingsList) return;

  const typeFilter = els.adminRequestTypeFilter?.value || "all";
  const statusFilter = els.adminRequestStatusFilter?.value || "all";

  const list = state.adminBookings.filter((request) => {
    if (typeFilter !== "all" && request.type !== typeFilter) return false;
    if (statusFilter !== "all" && request.status !== statusFilter) return false;
    return true;
  });

  els.adminBookingsList.innerHTML = list.length
    ? list
        .map((request) => {
          const sourceEvent = request.type === "event" ? state.events.find((event) => event._id === request.eventId) : null;
          const scheduleDate = request.date || sourceEvent?.date || "-";
          const scheduleTime = request.endTime ? `${request.time || request.startTime}-${request.endTime}` : request.time || sourceEvent?.time || "-";
          const hallLabel = request.location || request.hallName || sourceEvent?.location || "-";
          const attendees = request.attendees || sourceEvent?.booked || "-";
          const amount = request.amount ?? request.price ?? sourceEvent?.price ?? 0;
          const details =
            request.type === "hall"
              ? tr("hallRequestMeta", { attendees: request.attendees || 0, duration: request.duration || 0 })
              : request.type === "custom-event"
                ? request.description || request.purpose || "-"
                : `${sourceEvent?.organizer || request.organization || "-"}`;
          const services = Array.isArray(request.services) && request.services.length
            ? request.services.map((service) => service.name || t(service.key || service.id)).join(", ")
            : "";
          const title =
            request.type === "hall"
              ? request.hallName || "-"
              : request.type === "custom-event"
                ? request.eventTitle || "-"
                : request.eventTitle || "-";

          const payment = paymentLabel(request);

          return `
            <article class="booking-row booking-row-detailed">
              <div class="booking-main">
                <strong>${escapeHtml(title)}</strong>
                <p>${escapeHtml(requestTypeLabel(request.type))}</p>
                <div class="admin-request-meta">
                  <span><b>${escapeHtml(t("date"))}:</b> ${escapeHtml(formatDate(scheduleDate))}</span>
                  <span><b>${escapeHtml(t("time"))}:</b> ${escapeHtml(scheduleTime)}</span>
                  <span><b>${escapeHtml(t("location"))}:</b> ${escapeHtml(hallLabel)}</span>
                  ${request.city ? `<span><b>${escapeHtml(t("city"))}:</b> ${escapeHtml(request.city)}</span>` : ""}
                  ${request.duration ? `<span><b>${escapeHtml(t("hallDuration"))}:</b> ${escapeHtml(`${request.duration} ${t("hourShort")}`)}</span>` : ""}
                  <span><b>${escapeHtml(t("hallGuests"))}:</b> ${escapeHtml(String(attendees))}</span>
                  <span><b>${escapeHtml(t("price"))}:</b> ${escapeHtml(formatCurrency(amount))}</span>
                  ${request.ticketPrice !== undefined ? `<span><b>${escapeHtml(t("requestTicketPrice"))}:</b> ${escapeHtml(formatCurrency(request.ticketPrice))}</span>` : ""}
                  <span><b>${escapeHtml(t("email"))}:</b> ${escapeHtml(request.userEmail || "-")}</span>
                  <span><b>${escapeHtml(t("phone"))}:</b> ${escapeHtml(request.userPhone || "-")}</span>
                  ${request.userName ? `<span><b>${escapeHtml(t("requestContactPerson"))}:</b> ${escapeHtml(request.userName)}</span>` : ""}
                  <span><b>${escapeHtml(t("organization"))}:</b> ${escapeHtml(request.organization || "-")}</span>
                  <span><b>${escapeHtml(t("description"))}:</b> ${escapeHtml(details)}</span>
                  ${services ? `<span><b>${escapeHtml(t("requestServicesTitle"))}:</b> ${escapeHtml(services)}</span>` : ""}
                  ${request.adminNotes ? `<span><b>${escapeHtml(t("requestAdminNotes"))}:</b> ${escapeHtml(request.adminNotes)}</span>` : ""}
                  <span><b>${escapeHtml(t("status"))}:</b> ${escapeHtml(statusLabel(request.status))}</span>
                  ${request.adminReason
                    ? `<span><b>${escapeHtml(t("notificationReason"))}:</b> ${escapeHtml(request.adminReason)}</span>`
                    : ""}
                  <span><b>${escapeHtml(t("dateTime"))}:</b> ${escapeHtml(dateTimeText(request.createdAt))}</span>
                </div>
                <div class="admin-request-badges">
                  <span class="status-pill ${statusClass(request.status)}">${escapeHtml(statusLabel(request.status))}</span>
                  ${payment ? `<span class="status-pill ${paymentClass(request)}">${escapeHtml(payment)}</span>` : ""}
                </div>
              </div>
              <div class="row-actions">
                ${
                  request.type === "event" && request.status === "approved" && !request.checkedIn
                    ? `<button class="secondary" type="button" data-checkin="${request._id}">${escapeHtml(t("checkIn"))}</button>`
                    : ""
                }
                ${
                  canManageRequest(request) && request.status !== "approved"
                    ? `<button class="secondary" type="button" data-approve="${request._id}">${escapeHtml(t("approve"))}</button>`
                    : ""
                }
                ${
                  canManageRequest(request) && !["rejected", "cancelled"].includes(request.status)
                    ? `<button class="secondary" type="button" data-reject="${request._id}">${escapeHtml(t("reject"))}</button>`
                    : ""
                }
                ${
                  canManageRequest(request) && request.status !== "cancelled"
                    ? `<button class="secondary" type="button" data-cancel-request="${request._id}">${escapeHtml(
                        t("adminCancelRequest")
                      )}</button>`
                    : ""
                }
                <button class="secondary" type="button" data-edit-request="${request._id}">${escapeHtml(t("edit"))}</button>
                <button class="danger" type="button" data-delete-request="${request._id}">${escapeHtml(t("delete"))}</button>
              </div>
            </article>
          `;
        })
        .join("")
    : `<div class="empty">${escapeHtml(t("adminRequestsEmpty"))}</div>`;
}

function renderAdminSupportMessages() {
  if (!els.adminSupportList) return;

  els.adminSupportList.innerHTML = state.supportMessages.length
    ? state.supportMessages
        .map(
          (item) => `
      <article class="support-row">
        <div>
          <strong>${escapeHtml(item.userName || item.userEmail || "Клиент")}</strong>
          <p>${escapeHtml(item.userEmail || "-")} · ${escapeHtml(dateTimeText(item.createdAt))}</p>
          <p>${escapeHtml(item.text || "")}</p>
        </div>
        <div class="row-actions">
          <span class="status-pill ${item.status === "read" ? "status-pill-approved" : "status-pill-pending"}">${escapeHtml(
            supportStatusLabel(item.status)
          )}</span>
          ${
            item.status !== "read"
              ? `<button class="secondary" type="button" data-support-read="${escapeHtml(item._id)}">${escapeHtml(t("supportMarkRead"))}</button>`
              : ""
          }
          <button class="danger" type="button" data-support-delete="${escapeHtml(item._id)}">${escapeHtml(t("supportDelete"))}</button>
        </div>
      </article>
    `
        )
        .join("")
    : `<div class="empty">${escapeHtml(t("supportEmpty"))}</div>`;
}

function renderAdminHalls() {
  if (!els.adminHallsList) return;

  els.adminHallsList.innerHTML = state.halls.length
    ? state.halls
        .map(
          (hall) => `
      <article class="hall-admin-row">
        <div>
          <strong>${escapeHtml(hallText(hall, "name") || "-")}</strong>
          <p>${escapeHtml(`${hallText(hall, "floor") || "-"} - ${hallText(hall, "location") || "-"}`)}</p>
        </div>
        <div>
          <strong>${escapeHtml(tr("hallCapacityNumber", { count: hall.capacity }))}</strong>
          <p>${escapeHtml(formatCurrency(hall.pricePerHour || 0))} / ${escapeHtml(t("hourShort"))}</p>
        </div>
        <div class="row-actions">
          <button class="secondary" type="button" data-edit-hall="${escapeHtml(hall._id)}">${escapeHtml(t("edit"))}</button>
          <button class="danger" type="button" data-delete-hall="${escapeHtml(hall._id)}">${escapeHtml(t("delete"))}</button>
        </div>
      </article>
    `
        )
        .join("")
    : `<div class="empty">${escapeHtml(t("hallsEmpty"))}</div>`;
}

function renderAdminUsers() {
  if (!els.adminUsersList) return;

  els.adminUsersList.innerHTML = state.adminUsers.length
    ? state.adminUsers
        .map(
          (user) => `
      <article class="booking-row">
        <div>
          <strong>${escapeHtml(user.name || "-")}</strong>
          <p>${escapeHtml(user.email || "-")}</p>
          <p>${escapeHtml(user.organization || "-")} ${user.city ? `- ${escapeHtml(user.city)}` : ""}</p>
        </div>
        <div class="row-actions">
          <span class="status-pill ${user.role === "admin" ? "status-pill-approved" : "status-pill-pending"}">${escapeHtml(
            user.role === "admin" ? t("roleAdmin") : t("roleUser")
          )}</span>
        </div>
      </article>
    `
        )
        .join("")
    : `<div class="empty">${escapeHtml(t("noBookings"))}</div>`;
}

function renderAll() {
  buildCalendarItems();
  renderAvailabilitySlots();
  buildAdminNotifications();
  renderEvents();
  renderHalls();
  renderDashboard();
  renderRequestView();
  renderCalendar();
  renderBookings();
  renderHallBookings();
  renderClientNotifications();
  renderAdminBookings();
  renderAdminHalls();
  renderAdminUsers();
  renderAdminSupportMessages();
}

async function loadEvents() {
  const params = new URLSearchParams();
  const search = els.searchInput.value.trim();
  const category = els.categoryFilter.value;
  const format = els.formatFilter.value;

  if (search) params.set("search", search);
  if (category && category !== "all") params.set("category", category);
  if (format && format !== "all") params.set("format", format);

  els.eventsList.innerHTML = '<div class="skeleton-grid"><span></span><span></span><span></span></div>';
  state.events = await api(`/events?${params.toString()}`);
  window.ORDA._events = state.events.slice();
  if (els.eventsCount) {
    const total = state.events.length;
    els.eventsCount.textContent = tr("resultsCount", { count: total });
  }
  renderAll();
  if (typeof window.ORDA.renderCalendar === "function") window.ORDA.renderCalendar();
}

async function loadHalls() {
  const params = new URLSearchParams();
  const search = els.hallSearchInput.value.trim();
  const capacity = els.hallCapacityFilter.value;

  if (search) params.set("search", search);
  if (capacity && capacity !== "all") params.set("capacity", capacity);

  els.hallsList.innerHTML = '<div class="skeleton-grid"><span></span><span></span><span></span></div>';
  state.halls = await api(`/halls?${params.toString()}`);
  renderAll();
}

async function loadMyBookings() {
  if (!state.token) {
    state.bookings = [];
    renderAll();
    return;
  }

  els.myBookingsList.innerHTML = '<div class="skeleton-list"><span></span><span></span></div>';
  state.bookings = await api("/my-bookings");
  renderAll();
}

async function loadMyHallBookings() {
  if (!state.token) {
    state.hallBookings = [];
    renderAll();
    return;
  }

  els.myHallBookingsList.innerHTML = '<div class="skeleton-list"><span></span><span></span></div>';
  state.hallBookings = await api("/my-hall-bookings");
  renderAll();
}

async function loadMyNotifications() {
  if (!state.token) {
    state.clientNotifications = [];
    renderAll();
    return;
  }

  if (els.myNotificationsList) {
    els.myNotificationsList.innerHTML = '<div class="skeleton-list"><span></span><span></span></div>';
  }
  state.clientNotifications = await api("/my-notifications");
  renderAll();
}

async function loadSupportMessages() {
  if (state.role !== "admin") return;
  const messages = await api("/support-messages", { localFallback: false });
  state.supportMessages = Array.isArray(messages) ? messages : [];
  renderAdminSupportMessages();
}

function startSupportAutoRefresh() {
  if (supportRefreshTimer) return;
  supportRefreshTimer = window.setInterval(() => {
    if (state.role === "admin" && state.currentView === "admin") {
      loadSupportMessages().catch(() => {});
    }
  }, 30000);
}

function stopSupportAutoRefresh() {
  if (!supportRefreshTimer) return;
  window.clearInterval(supportRefreshTimer);
  supportRefreshTimer = null;
}

async function loadProfile() {
  if (!state.token) {
    showMessage(t("loginRequired"), "error");
    return;
  }

  state.profile = await api("/me");
  const fields = els.profileForm.elements;
  fields.namedItem("name").value = state.profile.name || "";
  fields.namedItem("phone").value = state.profile.phone || "";
  fields.namedItem("organization").value = state.profile.organization || "";
  fields.namedItem("city").value = state.profile.city || "";
}

async function loadAdmin() {
  if (state.role !== "admin") return;

  if (els.adminBookingsList) els.adminBookingsList.innerHTML = '<div class="skeleton-list"><span></span><span></span><span></span></div>';
  if (els.adminUsersList) els.adminUsersList.innerHTML = '<div class="skeleton-list"><span></span><span></span></div>';
  const needsStats = [
    els.adminStatEvents,
    els.adminStatBookings,
    els.adminStatUsers,
    els.adminStatCheckedIn,
    els.adminStatPaidTickets,
    els.adminStatHallApproved,
  ].some(Boolean);
  const [statsRaw, bookings, users, supportMessages] = await Promise.all([
    needsStats ? api("/stats", { localFallback: false }) : Promise.resolve({}),
    api("/bookings", { localFallback: false }),
    api("/users", { localFallback: false }).catch(() => []),
    api("/support-messages", { localFallback: false }).catch(() => []),
  ]);
  state.adminBookings = Array.isArray(bookings) ? bookings.map(normalizeAdminBooking) : [];
  state.adminUsers = Array.isArray(users) ? users : [];
  state.supportMessages = Array.isArray(supportMessages) ? supportMessages : [];

  const stats = statsRaw.data || statsRaw;
  if (els.adminStatEvents) els.adminStatEvents.textContent = stats.events ?? 0;
  if (els.adminStatBookings) els.adminStatBookings.textContent = stats.bookings ?? 0;
  if (els.adminStatUsers) els.adminStatUsers.textContent = stats.users ?? 0;
  if (els.adminStatCheckedIn) els.adminStatCheckedIn.textContent = stats.checkedIn ?? 0;
  if (els.adminStatPaidTickets) {
    els.adminStatPaidTickets.textContent = stats.paidTickets ?? 0;
  }
  if (els.adminStatHallApproved) {
    els.adminStatHallApproved.textContent = stats.approvedHallBookings ?? 0;
  }

  renderAll();
}

async function showEventDetails(eventId) {
  const event = await api(`/events/${eventId}`);
  const booked = Number(event.booked || 0);
  const seatsLeft = Number(event.seatsLeft || 0);

  els.eventDetails.innerHTML = `
    <p class="eyebrow">${escapeHtml(t(categoryKeys[event.category] || "category"))}</p>
    <h2>${escapeHtml(event.title)}</h2>
    <p class="lead">${escapeHtml(event.description || "")}</p>
    <div class="detail-grid">
      <div class="detail-box"><span>${escapeHtml(t("date"))}</span><strong>${escapeHtml(
        dateRangeText(event, { weekday: "long", year: "numeric", month: "long", day: "numeric" })
      )}</strong></div>
      <div class="detail-box"><span>${escapeHtml(t("time"))}</span><strong>${escapeHtml(event.time || "10:00")}</strong></div>
      <div class="detail-box"><span>${escapeHtml(t("location"))}</span><strong>${escapeHtml(event.location)}</strong></div>
      <div class="detail-box"><span>${escapeHtml(t("organizer"))}</span><strong>${escapeHtml(event.organizer || "ORDA")}</strong></div>
      <div class="detail-box"><span>${escapeHtml(t("allFormats"))}</span><strong>${escapeHtml(
        t(formatKeys[event.format] || "formatOffline")
      )}</strong></div>
      <div class="detail-box"><span>${escapeHtml(t("price"))}</span><strong>${escapeHtml(formatPrice(event))}</strong></div>
      <div class="detail-box"><span>${escapeHtml(t("registered"))}</span><strong>${booked}</strong></div>
      <div class="detail-box"><span>${escapeHtml(t("seatsLeft"))}</span><strong>${seatsLeft}</strong></div>
    </div>
    ${event.meetingUrl ? `<p><a href="${escapeHtml(event.meetingUrl)}" target="_blank" rel="noreferrer">${escapeHtml(t("meetingUrl"))}</a></p>` : ""}
    <h3>${escapeHtml(t("agendaTitle"))}</h3>
    <p class="event-description">${escapeHtml(event.agenda || event.description || "")}</p>
  `;

  els.eventModal.classList.remove("hidden");
}

function fillEventForm(eventId) {
  const event = state.events.find((item) => item._id === eventId);
  if (!event) return;

  const fields = els.eventForm.elements;
  els.eventFormTitle.textContent = t("editEvent");
  fields.namedItem("id").value = event._id;
  fields.namedItem("title").value = event.title || "";
  fields.namedItem("date").value = event.date || "";
  fields.namedItem("time").value = event.time || "10:00";
  fields.namedItem("category").value = event.category || "";
  fields.namedItem("status").value = event.status || "published";
  fields.namedItem("location").value = event.location || "";
  fields.namedItem("organizer").value = event.organizer || "ORDA";
  fields.namedItem("format").value = event.format || "offline";
  fields.namedItem("meetingUrl").value = event.meetingUrl || "";
  fields.namedItem("capacity").value = event.capacity || 80;
  fields.namedItem("price").value = event.price || 0;
  fields.namedItem("featured").checked = Boolean(event.featured);
  fields.namedItem("tags").value = Array.isArray(event.tags) ? event.tags.join(", ") : "";
  fields.namedItem("description").value = event.description || "";
  fields.namedItem("agenda").value = event.agenda || "";
  if (state.portal !== "admin") setPortal("admin");
  else setView("admin");
}

function resetEventForm() {
  els.eventForm.reset();
  els.eventForm.elements.namedItem("id").value = "";
  els.eventForm.elements.namedItem("time").value = "10:00";
  els.eventForm.elements.namedItem("organizer").value = "ORDA";
  els.eventForm.elements.namedItem("format").value = "offline";
  els.eventForm.elements.namedItem("meetingUrl").value = "";
  els.eventForm.elements.namedItem("capacity").value = 80;
  els.eventForm.elements.namedItem("price").value = 0;
  els.eventForm.elements.namedItem("featured").checked = false;
  els.eventForm.elements.namedItem("tags").value = "";
  els.eventForm.elements.namedItem("status").value = "published";
  els.eventFormTitle.textContent = t("newEvent");
}

function fillHallForm(hallId) {
  if (!els.hallForm) return;
  const hall = state.halls.find((item) => item._id === hallId);
  if (!hall) return;

  const fields = els.hallForm.elements;
  els.hallFormTitle.textContent = t("hallFormEditTitle");
  fields.namedItem("id").value = hall._id;
  fields.namedItem("name").value = hall.name || "";
  fields.namedItem("floor").value = hall.floor || "";
  fields.namedItem("location").value = hall.location || "";
  fields.namedItem("capacity").value = hall.capacity || 1;
  fields.namedItem("pricePerHour").value = hall.pricePerHour || 0;
  fields.namedItem("equipment").value = Array.isArray(hall.equipment) ? hall.equipment.join(", ") : "";
  fields.namedItem("status").value = hall.status || "available";
  fields.namedItem("description").value = hall.description || "";
  if (state.portal !== "admin") setPortal("admin");
  else setView("admin");
}

function resetHallForm() {
  if (!els.hallForm) return;
  els.hallForm.reset();
  const fields = els.hallForm.elements;
  fields.namedItem("id").value = "";
  fields.namedItem("capacity").value = 50;
  fields.namedItem("pricePerHour").value = 15000;
  fields.namedItem("status").value = "available";
  els.hallFormTitle.textContent = "Залы";
}

function openHallBookingModal(hallId) {
  const hall = state.halls.find((item) => item._id === hallId);
  if (!hall) return;

  els.hallBookingForm.reset();
  els.hallBookingForm.elements.namedItem("hallId").value = hall._id;
  els.hallBookingForm.elements.namedItem("duration").value = 2;
  els.hallBookingForm.elements.namedItem("attendees").value = Math.min(hall.capacity, 30);
  els.hallBookingForm.elements.namedItem("time").value = "09:00";

  els.hallBookingTitle.textContent = tr("hallBookingTitleWithName", { name: hallText(hall, "name") || hall.name });
  const baseSubtitle = tr("hallBookingSubtitle", {
    floor: hallText(hall, "floor") || hall.floor,
    location: hallText(hall, "location") || hall.location,
    capacity: hall.capacity,
  });
  const priceSubtitle = ` - ${formatCurrency(hall.pricePerHour || 0)} / ${t("hourShort")}`;
  els.hallBookingSubtitle.textContent = `${baseSubtitle}${priceSubtitle}`;

  els.hallModal.classList.remove("hidden");
}

function closeHallBookingModal() {
  els.hallModal.classList.add("hidden");
}

function openPaymentModal(eventId, bookingId = "", bookingData = null, bookingType = "event") {
  if (!els.paymentModal || !els.paymentForm) return;
  const event =
    state.events.find((item) => item._id === eventId) ||
    (bookingData
      ? {
          _id: eventId,
          title: bookingData.eventTitle || bookingData.hallName || "-",
          price: Number(bookingData.price || bookingData.amount || 0),
          currency: "KZT",
        }
      : null);
  if (!event) return;

  const amount = Number(event.price || 0);
  if (amount <= 0) return;

  els.paymentForm.reset();
  els.paymentForm.elements.namedItem("eventId").value = event._id;
  const bookingField = els.paymentForm.elements.namedItem("bookingId");
  if (bookingField) bookingField.value = bookingId || "";
  const typeField = els.paymentForm.elements.namedItem("bookingType");
  if (typeField) typeField.value = bookingType || "event";
  if (els.payLaterBtn) els.payLaterBtn.classList.toggle("hidden", Boolean(bookingId));
  const methodField = els.paymentForm.querySelector('input[name="paymentMethod"][value="card"]');
  if (methodField) methodField.checked = true;
  if (els.paymentEventTitle) els.paymentEventTitle.textContent = event.title || "-";
  if (els.paymentAmount) els.paymentAmount.textContent = formatCurrency(amount, event.currency || "KZT");
  if (els.paymentOrderStatus) els.paymentOrderStatus.textContent = t("paymentStatusAwaiting");
  setPaymentMethodUI("card");
  setPaymentProcessing(false);
  els.paymentModal.classList.remove("hidden");
}

function closePaymentModal() {
  if (!els.paymentModal) return;
  setPaymentProcessing(false);
  els.paymentModal.classList.add("hidden");
}

function openAdminRequestModal(requestId) {
  if (!els.adminRequestModal || !els.adminRequestForm) return;
  const request = state.adminBookings.find((item) => item._id === requestId);
  if (!request) return;

  const fields = els.adminRequestForm.elements;
  fields.namedItem("id").value = request._id;
  fields.namedItem("type").value = request.type;
  fields.namedItem("status").value = request.status || "pending";
  fields.namedItem("date").value = request.date || "";
  fields.namedItem("time").value = request.time || "";
  fields.namedItem("duration").value = request.duration || "";
  fields.namedItem("attendees").value = request.attendees || "";
  fields.namedItem("purpose").value = request.purpose || "";
  fields.namedItem("adminReason").value = request.adminReason || "";

  const isHall = request.type === "hall" || request.type === "custom-event";
  ["date", "time", "duration", "attendees", "purpose"].forEach((name) => {
    const field = fields.namedItem(name);
    if (!field) return;
    field.disabled = !isHall;
  });

  els.adminRequestModal.classList.remove("hidden");
}

function closeAdminRequestModal() {
  if (!els.adminRequestModal) return;
  els.adminRequestModal.classList.add("hidden");
}

function showHallDetails(hallId) {
  const hall = state.halls.find((item) => item._id === hallId);
  if (!hall) return;

  els.eventDetails.innerHTML = `
    <p class="eyebrow">${escapeHtml(t("hallDetailsEyebrow"))}</p>
    <h2>${escapeHtml(hallText(hall, "name") || "-")}</h2>
    <p class="lead">${escapeHtml(hallText(hall, "description") || "")}</p>
    <div class="detail-grid">
      <div class="detail-box"><span>${escapeHtml(t("location"))}</span><strong>${escapeHtml(hallText(hall, "location") || "-")}</strong></div>
      <div class="detail-box"><span>${escapeHtml(t("hallFloor"))}</span><strong>${escapeHtml(hallText(hall, "floor") || "-")}</strong></div>
      <div class="detail-box"><span>${escapeHtml(t("capacity"))}</span><strong>${escapeHtml(
        tr("hallCapacityNumber", { count: hall.capacity })
      )}</strong></div>
      <div class="detail-box"><span>${escapeHtml(t("hallActiveRequests"))}</span><strong>${escapeHtml(
        String(hall.activeRequests || 0)
      )}</strong></div>
      <div class="detail-box"><span>${escapeHtml(`${t("price")} / ${t("hourShort")}`)}</span><strong>${escapeHtml(
        formatCurrency(hall.pricePerHour || 0)
      )}</strong></div>
    </div>
    <h3>${escapeHtml(t("hallEquipmentTitle"))}</h3>
    <p class="event-description">${escapeHtml(hallList(hall, "equipment").join(", "))}</p>
  `;

  els.eventModal.classList.remove("hidden");
}

function openCalendarItem(item) {
  if (!item) return;
  const details = `
    <p class="eyebrow">${escapeHtml(item.type === "hall" ? t("requestTypeHall") : t("requestTypeEvent"))}</p>
    <h2>${escapeHtml(item.title || "-")}</h2>
    <p class="lead">${escapeHtml(item.description || "")}</p>
    <div class="detail-grid">
      <div class="detail-box"><span>${escapeHtml(t("date"))}</span><strong>${escapeHtml(formatDate(item.date || ""))}</strong></div>
      <div class="detail-box"><span>${escapeHtml(t("time"))}</span><strong>${escapeHtml(item.time || "-")}</strong></div>
      <div class="detail-box"><span>${escapeHtml(t("location"))}</span><strong>${escapeHtml(item.location || "-")}</strong></div>
      <div class="detail-box"><span>${escapeHtml(t("status"))}</span><strong>${escapeHtml(item.statusLabel || item.status || "-")}</strong></div>
      <div class="detail-box"><span>${escapeHtml(t("hallGuests"))}</span><strong>${escapeHtml(item.attendees || "-")}</strong></div>
    </div>
  `;
  els.eventDetails.innerHTML = details;
  els.eventModal.classList.remove("hidden");
}

window.ORDA = window.ORDA || {};
window.ORDA.openCalendarItem = openCalendarItem;
window.ORDA.openHallBooking = (hallOrId) => {
  if (!state.token) {
    showMessage(t("loginRequired"), "error");
    return;
  }
  const hallId = typeof hallOrId === "string" ? hallOrId : hallOrId?._id;
  if (hallId) openHallBookingModal(hallId);
};

function findUserRequest(requestId) {
  return [...state.bookings, ...state.hallBookings].find((item) => item._id === requestId);
}

function openTicket(requestId) {
  const request = findUserRequest(requestId);
  if (!request) return;
  if (isInactiveRequest(request.status)) {
    showMessage(t("ticketUnavailableReason"), "error");
    return;
  }

  const event =
    request.type === "event"
      ? state.events.find((item) => item._id === request.eventId) || {
          _id: request._id,
          title: request.eventTitle || "-",
          date: "-",
          time: "-",
          location: "-",
        }
      : {
          _id: request._id,
          title: request.hallName || "-",
          date: request.date || "-",
          time: request.time || "-",
          location: request.hallName || "-",
        };

  const paymentMeta = {
    method: request.paymentMethod ? paymentMethodLabel(request.paymentMethod) : "-",
    status: paymentLabel(request) || statusLabel(request.status),
    amount: Number(request.price || request.amount || 0) > 0 ? formatCurrency(request.price || request.amount || 0) : t("free"),
    time: request.refundedAt
      ? dateTimeText(request.refundedAt)
      : request.paidAt
        ? dateTimeText(request.paidAt)
        : t("paymentStatusAwaiting"),
    orderId: `ORD-${String(request._id || "").slice(-8).toUpperCase()}`,
  };

  if (window.ORDA?.showTicket) {
    window.ORDA.showTicket(event, request.userName || state.name || state.email || "-", paymentMeta);
  }
  state.currentTicketId = requestId;
}

function downloadTicket(requestId) {
  const request = findUserRequest(requestId);
  if (!request) return;

  const lines = [
    "ORDA Smart Event System",
    t("ticketLabelDocument"),
    "",
    `${t("ticketParticipant")}: ${request.userName || state.name || state.email}`,
    `${t("email")}: ${request.userEmail || state.email || "-"}`,
    `${t("ticketType")}: ${request.type === "hall" ? t("requestTypeHall") : t("requestTypeEvent")}`,
    `${t("status")}: ${statusLabel(request.status)}`,
    `${t("ticketCreated")}: ${dateTimeText(request.createdAt)}`,
  ];

  if (request.type === "event") lines.push(`${t("ticketEvent")}: ${request.eventTitle || "-"}`);
  if (request.type === "hall") {
    lines.push(`${t("ticketHall")}: ${request.hallName || "-"}`);
    lines.push(`${t("date")}: ${request.date || "-"}`);
    lines.push(`${t("time")}: ${request.time || "-"}`);
    lines.push(`${t("hallDuration")}: ${request.duration || "-"} ${t("hourShort")}`);
    lines.push(`${t("hallGuests")}: ${request.attendees || "-"}`);
    lines.push(`${t("hallPurpose")}: ${request.purpose || "-"}`);
  }

  if (Number(request.price || request.amount || 0) > 0) {
    lines.push(`${t("price")}: ${formatCurrency(request.price || request.amount || 0)}`);
    lines.push(`${t("paymentStatusLabel")}: ${paymentLabel(request) || "-"}`);
  }

  lines.push("", t("ticketFooter"));

  downloadTextFile(`orda-ticket-${request._id}.txt`, lines.join("\n"));
  showMessage(t("ticketDownloaded"));
}

function exportBookings() {
  if (!state.adminBookings.length) {
    showMessage(t("noBookings"), "error");
    return;
  }

  const header = [
    "requestType",
    "status",
    "participant",
    "email",
    "organization",
    "eventTitle",
    "hallName",
    "date",
    "time",
    "attendees",
    "amount",
    "paymentStatus",
    "checkedIn",
    "createdAt",
  ];

  const rows = state.adminBookings.map((request) => [
    request.type,
    request.status,
    request.userName,
    request.userEmail,
    request.organization,
    request.eventTitle,
    request.hallName,
    request.date,
    request.time,
    request.attendees,
    request.price || request.amount || 0,
    request.paymentStatus || "",
    request.checkedIn ? "yes" : "no",
    request.createdAt,
  ]);

  const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
  downloadTextFile("orda-requests.csv", csv, "text/csv;charset=utf-8");
  showMessage(t("exportReady"));
}

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

document.querySelectorAll(".cabinet-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    activateCabinetTab(tab.dataset.cabinet);
  });
});

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    setAuthTab(tab.dataset.auth);
  });
});

els.sidebarToggle.addEventListener("click", () => {
  const isOpen = els.sidebar.classList.toggle("open");
  if (els.sidebarBackdrop) els.sidebarBackdrop.classList.toggle("visible", isOpen);
});
els.browseBtn.addEventListener("click", () => setView("events"));
els.loginBtn?.addEventListener("click", () => openAuth("login"));
els.authCloseBtn?.addEventListener("click", closeAuth);
els.authSection?.addEventListener("click", (event) => {
  if (event.target === els.authSection) closeAuth();
});
els.themeToggle.addEventListener("click", () => window.ORDA?.theme?.toggle(els.themeToggle));
window.addEventListener("resize", syncCalendarAgendaHeight);

els.portalClientBtn?.addEventListener("click", () => {
  setPortal("client");
  setView("dashboard");
});
els.portalAdminBtn?.addEventListener("click", () => {
  setPortal("admin");
  setView("admin");
});

els.sidebarBackdrop?.addEventListener("click", () => {
  els.sidebar.classList.remove("open");
  els.sidebarBackdrop.classList.remove("visible");
});

document.querySelectorAll("[data-jump-events]").forEach((button) => {
  button.addEventListener("click", () => setView("events"));
});

document.querySelectorAll("[data-view-link]").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.viewLink));
});

document.querySelectorAll("[data-request-mode]").forEach((button) => {
  button.addEventListener("click", () => setRequestMode(button.dataset.requestMode));
});

els.requestHallGrid?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-request-hall]");
  if (!button || button.disabled) return;
  requestSelection.hallId = button.dataset.requestHall;
  requestSelection.slotId = "";
  renderRequestView();
});

els.requestDate?.addEventListener("change", () => {
  requestSelection.date = els.requestDate.value;
  requestSelection.slotId = "";
  renderRequestSlots();
});

els.requestSlotGrid?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-request-slot]");
  if (!button || button.disabled) return;
  requestSelection.slotId = button.dataset.requestSlot;
  renderRequestSlots();
});

els.customRequestForm?.addEventListener("change", (event) => {
  if (event.target?.name === "services" || event.target?.name === "duration") {
    renderRequestSummary();
    updateRequestTotals();
  }
});

els.customRequestForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!state.token) {
    showMessage(t("loginRequired"), "error");
    return;
  }
  if (!els.customRequestForm.reportValidity()) return;
  try {
    openRequestPaymentModal(buildCustomRequestPayload());
  } catch (error) {
    showMessage(error.message, "error");
  }
});

els.closeRequestPaymentModal?.addEventListener("click", closeRequestPaymentModal);
els.cancelRequestPayment?.addEventListener("click", closeRequestPaymentModal);
els.requestPaymentModal?.addEventListener("click", (event) => {
  if (event.target === els.requestPaymentModal) closeRequestPaymentModal();
});

els.requestPaymentForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!pendingCustomRequest || !els.requestPaymentForm.reportValidity()) return;
  try {
    Array.from(els.requestPaymentForm.elements).forEach((field) => (field.disabled = true));
    els.requestPaymentProcessText?.classList.remove("hidden");
    await new Promise((resolve) => setTimeout(resolve, 650));
    const result = await saveCustomEventRequest(pendingCustomRequest);
    closeRequestPaymentModal();
    els.customRequestForm.reset();
    requestSelection.slotId = "";
    renderRequestView();
    if (result.localFallback) {
      state.hallBookings = await localApiTranslated("/my-hall-bookings");
      renderAll();
    } else {
      await Promise.all([loadMyHallBookings(), state.role === "admin" ? loadAdmin() : Promise.resolve()]);
    }
    showMessage(responseMessage(result) || t("requestSubmitSuccess"));
  } catch (error) {
    showMessage(error.message, "error");
  } finally {
    els.requestPaymentProcessText?.classList.add("hidden");
    Array.from(els.requestPaymentForm.elements).forEach((field) => (field.disabled = false));
  }
});

els.languageSelect.addEventListener("change", () => {
  state.lang = els.languageSelect.value;
  localStorage.setItem(STORAGE_KEYS.lang, state.lang);
  applyTranslations();
});

els.loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const payload = Object.fromEntries(new FormData(els.loginForm));
    setFormLoading(els.loginForm, true);
    const result = await api("/login", { method: "POST", body: JSON.stringify(payload) });
    saveSession(result);
    state.portal = result.role === "admin" ? "admin" : "client";
    updateShell();
    showMessage(responseMessage(result));
    await Promise.all([loadEvents(), loadHalls()]);

    if (result.role === "admin") {
      await loadAdmin();
      startSupportAutoRefresh();
      state.portal = "admin";
      applyPortalVisibility();
      setView("admin");
      return;
    }

    await Promise.all([loadMyBookings(), loadMyHallBookings(), loadMyNotifications(), loadProfile()]);
    state.portal = "client";
    applyPortalVisibility();
    setView("profile");
  } catch (error) {
    showMessage(error.message, "error");
  } finally {
    setFormLoading(els.loginForm, false);
  }
});

els.registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const payload = Object.fromEntries(new FormData(els.registerForm));
    setFormLoading(els.registerForm, true);
    const result = await api("/register", { method: "POST", body: JSON.stringify(payload) });
    els.registerForm.reset();
    showMessage(responseMessage(result));
  } catch (error) {
    showMessage(error.message, "error");
  } finally {
    setFormLoading(els.registerForm, false);
  }
});

els.logoutBtn.addEventListener("click", () => {
  clearSession();
  stopSupportAutoRefresh();
  state.portal = "client";
  updateShell();
  setView("dashboard");
  state.bookings = [];
  state.hallBookings = [];
  state.clientNotifications = [];
  state.adminUsers = [];
  state.adminBookings = [];
  state.currentTicketId = "";
  renderAll();
  showMessage(t("sessionLogout"));
});

els.seedBtn.addEventListener("click", async () => {
  try {
    showMessage(t("dataRefreshed"));
    await Promise.all([loadEvents(), loadHalls(), loadMyBookings(), loadMyHallBookings(), loadMyNotifications()]);
    if (state.role === "admin") await loadAdmin();
  } catch (error) {
    showMessage(error.message, "error");
  }
});

els.searchInput.addEventListener("input", () => {
  clearTimeout(els.searchInput.timer);
  els.searchInput.timer = setTimeout(() => loadEvents().catch((error) => showMessage(error.message, "error")), 240);
});

els.homeSearchBtn.addEventListener("click", () => {
  els.searchInput.value = els.homeSearchInput.value.trim();
  saveControlValue("searchInput");
  setView("events");
  loadEvents().catch((error) => showMessage(error.message, "error"));
});

els.homeSearchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") els.homeSearchBtn.click();
});

document.querySelectorAll("[data-home-category]").forEach((button) => {
  button.addEventListener("click", () => {
    els.categoryFilter.value = button.dataset.homeCategory;
    saveControlValue("categoryFilter");
    setView("events");
    loadEvents().catch((error) => showMessage(error.message, "error"));
  });
});

els.categoryFilter.addEventListener("change", () => loadEvents().catch((error) => showMessage(error.message, "error")));
els.formatFilter.addEventListener("change", () => loadEvents().catch((error) => showMessage(error.message, "error")));

els.hallSearchInput.addEventListener("input", () => {
  clearTimeout(els.hallSearchInput.timer);
  els.hallSearchInput.timer = setTimeout(() => loadHalls().catch((error) => showMessage(error.message, "error")), 240);
});

els.hallCapacityFilter.addEventListener("change", () => loadHalls().catch((error) => showMessage(error.message, "error")));
function refreshCalendarView() {
  buildCalendarItems();
  renderCalendar();
  if (typeof window.ORDA.renderCalendar === "function") window.ORDA.renderCalendar();
}

els.calendarSearchInput?.addEventListener("input", () => {
  clearTimeout(els.calendarSearchInput.timer);
  els.calendarSearchInput.timer = setTimeout(() => {
    refreshCalendarView();
  }, 180);
});
els.calendarStatusFilter?.addEventListener("change", () => {
  refreshCalendarView();
});
els.calendarTypeFilter?.addEventListener("change", () => {
  refreshCalendarView();
});
els.calendarHallFilter?.addEventListener("change", () => {
  refreshCalendarView();
});
els.adminRequestTypeFilter?.addEventListener("change", renderAdminBookings);
els.adminRequestStatusFilter?.addEventListener("change", renderAdminBookings);

document.body.addEventListener("click", async (event) => {
  const detailsBtn = event.target.closest("[data-details]");
  const hallViewBtn = event.target.closest("[data-view-hall]");
  const bookBtn = event.target.closest("[data-book]");
  const hallBookBtn = event.target.closest("[data-book-hall]");
  const editBtn = event.target.closest("[data-edit]");
  const deleteBtn = event.target.closest("[data-delete]");
  const editHallBtn = event.target.closest("[data-edit-hall]");
  const deleteHallBtn = event.target.closest("[data-delete-hall]");
  const editRequestBtn = event.target.closest("[data-edit-request]");
  const deleteRequestBtn = event.target.closest("[data-delete-request]");
  const cancelEventBtn = event.target.closest("[data-cancel-event]");
  const cancelHallBtn = event.target.closest("[data-cancel-hall]");
  const payBookingBtn = event.target.closest("[data-pay-booking]");
  const payHallBookingBtn = event.target.closest("[data-pay-hall-booking]");
  const ticketBtn = event.target.closest("[data-ticket]");
  const checkInBtn = event.target.closest("[data-checkin]");
  const approveBtn = event.target.closest("[data-approve]");
  const rejectBtn = event.target.closest("[data-reject]");
  const cancelRequestBtn = event.target.closest("[data-cancel-request]");
  const markNotificationBtn = event.target.closest("[data-mark-notification]");
  const supportReadBtn = event.target.closest("[data-support-read]");
  const supportDeleteBtn = event.target.closest("[data-support-delete]");

  try {
    if (detailsBtn) {
      await showEventDetails(detailsBtn.dataset.details);
      return;
    }

    if (hallViewBtn) {
      showHallDetails(hallViewBtn.dataset.viewHall);
      return;
    }

    if (bookBtn) {
      if (!state.token) {
        showMessage(t("loginRequired"), "error");
        return;
      }
      const eventItem = state.events.find((item) => item._id === bookBtn.dataset.book);
      if (!eventItem) {
        showMessage(t("errEventNotFound"), "error");
        return;
      }
      if (Number(eventItem.price || 0) > 0) {
        openPaymentModal(eventItem._id);
        return;
      }
      const result = await api("/book", { method: "POST", body: JSON.stringify({ eventId: eventItem._id }) });
      showMessage(responseMessage(result));
      await Promise.all([loadEvents(), loadMyBookings()]);
      if (state.role === "admin") await loadAdmin();
      return;
    }

    if (hallBookBtn) {
      if (!state.token) {
        showMessage(t("loginRequired"), "error");
        return;
      }
      openHallBookingModal(hallBookBtn.dataset.bookHall);
      return;
    }

    if (editBtn) {
      fillEventForm(editBtn.dataset.edit);
      return;
    }

    if (deleteBtn) {
      const result = await api(`/events/${deleteBtn.dataset.delete}`, { method: "DELETE" });
      showMessage(responseMessage(result));
      await Promise.all([loadEvents(), loadHalls()]);
      await loadAdmin();
      return;
    }

    if (editHallBtn) {
      fillHallForm(editHallBtn.dataset.editHall);
      return;
    }

    if (deleteHallBtn) {
      const result = await api(`/halls/${deleteHallBtn.dataset.deleteHall}`, { method: "DELETE" });
      showMessage(responseMessage(result));
      await Promise.all([loadHalls(), loadEvents()]);
      await loadAdmin();
      return;
    }

    if (editRequestBtn) {
      openAdminRequestModal(editRequestBtn.dataset.editRequest);
      return;
    }

    if (deleteRequestBtn) {
      const result = await adminBookingApi(deleteRequestBtn.dataset.deleteRequest, "", { method: "DELETE" });
      showMessage(responseMessage(result));
      await Promise.all([loadEvents(), loadHalls(), loadMyBookings(), loadMyHallBookings(), loadMyNotifications()]);
      await loadAdmin();
      return;
    }

    if (cancelEventBtn) {
      const result = await api(`/my-bookings/${cancelEventBtn.dataset.cancelEvent}`, { method: "DELETE" });
      showMessage(responseMessage(result));
      await Promise.all([loadEvents(), loadMyBookings()]);
      if (state.role === "admin") await loadAdmin();
      return;
    }

    if (cancelHallBtn) {
      const result = await api(`/my-hall-bookings/${cancelHallBtn.dataset.cancelHall}`, { method: "DELETE" });
      showMessage(responseMessage(result));
      await Promise.all([loadHalls(), loadMyHallBookings()]);
      if (state.role === "admin") await loadAdmin();
      return;
    }

    if (payBookingBtn) {
      const booking = state.bookings.find((item) => item._id === payBookingBtn.dataset.payBooking);
      if (!booking) {
        showMessage(t("errRequestNotFound"), "error");
        return;
      }
      openPaymentModal(booking.eventId, booking._id, booking);
      return;
    }

    if (payHallBookingBtn) {
      const booking = state.hallBookings.find((item) => item._id === payHallBookingBtn.dataset.payHallBooking);
      if (!booking) {
        showMessage(t("errRequestNotFound"), "error");
        return;
      }
      openPaymentModal("", booking._id, booking, "hall");
      return;
    }

    if (ticketBtn) {
      openTicket(ticketBtn.dataset.ticket);
      return;
    }

    if (checkInBtn) {
      const result = await adminBookingApi(checkInBtn.dataset.checkin, "/check-in", { method: "PATCH" });
      showMessage(responseMessage(result));
      await loadAdmin();
      return;
    }

    if (approveBtn) {
      const result = await updateAdminBookingStatus(approveBtn.dataset.approve, { status: "approved" });
      showMessage(responseMessage(result));
      await Promise.all([loadEvents(), loadHalls(), loadMyBookings(), loadMyHallBookings(), loadMyNotifications()]);
      await loadAdmin();
      return;
    }

    if (rejectBtn) {
      const reasonRaw = window.prompt(t("adminRejectReasonPrompt"), "");
      if (reasonRaw === null) return;
      const result = await updateAdminBookingStatus(rejectBtn.dataset.reject, {
        status: "rejected",
        reason: String(reasonRaw || "").trim(),
      });
      showMessage(responseMessage(result));
      await Promise.all([loadEvents(), loadHalls(), loadMyBookings(), loadMyHallBookings(), loadMyNotifications()]);
      await loadAdmin();
      return;
    }

    if (cancelRequestBtn) {
      const reasonRaw = window.prompt(t("adminCancelReasonPrompt"), "");
      if (reasonRaw === null) return;
      const result = await updateAdminBookingStatus(cancelRequestBtn.dataset.cancelRequest, {
        status: "cancelled",
        reason: String(reasonRaw || "").trim(),
      });
      showMessage(responseMessage(result));
      await Promise.all([loadEvents(), loadHalls(), loadMyBookings(), loadMyHallBookings(), loadMyNotifications()]);
      await loadAdmin();
      return;
    }

    if (markNotificationBtn) {
      const result = await api(`/my-notifications/${markNotificationBtn.dataset.markNotification}/read`, {
        method: "PATCH",
      });
      showMessage(responseMessage(result));
      await loadMyNotifications();
      return;
    }

    if (supportReadBtn) {
      setButtonLoading(supportReadBtn);
      try {
        const result = await api(`/support-messages/${supportReadBtn.dataset.supportRead}/read`, {
          method: "PATCH",
          localFallback: false,
        });
        await loadSupportMessages();
        showMessage(responseMessage(result) || t("supportMarkedRead"));
      } finally {
        setButtonLoading(supportReadBtn, false);
      }
      return;
    }

    if (supportDeleteBtn) {
      if (!window.confirm(t("supportDeleteConfirm"))) return;
      setButtonLoading(supportDeleteBtn);
      try {
        const result = await api(`/support-messages/${supportDeleteBtn.dataset.supportDelete}`, {
          method: "DELETE",
          localFallback: false,
        });
        state.supportMessages = state.supportMessages.filter((item) => item._id !== supportDeleteBtn.dataset.supportDelete);
        renderAdminSupportMessages();
        await loadSupportMessages();
        showMessage(responseMessage(result) || t("supportDeleted"));
      } finally {
        setButtonLoading(supportDeleteBtn, false);
      }
      return;
    }
  } catch (error) {
    showMessage(error.message, "error");
  }
});

els.profileForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const payload = Object.fromEntries(new FormData(els.profileForm));
    setFormLoading(els.profileForm, true);
    const result = await api("/me", {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    state.name = result.user.name;
    state.profile = result.user;
    localStorage.setItem("name", state.name);

    updateShell();
    showMessage(responseMessage(result));
  } catch (error) {
    showMessage(error.message, "error");
  } finally {
    setFormLoading(els.profileForm, false);
  }
});

els.supportForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.token) {
    showMessage(t("loginRequired"), "error");
    return;
  }

  const message = String(els.supportMessageText?.value || "").trim();
  if (!message) {
    showMessage(t("supportMessageRequired"), "error");
    return;
  }

  try {
    setFormLoading(els.supportForm, true);
    const result = await api("/support-messages", {
      method: "POST",
      body: JSON.stringify({ message }),
      localFallback: false,
    });
    els.supportForm.reset();
    if (state.role === "admin") await loadSupportMessages();
    showMessage(responseMessage(result) || t("supportSent"));
  } catch (error) {
    showMessage(error.message, "error");
  } finally {
    setFormLoading(els.supportForm, false);
  }
});

els.eventForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = Object.fromEntries(new FormData(els.eventForm));
  const id = formData.id;
  delete formData.id;

  try {
    setFormLoading(els.eventForm, true);
    const result = await api(id ? `/events/${id}` : "/events", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(formData),
    });
    resetEventForm();
    showMessage(responseMessage(result));
    await Promise.all([loadEvents(), loadHalls()]);
    await loadAdmin();
  } catch (error) {
    showMessage(error.message, "error");
  } finally {
    setFormLoading(els.eventForm, false);
  }
});

if (els.hallForm) {
  els.hallForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(els.hallForm));
    const id = formData.id;
    delete formData.id;

    try {
      setFormLoading(els.hallForm, true);
      const result = await api(id ? `/halls/${id}` : "/halls", {
        method: id ? "PUT" : "POST",
        body: JSON.stringify(formData),
      });
      resetHallForm();
      showMessage(responseMessage(result));
      await Promise.all([loadHalls(), loadEvents()]);
      await loadAdmin();
    } catch (error) {
      showMessage(error.message, "error");
    } finally {
      setFormLoading(els.hallForm, false);
    }
  });
}

els.hallBookingForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const payload = Object.fromEntries(new FormData(els.hallBookingForm));
    setFormLoading(els.hallBookingForm, true);
    const hall = state.halls.find((item) => item._id === payload.hallId);
    const duration = Number(payload.duration || 0);
    const pricePerHour = Number(hall?.pricePerHour || 0);
    payload.hallName = hall?.name || "";
    payload.pricePerHour = pricePerHour;
    payload.amount = pricePerHour * duration;
    payload.paymentStatus = payload.amount > 0 ? "unpaid" : "free";
    const result = await api("/hall-bookings", {
      method: "POST",
      body: JSON.stringify(payload),
      localFallback: false,
    });

    closeHallBookingModal();
    showMessage(responseMessage(result));
    await Promise.all([loadHalls(), loadMyHallBookings()]);
    if (state.role === "admin") await loadAdmin();
  } catch (error) {
    showMessage(error.message, "error");
  } finally {
    setFormLoading(els.hallBookingForm, false);
  }
});

els.resetEventForm.addEventListener("click", resetEventForm);
els.resetHallForm?.addEventListener("click", resetHallForm);
els.exportBookingsBtn?.addEventListener("click", exportBookings);
els.closeModal.addEventListener("click", () => els.eventModal.classList.add("hidden"));

els.eventModal.addEventListener("click", (event) => {
  if (event.target === els.eventModal) els.eventModal.classList.add("hidden");
});

els.closeHallModal.addEventListener("click", closeHallBookingModal);
els.cancelHallBooking.addEventListener("click", closeHallBookingModal);
els.hallModal.addEventListener("click", (event) => {
  if (event.target === els.hallModal) closeHallBookingModal();
});

els.closeTicketModal?.addEventListener("click", () => els.ticketModal?.classList.add("hidden"));
els.ticketModal?.addEventListener("click", (event) => {
  if (event.target === els.ticketModal) els.ticketModal.classList.add("hidden");
});
els.downloadTicketBtn?.addEventListener("click", () => {
  if (state.currentTicketId) downloadTicket(state.currentTicketId);
});

els.closePaymentModal?.addEventListener("click", closePaymentModal);
els.cancelPayment?.addEventListener("click", closePaymentModal);
els.paymentModal?.addEventListener("click", (event) => {
  if (event.target === els.paymentModal) closePaymentModal();
});
document.querySelectorAll('input[name="paymentMethod"]').forEach((input) => {
  input.addEventListener("change", () => setPaymentMethodUI(input.value));
});
els.payLaterBtn?.addEventListener("click", async () => {
  const payload = Object.fromEntries(new FormData(els.paymentForm));
  const eventId = String(payload.eventId || "");
  const bookingId = String(payload.bookingId || "");
  const paymentMethod = selectedPaymentMethod();
  if (bookingId) return;

  try {
    setPaymentProcessing(true);
    if (els.paymentOrderStatus) els.paymentOrderStatus.textContent = t("paymentStatusProcessing");
    await new Promise((resolve) => setTimeout(resolve, 900));
    const result = await api("/book", {
      method: "POST",
      body: JSON.stringify({
        eventId,
        paymentStatus: "unpaid",
        paymentMethod,
      }),
    });
    closePaymentModal();
    showMessage(responseMessage(result));
    await Promise.all([loadEvents(), loadMyBookings()]);
    if (state.role === "admin") await loadAdmin();
  } catch (error) {
    showMessage(error.message, "error");
  } finally {
    setPaymentProcessing(false);
  }
});
els.paymentForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(els.paymentForm));
  const eventId = String(payload.eventId || "");
  const bookingId = String(payload.bookingId || "");
  const bookingType = String(payload.bookingType || "event");
  const paymentMethod = selectedPaymentMethod();

  try {
    setPaymentProcessing(true);
    if (els.paymentOrderStatus) els.paymentOrderStatus.textContent = t("paymentStatusProcessing");
    await new Promise((resolve) => setTimeout(resolve, 1200 + Math.floor(Math.random() * 900)));

    const result = bookingId
      ? await api(
          bookingType === "hall" ? `/my-hall-bookings/${bookingId}` : `/my-bookings/${bookingId}`,
          {
            method: "PATCH",
            body: JSON.stringify({ paymentMethod }),
          }
        )
      : await api("/book", {
          method: "POST",
          body: JSON.stringify({
            eventId,
            paymentStatus: "paid",
            paymentMethod,
          }),
        });

    if (els.paymentOrderStatus) els.paymentOrderStatus.textContent = t("paymentStatusPaid");
    showMessage(responseMessage(result));
    await Promise.all([loadEvents(), loadMyBookings(), loadMyHallBookings()]);
    if (state.role === "admin") await loadAdmin();
    closePaymentModal();

    const ticketId = result?.booking?._id || bookingId;
    if (ticketId) openTicket(ticketId);
  } catch (error) {
    showMessage(error.message, "error");
  } finally {
    setPaymentProcessing(false);
  }
});

els.closeAdminRequestModal?.addEventListener("click", closeAdminRequestModal);
els.cancelAdminRequestEdit?.addEventListener("click", closeAdminRequestModal);
els.adminRequestModal?.addEventListener("click", (event) => {
  if (event.target === els.adminRequestModal) closeAdminRequestModal();
});
els.adminRequestForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(els.adminRequestForm));
  const requestId = String(payload.id || "");
  delete payload.id;
  delete payload.type;
  payload.reason = String(payload.adminReason || "").trim();
  delete payload.adminReason;

  if (!requestId) return;

  try {
    setFormLoading(els.adminRequestForm, true);
    const result = await adminBookingApi(requestId, "", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    closeAdminRequestModal();
    showMessage(responseMessage(result));
    await Promise.all([loadEvents(), loadHalls(), loadMyBookings(), loadMyHallBookings(), loadMyNotifications()]);
    await loadAdmin();
  } catch (error) {
    showMessage(error.message, "error");
  } finally {
    setFormLoading(els.adminRequestForm, false);
  }
});

function bootstrap() {
  ensureSessionValidity();
  window.ORDA._events = [];
  window.ORDA.lang = state.lang;

  const savedPortal = localStorage.getItem(STORAGE_KEYS.portal);
  const savedView = localStorage.getItem(STORAGE_KEYS.currentView);
  state.portal = state.role === "admin" && (savedPortal === "admin" || savedPortal === "client") ? savedPortal : "client";
  state.currentView = savedView || homeViewForRole();

  applyTheme();
  applyTranslations();
  restoreControlValues();
  restoreCabinetTab();
  resetEventForm();
  resetHallForm();
  setRequestMode("hall");

  Promise.all([loadEvents(), loadHalls(), loadMyBookings(), loadMyHallBookings(), loadMyNotifications()])
    .then(async () => {
      if (state.role === "admin") {
        await loadAdmin();
        startSupportAutoRefresh();
      }

      if (state.role !== "admin") state.portal = "client";
      applyPortalVisibility();
      setView(state.currentView || homeViewForRole());
      renderDashboard();
    })
    .catch((error) => {
      state.events = [];
      state.halls = [];
      state.bookings = [];
      state.hallBookings = [];
      state.clientNotifications = [];
      state.adminBookings = [];
      state.adminUsers = [];
      renderAll();
      showMessage(error.message, "error");
    });
}

bindPersistentControls();
bootstrap();
