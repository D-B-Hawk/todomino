export function getFormData(form: EventTarget & HTMLFormElement) {
  const formData = new FormData(form);
  return Object.fromEntries(formData.entries());
}
