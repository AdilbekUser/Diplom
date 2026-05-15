(function initTheme(window) {
  const ORDA = window.ORDA || {};

  function getTheme() {
    return localStorage.getItem("theme") || "light";
  }

  function apply(toggleButton) {
    const theme = getTheme();
    document.documentElement.dataset.theme = theme;

    if (toggleButton) {
      toggleButton.textContent = theme === "dark" ? "Light" : "Dark";
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
