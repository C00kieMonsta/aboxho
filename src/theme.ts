type Theme = "auto" | "light" | "dark";

const STORAGE_KEY = "theme";
const ORDER: Theme[] = ["auto", "light", "dark"];

function read(): Theme {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "light" || v === "dark") return v;
  } catch {}
  return "auto";
}

function apply(theme: Theme) {
  const root = document.documentElement;
  if (theme === "auto") {
    root.removeAttribute("data-theme");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  } else {
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {}
  }
}

export function mountThemeToggle(button: HTMLButtonElement): void {
  let current = read();
  const render = () => {
    button.textContent = current;
    button.setAttribute("aria-pressed", String(current !== "auto"));
  };

  apply(current);
  render();

  button.addEventListener("click", () => {
    const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];
    current = next;
    apply(current);
    render();
  });
}
