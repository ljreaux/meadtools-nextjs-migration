export const isValidNumber = (value: string) => {
  return value === "" || /^-?\d*\.?\d*$/.test(value);
};
