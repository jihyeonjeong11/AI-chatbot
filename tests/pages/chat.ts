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

  async start() {
    await this.page.goto("/chat");
  }

  async sendUserMessage() {
    await this.TextArea.click();
    await this.TextArea.fill("random text");
    await this.SubmitButton.click();
  }

  async isGenerationComplete() {
    const response = await this.page.waitForResponse((response) =>
      response.url().includes("/api/chat")
    );

    await response.finished();
  }

  //   async goToDocs() {
  //     await this.signInButton.click();
  //   }
}
