import { expect, test as setup } from "@playwright/test";

// can find to reuse beforetest login logic later.
setup("signin", async ({ page }) => {
  return;

  const testEmail = `wjdwlgus11@gmail.com`;
  const testPassword = "wkrwjs1!";

  await page.goto("http://localhost:3000/");
  await page.getByText("sign in").click();
  await expect(page.getByText("Sign in with Email")).toBeVisible();
  await page.getByTestId("signin-button-email").click();
  await page.getByPlaceholder("Enter Your Email").click();
  await page.getByPlaceholder("Enter Your Email").fill(testEmail);
  await page.getByPlaceholder("Enter Your Password").click();
  await page.getByPlaceholder("Enter Your Password").fill(testPassword);

  await page.getByTestId("email-signin-button").click();
  await expect(page.getByPlaceholder("Ask anything")).toBeVisible();
});
