import { LandingPage } from "./pages/landing";
import { test, expect } from "@playwright/test";

test.describe("Render landing page", () => {
  let landingPage: LandingPage;

  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPage(page);
    await landingPage.start();
  });

  test("Should render header and signin button", async ({ page }) => {
    await expect(page.getByTestId("sign-in-button")).toBeVisible();
  });

  test("Should render sign-in button", async ({ page }) => {
    await landingPage.goToAuth();
    await expect(page).toHaveURL("/sign-in");
  });
});
