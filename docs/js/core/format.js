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

  const kkMonths = {
    long: ["қаңтар", "ақпан", "наурыз", "сәуір", "мамыр", "маусым", "шілде", "тамыз", "қыркүйек", "қазан", "қараша", "желтоқсан"],
    short: ["қаң.", "ақп.", "нау.", "сәу.", "мам.", "мау.", "шіл.", "там.", "қыр.", "қаз.", "қар.", "жел."],
  };

  const kkWeekdays = {
    long: ["жексенбі", "дүйсенбі", "сейсенбі", "сәрсенбі", "бейсенбі", "жұма", "сенбі"],
    short: ["жс", "дс", "сс", "сәр", "бс", "жм", "сб"],
  };

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function yearText(date, style) {
    const year = date.getFullYear();
    return style === "2-digit" ? pad(year % 100) : String(year);
  }

  function kkDate(dateValue, options = {}) {
    const optionKeys = Object.keys(options || {});
    if (!optionKeys.length) {
      return `${pad(dateValue.getDate())}.${pad(dateValue.getMonth() + 1)}.${dateValue.getFullYear()}`;
    }

    const day = options.day ? (options.day === "2-digit" ? pad(dateValue.getDate()) : String(dateValue.getDate())) : "";
    const year = options.year ? yearText(dateValue, options.year) : "";
    const weekday = options.weekday
      ? kkWeekdays[options.weekday === "long" ? "long" : "short"][dateValue.getDay()]
      : "";

    let month = "";
    if (options.month === "numeric") month = String(dateValue.getMonth() + 1);
    if (options.month === "2-digit") month = pad(dateValue.getMonth() + 1);
    if (options.month === "short") month = kkMonths.short[dateValue.getMonth()];
    if (options.month === "long") month = kkMonths.long[dateValue.getMonth()];

    let main = "";
    if (options.month === "numeric" || options.month === "2-digit") {
      main = (day ? [day, month, year] : [month, year]).filter(Boolean).join(".");
    } else if (day || month || year) {
      main = [day, month, year].filter(Boolean).join(" ");
    }

    if (weekday && main) return `${weekday}, ${main}`;
    return weekday || main || `${pad(dateValue.getDate())}.${pad(dateValue.getMonth() + 1)}.${dateValue.getFullYear()}`;
  }

  function date(value, lang, options = {}) {
    if (!value) return "-";
    const dateValue = new Date(`${value}T00:00:00`);
    if (Number.isNaN(dateValue.getTime())) return "-";
    if (lang === "kk") return kkDate(dateValue, options);
    return dateValue.toLocaleDateString(localeFor(lang), options);
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
