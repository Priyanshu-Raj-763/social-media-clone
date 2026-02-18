export function applyTheme(mode) {
    document.documentElement.classList.toggle("dark", mode === "dark");
  }
  