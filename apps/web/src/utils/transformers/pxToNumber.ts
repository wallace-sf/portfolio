export const pxToNumber = (pxValue: string) => {
  return parseInt(pxValue.replace('px', ''), 10);
};
