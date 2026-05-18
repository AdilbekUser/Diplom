(function configureOrda(window) {
  const localHosts = new Set(["localhost", "127.0.0.1", "::1"]);
  const isLocal = localHosts.has(window.location.hostname);
  const staticDevPorts = new Set(["5500", "5501", "5173", "5174", "8080"]);
  const localApiBase = staticDevPorts.has(window.location.port) ? "http://127.0.0.1:3000" : window.location.origin;

  window.ORDA_CONFIG = {
    API_BASE_URL: isLocal ? localApiBase : "https://diplom-backend-1udt.onrender.com",
    USE_LOCAL_FALLBACK: true,
  };
})(window);
