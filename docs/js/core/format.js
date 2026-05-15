(function initFormat(window) {
  const ORDA = window.ORDA || {};

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function localeFor(lang) {
    if (lang === "kk") return "kk-KZ";
    if (lang === "en") return "en-US";
    return "ru-RU";
  }

  function date(value, lang, options = {}) {
    if (!value) return "-";
    return new Date(`${value}T00:00:00`).toLocaleDateString(localeFor(lang), options);
  }

  function price(event, lang, freeLabel) {
    const value = Number(event.price || 0);
    if (!value) return freeLabel;
    return `${value.toLocaleString(localeFor(lang))} ${event.currency || "KZT"}`;
  }

  ORDA.format = {
    escapeHtml,
    localeFor,
    date,
    price,
  };

  window.ORDA = ORDA;
})(window);
