(function initEventTemplates(window) {
  const ORDA = window.ORDA || {};

  function eventCard(event, ctx) {
    const { t, escapeHtml, formatDate, dateRangeText, formatPrice, isAdmin, hasToken } = ctx;
    const { categoryKeys, statusKeys, formatKeys } = ORDA.domain;
    const { booked, seatsLeft, percent, isFull } = ORDA.domain.capacity(event);
    const canBook = hasToken && event.status === "published" && !event.isBookedByMe && !isFull;
    const isOnline = ORDA.domain.isOnline(event);
    const isPaid = Number(event.price || 0) > 0;
    const actionLabel = event.isBookedByMe ? t("booked") : isFull ? t("full") : isPaid ? t("ticket") : t("book");

    return `
      <article class="event-card">
        ${event.image ? `
        <div class="card-media event-media">
          <img src="${escapeHtml(event.image)}" alt="${escapeHtml(event.title)}" loading="lazy" />
          <span>${escapeHtml(event.city || event.location || "")}</span>
        </div>
        ` : ""}
        <div class="event-top">
          <div>
            <h3>${escapeHtml(event.title)}</h3>
            <div class="event-meta">
              <span class="pill">${escapeHtml(
                dateRangeText ? dateRangeText(event, { month: "short", day: "numeric", year: "numeric" }) : formatDate(event.date, { month: "short", day: "numeric", year: "numeric" })
              )}</span>
              <span class="pill">${escapeHtml(event.time || "10:00")}</span>
              <span class="pill">${escapeHtml(event.location)}</span>
            </div>
          </div>
          <span class="tag ${event.status !== "published" ? `status-${event.status}` : ""}">
            ${escapeHtml(t(statusKeys[event.status] || "statusPublished"))}
          </span>
        </div>
        <div class="feature-strip">
          <span class="tag">${escapeHtml(t(categoryKeys[event.category] || "category"))}</span>
          <span class="tag">${escapeHtml(t(formatKeys[event.format] || "formatOffline"))}</span>
          <span class="tag">${escapeHtml(formatPrice(event))}</span>
          ${event.featured ? `<span class="tag">${escapeHtml(t("featured"))}</span>` : ""}
        </div>
        <p class="event-description">${escapeHtml(event.description || "")}</p>
        <div>
          <div class="capacity-row">
            <span>${booked} ${escapeHtml(t("registered"))}</span>
            <strong>${seatsLeft} ${escapeHtml(t("seatsLeft"))}</strong>
          </div>
          <div class="progress"><span style="width:${percent}%"></span></div>
        </div>
        <div class="card-actions">
          <button type="button" data-book="${event._id}" ${canBook ? "" : "disabled"}>
            ${escapeHtml(actionLabel)}
          </button>
          <button class="secondary admin-action" type="button" data-details="${event._id}" title="${escapeHtml(t("details"))}">i</button>
          <button class="secondary admin-action ${isAdmin ? "" : "hidden"}" type="button" data-edit="${event._id}" title="${escapeHtml(t("edit"))}">E</button>
          <button class="danger admin-action ${isAdmin ? "" : "hidden"}" type="button" data-delete="${event._id}" title="${escapeHtml(t("delete"))}">x</button>
        </div>
        ${isOnline && event.meetingUrl ? `<a class="secondary" href="${escapeHtml(event.meetingUrl)}" target="_blank" rel="noreferrer">${escapeHtml(t("onlineEvent"))}</a>` : ""}
      </article>
    `;
  }

  ORDA.eventTemplates = {
    eventCard,
  };

  window.ORDA = ORDA;
})(window);
