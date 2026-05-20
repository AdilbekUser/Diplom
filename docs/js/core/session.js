(function initSession(window) {
  const ORDA = window.ORDA || {};

  function storedValue(key) {
    const value = localStorage.getItem(key);
    if (!value || value === "undefined" || value === "null") return null;
    return value;
  }

  function read() {
    return {
      token: storedValue("token"),
      email: storedValue("email"),
      name: storedValue("name"),
      role: storedValue("role"),
    };
  }

  function save(data, state) {
    state.token = data.token;
    state.email = data.email;
    state.name = data.name;
    state.role = data.role;

    if (data.token) localStorage.setItem("token", data.token);
    if (data.email) localStorage.setItem("email", data.email);
    if (data.name) localStorage.setItem("name", data.name);
    if (data.role) localStorage.setItem("role", data.role);
  }

  function clear(state) {
    state.token = null;
    state.email = null;
    state.name = null;
    state.role = null;
    state.profile = null;
    state.bookings = [];

    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
  }

  ORDA.session = {
    read,
    save,
    clear,
  };

  window.ORDA = ORDA;
})(window);
