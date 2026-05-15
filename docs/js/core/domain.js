(function initDomain(window) {
  const ORDA = window.ORDA || {};

  const categoryKeys = {
    conference: "catConference",
    forum: "catForum",
    meetup: "catMeetup",
    seminar: "catSeminar",
    briefing: "catBriefing",
  };

  const statusKeys = {
    published: "statusPublished",
    draft: "statusDraft",
    closed: "statusClosed",
  };

  const formatKeys = {
    offline: "formatOffline",
    online: "formatOnline",
    hybrid: "formatHybrid",
  };

  function capacity(event) {
    const booked = Number(event.booked || 0);
    const total = Number(event.capacity || 0);
    const seatsLeft = Number(event.seatsLeft || 0);
    const percent = total ? Math.min(Math.round((booked / total) * 100), 100) : 0;

    return {
      booked,
      total,
      seatsLeft,
      percent,
      isFull: seatsLeft <= 0,
    };
  }

  function isOnline(event) {
    return event.format === "online" || event.format === "hybrid";
  }

  ORDA.domain = {
    categoryKeys,
    statusKeys,
    formatKeys,
    capacity,
    isOnline,
  };

  window.ORDA = ORDA;
})(window);
