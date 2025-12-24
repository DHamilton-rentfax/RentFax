export function renderTemplate(
  template: string,
  variables: Record<string, string>
) {
  let output = template;
  for (const [key, value] of Object.entries(variables)) {
    output = output.replaceAll(`{{${key}}}`, value);
  }
  return output;
}