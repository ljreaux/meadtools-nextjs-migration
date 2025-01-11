export type blendingArr = [value: string, volume: string][];

export function blendValues(arr: blendingArr) {
  const { numerator, denominator } = arr.reduce(
    (acc, [val, vol]) => {
      const value = parseFloat(val);
      const volume = parseFloat(vol);
      return {
        numerator: acc.numerator + (volume > 0 ? value * volume : 0),
        denominator: acc.denominator + volume,
      };
    },
    { numerator: 0, denominator: 0 }
  );

  return {
    blendedValue: denominator ? numerator / denominator : 0, // Avoid division by zero
    totalVolume: denominator,
  };
}
