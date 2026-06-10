window.htmx && (window.htmx.config.allowEval = !1);
const qs = Object.fromEntries(
  Array.from(new URLSearchParams(window.location.search).entries()).map(
    ([e, t]) => [e, decodeURIComponent(t)],
  ),
);
