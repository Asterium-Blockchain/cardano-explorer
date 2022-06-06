export const slotToDate = (s: number) => {
  return new Date(1596491091 + (s - 4924800));
};
export const dateToSlot = (d: Date) => {
  return Math.floor(d.valueOf() / 1000 - 1596491091 + 4924800);
};
