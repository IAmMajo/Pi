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
const bodyClasses = body.classList;
const colorScheme = document.querySelector<HTMLMetaElement>(
  'meta[name="color-scheme"]'
)!;
const defaultModeClasses = document.querySelector(
  `#mode md-list-item-icon`
)!.classList;
if (mode) {
  bodyClasses.add(mode);
  colorScheme.content = mode;
  defaultModeClasses.add("hidden");
  document
    .querySelector(`#mode [data-value="${mode}"] md-list-item-icon`)!
    .classList.remove("hidden");
}
const implementation = localStorage.getItem("implementation");
const defaultImplementationClasses = document.querySelector(
  `#implementation md-list-item-icon`
)!.classList;
if (implementation) {
  defaultImplementationClasses.add("hidden");
  document
    .querySelector(
      `#implementation [data-value="${implementation}"] md-list-item-icon`
    )!
    .classList.remove("hidden");
}
let worker = createWorker();
const headerClasses = document.querySelector("header")!.classList;
document.addEventListener("scroll", () => {
  if (window.scrollY > 0) {
    headerClasses.add("elevated");
    return;
  }
  headerClasses.remove("elevated");
});
const decimalPlaces = document.getElementById("decimal-places")!;
document
  .querySelectorAll<MdMenuItem>("#implementation md-menu-item")
  .forEach((item) =>
    item.addEventListener("click", () => {
      const oldImplementation = localStorage.getItem("implementation");
      if (oldImplementation) {
        document
          .querySelector(
            `#implementation [data-value="${oldImplementation}"] ` +
              "md-list-item-icon"
          )!
          .classList.add("hidden");
      }
      const newImplementation = item.dataset.value;
      if (newImplementation) {
        localStorage.setItem("implementation", newImplementation);
        defaultImplementationClasses.add("hidden");
        document
          .querySelector(
            `#implementation [data-value="${newImplementation}"] ` +
              "md-list-item-icon"
          )!
          .classList.remove("hidden");
      } else {
        localStorage.removeItem("implementation");
        defaultImplementationClasses.remove("hidden");
      }
      worker.terminate();
      const error = document.querySelector(".error-text");
      if (error) {
        const spinner = document.createElement("div");
        spinner.classList.add("lds-ring", "primary-text");
        const div = document.createElement("div");
        spinner.append(div, div.cloneNode(), div.cloneNode(), div.cloneNode());
        error.replaceWith(spinner);
      }
      decimalPlaces.replaceChildren();
      worker = createWorker();
    })
  );
document.querySelectorAll<MdMenuItem>("#mode md-menu-item").forEach((item) =>
  item.addEventListener("click", () => {
    const oldMode = localStorage.getItem("mode");
    if (oldMode) {
      bodyClasses.remove(oldMode);
      document
        .querySelector(`#mode [data-value="${oldMode}"] md-list-item-icon`)!
        .classList.add("hidden");
    }
    const newMode = item.dataset.value;
    if (!newMode) {
      localStorage.removeItem("mode");
      colorScheme.content = "light dark";
      defaultModeClasses.remove("hidden");
      return;
    }
    localStorage.setItem("mode", newMode);
    bodyClasses.add(newMode);
    colorScheme.content = newMode;
    defaultModeClasses.add("hidden");
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

function createWorker() {
  let newWorker = null;
  switch (localStorage.getItem("implementation")) {
    case "optimised-faculty-calculation":
      newWorker = new Worker(
        new URL(
          "implementations/optimised-faculty-calculation.worker.ts",
          import.meta.url
        ),
        {
          type: "module",
        }
      );
      break;
    default:
      newWorker = new Worker(
        new URL("implementations/unoptimised.worker.ts", import.meta.url),
        {
          type: "module",
        }
      );
  }
  const start = performance.now();
  let number = 1;
  newWorker.addEventListener("message", (event: MessageEvent<string>) => {
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
  newWorker.addEventListener("error", () => {
    const error = document.createElement("p");
    error.classList.add("error-text");
    error.textContent =
      "Ihr Browser kann mit der aktuell zur Berechnung von Pi verwendeten " +
      "Methode keine weiteren Nachkommastellen berechnen. Benutzen Sie " +
      "einen Chromium-basierten Browser (beispielsweise die " +
      "Nicht-iOS-Versionen von Chrome, Edge oder Opera), um am meisten " +
      "Nachkommastellen berechnen zu können.";
    document.querySelector(".lds-ring")!.replaceWith(error);
  });
  return newWorker;
}
