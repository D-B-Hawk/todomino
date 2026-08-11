export function updateOrRemoveFromObject<T extends object>(
  obj: T,
  key: keyof T,
  value: T[keyof T],
) {
  const copyOfObj = { ...obj };
  if (copyOfObj[key]) {
    delete copyOfObj[key];
  } else {
    copyOfObj[key] = value;
  }
  return copyOfObj;
}
