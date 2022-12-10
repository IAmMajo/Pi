import "@fontsource/roboto/latin-500.css";
import "@fontsource/roboto/400.css";
import "./theme/theme.css";
import "@material/web/button/outlined-button";
import "@loadingio/css-spinner/entries/ring/index.css";
import "./style.css";
import { ExactNumber, sqrt } from "exactnumber";

const decimalPlaces = document.getElementById("decimal-places")!;
let k = 0n;
let result = ExactNumber(0);
let precision = 14;

chudnovsky();

function chudnovsky() {
  result = result.add(
    ExactNumber(
      (-1n) ** k * factorial(6n * k) * (545_140_134n * k + 13_591_409n),
      factorial(3n * k) * factorial(k) ** 3n * 640_320n ** (3n * k)
    )
  );
  const pi = ExactNumber(426880)
    .mul(sqrt(10005, precision))
    .div(result)
    .toPrecision(precision);
  for (let i = precision - 14; i < precision; i++) {
    if (i < 2) {
      continue;
    }
    const span = document.createElement("span");
    span.innerText = pi.charAt(i);
    decimalPlaces.append(span);
  }
  k++;
  precision += 14;
  setTimeout(chudnovsky);
}

function factorial(number: bigint) {
  let factorial = 1n;
  for (let i = 2n; i <= number; i++) {
    factorial *= i;
  }
  return factorial;
}
