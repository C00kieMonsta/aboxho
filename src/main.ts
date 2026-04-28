import "./style.css";
import { mountSkeleton } from "./skeleton";
import { mountThemeToggle } from "./theme";

const canvas = document.getElementById("skeleton") as HTMLCanvasElement | null;
const label = document.getElementById("skeleton-label");
if (canvas && label) {
  mountSkeleton(canvas, label);
}

const toggle = document.getElementById("theme-toggle") as HTMLButtonElement | null;
if (toggle) {
  mountThemeToggle(toggle);
}
