export function systemAlertTemplate(data: any) {
  return `
    <h2>System Alert</h2>
    <p>${data.message}</p>
  `;
}
