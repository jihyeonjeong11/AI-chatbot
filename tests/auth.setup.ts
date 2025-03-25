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

  // need to be fixed later.
  // await expect(page.getByTestId("toast")).toBeVisible();
  await page.context().storageState({ path: authFile });

  return;

  // await page.goto("http://localhost:3000/register");
  // await page.getByPlaceholder("user@acme.com").click();
  // await page.getByPlaceholder("user@acme.com").fill(testEmail);
  // await page.getByLabel("Password").click();
  // await page.getByLabel("Password").fill(testPassword);
  // await page.getByRole("button", { name: "Sign Up" }).click();

  // await expect(page.getByTestId("toast")).toContainText(
  //   "Account created successfully!"
  // );

  // await page.context().storageState({ path: authFile });
});
