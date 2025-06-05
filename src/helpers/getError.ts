import { isError } from "./isError";

export function getError(
  error: unknown,
  defaultMessage: string = "unknown error",
): Error {
  return isError(error) ? error : new Error(defaultMessage);
}
