export function isEqualExcludingKeys<T extends object>(
  a: T,
  b: T,
  exclude: (keyof T)[],
): boolean {
  return Object.keys(a).every((key) => {
    if (exclude.includes(key as keyof T)) return true;
    return a[key as keyof T] === b[key as keyof T];
  });
}
