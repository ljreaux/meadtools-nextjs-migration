export type blendingArr = [value: number, volume: number][];

export function blendValues(arr: blendingArr) {
  const { numerator, denominator } = arr.reduce(
    (acc, [val, vol]) => ({
      numerator: acc.numerator + (vol > 0 ? val * vol : 0),
      denominator: acc.denominator + vol,
    }),
    { numerator: 0, denominator: 0 }
  );

  return {
    blendedValue: denominator ? numerator / denominator : 0, // Avoid division by zero
    totalVolume: denominator,
  };
}
