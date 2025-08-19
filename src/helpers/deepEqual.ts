//eslint-disable-next-line @typescript-eslint/no-explicit-any -- need loose type for comparison
export function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;

  if (
    typeof a !== "object" ||
    typeof b !== "object" ||
    a == null ||
    b == null
  ) {
    return false;
  }

  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;

  for (const key of aKeys) {
    if (!deepEqual(a[key], b[key])) return false;
  }

  return true;
}
