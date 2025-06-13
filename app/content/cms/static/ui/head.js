const qs = Object.fromEntries(
  Array.from(new URLSearchParams(window.location.search).entries()).map(
    ([key, val]) => [key, decodeURIComponent(val)],
  ),
);
