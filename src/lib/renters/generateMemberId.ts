const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; 
// no O, I, L, 0, 1

export function generateMemberId(): string {
  let id = "";
  for (let i = 0; i < 7; i++) {
    id += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return id;
}
