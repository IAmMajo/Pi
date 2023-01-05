import "@fontsource/roboto/400.css";
import "@fontsource/roboto/latin-500.css";
import "@loadingio/css-spinner/entries/ring/index.css";
import "@material/web/button/text-button";
import { MdTextButton } from "@material/web/button/text-button";
import "@material/web/iconbutton/standard-icon-button";
import "@material/web/iconbutton/standard-link-icon-button";
import "@material/web/list/list-item-icon";
import "@material/web/menu/menu";
import "@material/web/menu/menu-button";
import "@material/web/menu/menu-item";
import { MdMenuItem } from "@material/web/menu/menu-item";
import "material-symbols/outlined.css";
import "./style.css";
import "./theme/theme.css";

const body = document.body;
const mode = localStorage.getItem("mode");
const bodyClassList = body.classList;
const colorScheme = document.querySelector<HTMLMetaElement>(
  'meta[name="color-scheme"]'
)!;
const defaultModeClassList = document.querySelector(
  `#mode md-list-item-icon`
)!.classList;
if (mode) {
  bodyClassList.add(mode);
  colorScheme.content = mode;
  defaultModeClassList.add("hidden");
  document
    .querySelector(`#mode [data-value="${mode}"] md-list-item-icon`)!
    .classList.remove("hidden");
}
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
});
document.querySelectorAll<MdMenuItem>("#mode md-menu-item").forEach((item) =>
  item.addEventListener("click", () => {
    const oldMode = localStorage.getItem("mode");
    if (oldMode) {
      bodyClassList.remove(oldMode);
      document
        .querySelector(`#mode [data-value="${oldMode}"] md-list-item-icon`)!
        .classList.add("hidden");
    }
    const newMode = item.dataset.value;
    if (!newMode) {
      localStorage.removeItem("mode");
      colorScheme.content = "light dark";
      defaultModeClassList.remove("hidden");
      return;
    }
    localStorage.setItem("mode", newMode);
    bodyClassList.add(newMode);
    colorScheme.content = newMode;
    defaultModeClassList.add("hidden");
    document
      .querySelector(`#mode [data-value="${newMode}"] md-list-item-icon`)!
      .classList.remove("hidden");
  })
);
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
  body.appendChild(info);
  setTimeout(() => info.remove(), 3000);
});

addEventListener("load", () => {
  document.querySelectorAll("md-list-item-icon").forEach((icon) => {
    const style = document.createElement("style");
    style.textContent =
      '.md3-list-item__icon { font-family: "Material Symbols Outlined" ' +
      "!important; }";
    icon.shadowRoot!.append(style);
  });
  document.querySelectorAll("md-menu").forEach((menu) => {
    const style = document.createElement("style");
    style.textContent =
      ".md3-menu-surface { width: 280px !important; overflow: hidden " +
      "!important; border-radius: 4px !important; }";
    menu
      .shadowRoot!.querySelector("md-menu-surface")!
      .shadowRoot!.append(style);
  });
});
