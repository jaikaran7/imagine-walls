export const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("iw-theme");
    var theme = stored === "light" || stored === "dark" ? stored : null;
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
    }
  } catch (e) {}
})();
`;
