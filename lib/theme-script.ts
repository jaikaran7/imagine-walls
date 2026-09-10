export const themeInitScript = `
(function () {
  try {
    localStorage.setItem("iw-theme", "dark");
  } catch (e) {}
  document.documentElement.setAttribute("data-theme", "dark");
})();
`;
