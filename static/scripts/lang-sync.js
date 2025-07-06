(function () {
  const savedLang = localStorage.getItem("language");
  if (savedLang) {
    document.cookie = "lang=" + savedLang + "; path=/; max-age=31536000";
    document.documentElement.setAttribute("lang", savedLang);
  }

  // Clean up refresh parameter from URL if present
  if (globalThis.location.search.includes("refresh=true")) {
    const url = new URL(globalThis.location.href);
    url.searchParams.delete("refresh");
    globalThis.history.replaceState({}, "", url.toString());
  }
})();
