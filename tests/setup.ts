import { Page } from "@playwright/test";

global.loginAs = async (page: Page, role: string) => {
  // TODO: Implement the login logic based on the role
  console.log(`Logging in as ${role}`);
};
