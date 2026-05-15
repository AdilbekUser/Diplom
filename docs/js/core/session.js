(function initSession(window) {
  const ORDA = window.ORDA || {};

  function read() {
    return {
      token: localStorage.getItem("token"),
      email: localStorage.getItem("email"),
      name: localStorage.getItem("name"),
      role: localStorage.getItem("role"),
    };
  }

  function save(data, state) {
    state.token = data.token;
    state.email = data.email;
    state.name = data.name;
    state.role = data.role;

    localStorage.setItem("token", data.token);
    localStorage.setItem("email", data.email);
    localStorage.setItem("name", data.name);
    localStorage.setItem("role", data.role);
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
