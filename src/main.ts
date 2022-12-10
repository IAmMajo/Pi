import "@fontsource/roboto/latin-500.css";
import "@fontsource/roboto/400.css";
import "./theme/theme.css";
import "@material/web/button/outlined-button";
import "@loadingio/css-spinner/entries/ring/index.css";
import "./style.css";

const decimalPlaces = document.getElementById("decimal-places")!;
const worker = new Worker(new URL("worker.ts", import.meta.url), {
  type: "module",
});
worker.addEventListener("message", (event: MessageEvent<string>) => {
  const span = document.createElement("span");
  span.innerText = event.data;
  decimalPlaces.append(span);
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
