export function honeypotFilled(form: FormData, fields: string[]) {
  return fields.some((field) => String(form.get(field) ?? "").trim().length > 0);
}
