import { expect, Page } from "@playwright/test";

export class LandingPage {
  constructor(private page: Page) {}

  public get signInButton() {
    return this.page.getByTestId("sign-in-button");
  }

  async start() {
    await this.page.goto("/");
  }

  async goToAuth() {
    await this.signInButton.click();
  }

  async isGenerationComplete() {
    const response = await this.page.waitForResponse((response) =>
      response.url().includes("/api/chat")
    );

    await response.finished();
  }
}
