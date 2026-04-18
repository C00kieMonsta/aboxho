import "./style.css";
import { mountSkeleton } from "./skeleton";

const canvas = document.getElementById("skeleton") as HTMLCanvasElement | null;
const label = document.getElementById("skeleton-label");

if (canvas && label) {
  mountSkeleton(canvas, label);
}
