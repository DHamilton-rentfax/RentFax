export const IS_STAGING = process.env.NEXT_PUBLIC_APP_URL?.includes("staging");
export const PROJECT_ID = IS_STAGING
  ? process.env.FIREBASE_PROJECT_ID_STAGING
  : process.env.FIREBASE_PROJECT_ID;
