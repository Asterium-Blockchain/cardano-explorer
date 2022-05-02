export function toADA(lovelace: string) {
  return (parseInt(lovelace, 10) / 1000000).toString();
}
