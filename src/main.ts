import "@fontsource/roboto/400.css";
import "@fontsource/roboto/latin-500.css";
import "@loadingio/css-spinner/entries/ring/index.css";
import { MdTextButton } from "@material/web/button/text-button";
import "@material/web/iconbutton/standard-link-icon-button";
import 'material-symbols/outlined.css';
import "./style.css";
import "./theme/theme.css";

const worker = new Worker(new URL("worker.ts", import.meta.url), {
  type: "module",
});
const start = performance.now();
const decimalPlaces = document.getElementById("decimal-places")!;
let number = 1;
worker.addEventListener("message", (event: MessageEvent<string>) => {
  const button = document.createElement("md-text-button");
  button.label = event.data;
  const seconds = (performance.now() - start) / 1000;
  const displayedSeconds = seconds % 60;
  const minutes = Math.trunc(seconds / 60);
  let time = displayedSeconds.toLocaleString("de");
  let unit = "Sekunden";
  if (minutes) {
    if (displayedSeconds < 10) {
      time = `0${time}`;
    }
    const displayedMinutes = minutes % 60;
    time = `${displayedMinutes}:${time}`;
    unit = "Minuten";
    const hours = Math.trunc(minutes / 60);
    if (hours) {
      if (displayedMinutes < 10) {
        time = `0${time}`;
      }
      time = `${hours}:${time}`;
      unit = "Stunden";
    }
  }
  button.dataset.message = `Nachkommastelle ${number.toLocaleString(
    "de"
  )} – generiert in ${time} ${unit}`;
  decimalPlaces.appendChild(button);
  number++;
});
worker.addEventListener("error", () => {
  const message = document.createElement("p");
  message.classList.add("error-text");
  message.textContent =
    "Ihr Browser kann mit der aktuell zur Berechnung von Pi verwendeten " +
    "Methode keine weiteren Nachkommastellen berechnen. Benutzen Sie einen " +
    "Chromium-basierten Browser (beispielsweise die Nicht-iOS-Versionen von " +
    "Chrome, Edge oder Opera), um am meisten Nachkommastellen berechnen zu " +
    "können.";
  document.querySelector(".lds-ring")!.replaceWith(message);
});
const headerClasses = document.querySelector("header")!.classList;
document.addEventListener("scroll", () => {
  if (window.scrollY > 0) {
    headerClasses.add("elevated");
    return;
  }
  headerClasses.remove("elevated");
})
decimalPlaces.addEventListener("click", (event) => {
  const { target } = event;
  if (!(target instanceof MdTextButton)) {
    return;
  }
  document.getElementById("info")?.remove();
  const info = document.createElement("p");
  info.id = "info";
  info.classList.add("inverse-surface", "inverse-on-surface-text");
  info.textContent = target.dataset.message!;
  document.body.appendChild(info);
  setTimeout(() => info.remove(), 3000);
});
