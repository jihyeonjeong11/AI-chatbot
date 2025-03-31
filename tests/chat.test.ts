import { ChatPage } from "./pages/chat";
import { test, expect } from "@playwright/test";

test.describe("Renders chat page", () => {
  let chatPage: ChatPage;
  test.beforeEach(async ({ page }) => {
    chatPage = new ChatPage(page);
    await chatPage.start();
    await page.waitForURL("/chat");
  });

  test("Form working", async () => {
    await expect(
      chatPage.TextArea.getByPlaceholder("Ask anything") // check if this passes
    ).toBeVisible();
  });

  test("send a user message and receive response", async () => {
    await chatPage.sendUserMessage("hello");
    await chatPage.isGenerationComplete();
    expect(chatPage.AssistantMessage).toBeVisible();
  });

  test("redirect to /chat/:id after submitting message", async () => {
    await chatPage.sendUserMessage("Why is grass green?");
    await chatPage.isGenerationComplete();
    expect(chatPage.AssistantMessage).toBeVisible();
    await chatPage.hasChatIdInUrl();
  });

  test("stop generation during submission", async () => {
    await chatPage.sendUserMessage("Why is grass green?");
    await expect(chatPage.StopButton).toBeVisible();
    await chatPage.StopButton.click();
    await expect(chatPage.SubmitButton).toBeVisible();
  });
});
