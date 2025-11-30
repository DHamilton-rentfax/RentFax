
export function computeMatchScore(input: any, publicData: any) {
  let score = 0;

  if (!publicData) return 0;

  if (publicData.fullName && input.fullName) {
    if (publicData.fullName.toLowerCase() === input.fullName.toLowerCase()) {
      score += 40;
    }
  }

  if (publicData.email && input.email) {
    if (publicData.email.toLowerCase() === input.email.toLowerCase()) {
      score += 30;
    }
  }

  if (publicData.phone && input.phone) {
    if (publicData.phone.replace(/\D/g, "") === input.phone.replace(/\D/g, "")) {
      score += 20;
    }
  }

  if (publicData.address && input.address) {
    score += 10;
  }

  return Math.min(100, score);
}
