import "@fontsource/roboto/400.css";
import "@fontsource/roboto/latin-500.css";
import "@loadingio/css-spinner/entries/ring/index.css";
import "@material/web/button/outlined-link-button";
import { MdTextButton } from "@material/web/button/text-button";
import "./style.css";
import "./theme/theme.css";

const worker = new Worker(new URL("worker.ts", import.meta.url), {
  type: "module",
});
const decimalPlaces = document.getElementById("decimal-places")!;
let number = 1;
worker.addEventListener("message", (event: MessageEvent<string>) => {
  const button = document.createElement("md-text-button");
  button.label = event.data;
  button.dataset.number = number.toLocaleString("de");
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
decimalPlaces.addEventListener("click", (event) => {
  const { target } = event;
  if (!(target instanceof MdTextButton)) {
    return;
  }
  document.getElementById("info")?.remove();
  const info = document.createElement("p");
  info.id = "info";
  info.classList.add("inverse-surface", "inverse-on-surface-text");
  info.textContent = `Nachkommastelle ${target.dataset.number} von Pi`;
  document.body.appendChild(info);
  setTimeout(() => info.remove(), 3000);
});
