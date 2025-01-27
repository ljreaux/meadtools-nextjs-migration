export const isValidNumber = (value: string) => {
  return value === "" || /^-?\d*[.,٫]?\d*$/.test(value);
};
export const parseNumber = (value: string | number): number => {
  let val: string | number = value;
  if (typeof val === "number") val = val.toString();

  if (!val) return NaN;

  // Replace any of the supported decimal separators with `.`
  const normalizedValue = val.replace(/[٫,]/g, ".");

  // Parse the normalized string into a float and return
  return parseFloat(normalizedValue);
};
