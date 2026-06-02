(function initTheme(window) {
  const ORDA = window.ORDA || {};

  function getTheme() {
    return localStorage.getItem("theme") || "light";
  }

  function apply(toggleButton) {
    const theme = getTheme();
    document.documentElement.dataset.theme = theme;

    if (toggleButton) {
      const label = theme === "dark" ? "Light" : "Dark";
      toggleButton.setAttribute("aria-label", label);
      toggleButton.setAttribute("title", label);
      if (!toggleButton.querySelector("svg")) {
        toggleButton.textContent = label;
      }
    }
  }

  function toggle(toggleButton) {
    const nextTheme = getTheme() === "dark" ? "light" : "dark";
    localStorage.setItem("theme", nextTheme);
    apply(toggleButton);
  }

  ORDA.theme = {
    apply,
    toggle,
  };

  window.ORDA = ORDA;
})(window);
