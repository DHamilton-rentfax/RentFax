export function getPlanIdentityCredits(plan: string) {
  switch (plan) {
    case "free":
      return 0;

    case "basic": // $149/mo
      return 50;

    case "pro": // $299/mo
      return 200;

    case "enterprise":
      return 999999; // effectively unlimited

    case "super_admin":
      return 999999;

    default:
      return 0;
  }
}
