import { ExactNumber, sqrt } from "exactnumber";

let k = 0n;
let result = ExactNumber(0);
let precision = 14;
while (true) {
  result = result.add(
    ExactNumber(
      (-1n) ** k * factorial(6n * k) * (545_140_134n * k + 13_591_409n),
      factorial(3n * k) * factorial(k) ** 3n * 640_320n ** (3n * k)
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
  precision += 14;
}

function factorial(number: bigint) {
  let factorial = 1n;
  for (let i = 2n; i <= number; i++) {
    factorial *= i;
  }
  return factorial;
}
