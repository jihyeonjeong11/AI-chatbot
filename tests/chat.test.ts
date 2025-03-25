import { ChatPage } from "./pages/chat";
import { test, expect } from "@playwright/test";

test.describe("Renders chat page", () => {
  let chatPage: ChatPage;
  test.beforeEach(async ({ page }) => {
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
    chatPage = new ChatPage(page);
  });

  test("Form working", async ({ page }) => {
    await expect(page.getByPlaceholder("Ask anything")).toBeVisible();
    return;
    await chatPage.TextArea.click();
    await chatPage.TextArea.fill("random text");
    const textContent = await chatPage.TextArea.textContent();
    expect(textContent).toBe("random text");
  });

  test("send a user message and receive response", async () => {
    await chatPage.sendUserMessage();
    await chatPage.isGenerationComplete();

    // const assistantMessage = await chatPage.getRecentAssistantMessage();
    // expect(assistantMessage.content).toContain("It's just green duh!");
  });
});

// test.describe("Render landing page", () => {
//   let landingPage: LandingPage;

//   test.beforeEach(async ({ page }) => {
//     landingPage = new LandingPage(page);
//     await landingPage.start();
//   });

//   test("Should render header and signin button", async ({ page }) => {
//     await expect(page.getByTestId("sign-in-button")).toBeVisible();
//   });

//   test("Should render sign-in button", async ({ page }) => {
//     await landingPage.goToAuth();
//     await expect(page).toHaveURL("/sign-in");
//   });
// });
