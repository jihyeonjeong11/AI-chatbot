import { ChatPage } from "./pages/chat";
import { test, expect } from "@playwright/test";

test.describe("Renders chat page", () => {
  let chatPage: ChatPage;
  test.beforeEach(async ({ page }) => {
    chatPage = new ChatPage(page);
    await chatPage.start();
    await page.waitForURL("/chat");
  });

  test("Form working", async ({ page }) => {
    await expect(page.getByPlaceholder("Ask anything")).toBeVisible();
  });

  test("send a user message and receive response", async ({ page }) => {
    await chatPage.sendUserMessage("hello");
    await chatPage.isGenerationComplete();
    const assistantMessage = await page.getByTestId("assitant-message");
    expect(assistantMessage).toBeVisible();
  });

  test("redirect to /chat/:id after submitting message", async ({ page }) => {
    await chatPage.sendUserMessage("Why is grass green?");
    await chatPage.isGenerationComplete();
    const assistantMessage = await page.getByTestId("assitant-message");
    expect(assistantMessage).toBeVisible();

    await chatPage.hasChatIdInUrl();
  });

  test("stop generation during submission", async ({ page }) => {
    await chatPage.sendUserMessage("Why is grass green?");
    await expect(page.getByTestId("stop-button")).toBeVisible();
    await page.getByTestId("stop-button").click();
    await expect(page.getByTestId("submit-button")).toBeVisible();
  });
});
