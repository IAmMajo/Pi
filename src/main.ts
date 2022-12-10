import "@fontsource/roboto/latin-500.css";
import "@fontsource/roboto/400.css";
import "./theme/theme.css";
import "@material/web/button/outlined-button";
import "@loadingio/css-spinner/entries/ring/index.css";
import "./style.css";

const decimalPlaces = document.getElementById("decimal-places")!;
new Worker(new URL("worker.ts", import.meta.url), {
  type: "module",
}).addEventListener("message", (event: MessageEvent<string>) => {
  const span = document.createElement("span");
  span.innerText = event.data;
  decimalPlaces.append(span);
});
