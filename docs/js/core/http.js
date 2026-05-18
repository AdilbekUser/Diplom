(function initHttp(window) {
  const ORDA = window.ORDA || {};

  async function request(url, options = {}) {
    const getToken = ORDA.getToken || (() => null);
    const getErrorMessage = ORDA.getErrorMessage || ((response, data) => data.message || "Request failed");
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };
    const token = getToken();

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, { ...options, headers });
    const raw = await response.text();
    let data = {};

    if (raw) {
      try {
        data = JSON.parse(raw);
      } catch (parseError) {
        const error = new Error("Unexpected response from server.");
        if (!response.ok) error.status = response.status;
        error.responseStatus = response.status;
        error.data = { preview: raw.slice(0, 200) };
        throw error;
      }
    }

    if (!response.ok) {
      const error = new Error(getErrorMessage(response, data));
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  ORDA.http = {
    request,
  };

  window.ORDA = ORDA;
})(window);
