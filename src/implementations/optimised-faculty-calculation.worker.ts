import { ExactNumber, sqrt } from "exactnumber";

let k = 0n;
let a = 1n;
let b = 1n;
let c = 1n;
let result = ExactNumber(0);
let precision = 14;
while (true) {
  result = result.add(
    ExactNumber(
      (-1n) ** k * a * (545_140_134n * k + 13_591_409n),
      b * c ** 3n * 640_320n ** (3n * k)
    )
  );
  const decimalPlaces = ExactNumber(426880)
    .mul(sqrt(10005, precision + 5))
    .div(result)
    .toPrecision(precision)
    .substring(Math.max(2, precision - 13));
  for (const decimalPlace of decimalPlaces) {
    postMessage(decimalPlace);
  }
  k++;
  const aNumber = 6n * k;
  for (let i = aNumber - 5n; i <= aNumber; i++) {
    a *= i;
  }
  const bNumber = 3n * k;
  for (let i = bNumber - 2n; i <= bNumber; i++) {
    b *= i;
  }
  c *= k;
  precision += 14;
}
