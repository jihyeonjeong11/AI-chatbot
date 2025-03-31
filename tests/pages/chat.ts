import { expect, Page } from "@playwright/test";

export class ChatPage {
  constructor(private page: Page) {}

  public get DocsButton() {
    return this.page.getByTestId("sign-in-button");
  }

  public get TextArea() {
    return this.page.getByTestId("prompt-area");
  }

  public get SubmitButton() {
    return this.page.getByTestId("submit-button");
  }

  public get StopButton() {
    return this.page.getByTestId("submit-button");
  }

  public get AssistantMessage() {
    return this.page.getByTestId("assitant-message");
  }

  async start() {
    await this.page.goto("http://localhost:3000");
  }

  async sendUserMessage(message: string) {
    await this.TextArea.click();
    await this.TextArea.fill(message);
    await this.SubmitButton.click();
  }

  async isGenerationComplete() {
    const response = await this.page.waitForResponse((response) =>
      response.url().includes("/api/chat")
    );

    await response.finished();
  }

  async hasChatIdInUrl() {
    await expect(this.page).toHaveURL(
      /^http:\/\/localhost:3000\/chat\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    );
  }
}
