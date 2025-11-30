export function assignVariant(test: string, userId: string) {
  const hash = Array.from(userId).reduce((a, c) => a + c.charCodeAt(0), 0);
  return hash % 2 === 0 ? "A" : "B";
}
