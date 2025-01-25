export const isValidNumber = (value: string) => {
  return value === "" || /^-?\d*[.,٫]?\d*$/.test(value);
};
export const parseNumber = (value: string): number => {
  if (!value) return NaN;

  // Replace any of the supported decimal separators with `.`
  const normalizedValue = value.replace(/[٫,]/g, ".");

  // Parse the normalized string into a float and return
  return parseFloat(normalizedValue);
};
