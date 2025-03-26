import path from "path";
import { generateId } from "ai";
import { getUnixTime } from "date-fns";

import { expect, test as setup } from "@playwright/test";

const authFile = path.join(__dirname, "../playwright/.auth/session.json");

const testEmail = `test-${getUnixTime(new Date())}@playwright.com`;
const testPassword = generateId(16);

// root -> /sign-in -> /sign-in/email

setup("register", async ({ page }) => {
  await page.goto("http://localhost:3000/sign-in");
  await expect(page.getByText("Sign in with Email")).toBeVisible();
  await page.getByTestId("signin-button-email").click();

  await expect(page.getByText("Forgot Password")).toBeVisible();
  await page.getByTestId("register-button").click();

  await expect(
    page.getByPlaceholder("Enter Confirm your Password")
  ).toBeVisible();

  await page.getByPlaceholder("Enter Your Email").click();
  await page.getByPlaceholder("Enter Your Email").fill(testEmail);
  await page.getByPlaceholder("Enter Your Password").click();
  await page.getByPlaceholder("Enter Your Password").fill(testPassword);
  await page.getByPlaceholder("Enter Confirm Your Password").click();
  await page.getByPlaceholder("Enter Confirm Your Password").fill(testPassword);
  await page.getByTestId("register").click();
  await page.waitForURL("/chat");

  await page.context().storageState({ path: authFile });

  return;
});
