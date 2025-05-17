export function truncateText(text: string, maxLength: number = Infinity) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength);
}
