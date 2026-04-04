export function trackEvent(name, properties = {}) {
  if (typeof window === "undefined") return;

  if (typeof window.gtag === "function") {
    window.gtag("event", name, properties);
  }

  if (typeof window.clarity === "function") {
    window.clarity("event", name);
  }

  const payload = JSON.stringify({
    name,
    properties,
    path: window.location.pathname
  });

  try {
    if (typeof navigator.sendBeacon === "function") {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/analytics", blob);
      return;
    }
  } catch {
    // Fall back to fetch below.
  }

  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true
  }).catch(() => {
    // Analytics should never block UX.
  });
}
