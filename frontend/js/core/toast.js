(function initToast(window) {
  const ORDA = window.ORDA || {};

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function show(text, type = "success") {
    const container = document.querySelector("#toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type === "error" ? "toast-error" : "toast-success"}`;
    toast.innerHTML = `<strong>${type === "error" ? "Error" : "ORDA"}</strong><span>${escapeHtml(text)}</span>`;
    container.appendChild(toast);

    window.setTimeout(() => toast.classList.add("leaving"), 3600);
    window.setTimeout(() => toast.remove(), 4200);
  }

  ORDA.toast = {
    show,
  };

  window.ORDA = ORDA;
})(window);
