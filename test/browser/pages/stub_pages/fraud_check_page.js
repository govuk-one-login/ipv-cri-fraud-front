const { expect } = require("@playwright/test");

module.exports = class FraudCheckPage {
  constructor(page) {
    this.page = page;
    // Selectors for elements on the Fraud Check Page
    this.checkYourDetailsContinueButton = page.locator(
      'xpath=//*[@id="continue"]'
    );
  }

  async assertUrlPathContains(path) {
    const escapeRegExp = (string) => {
      return string.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
    };
    const regex = new RegExp(escapeRegExp(path));
    await expect(this.page).toHaveURL(regex);
  }

  async clickContinue() {
    await Promise.all([
      this.checkYourDetailsContinueButton.click(),
      this.page.waitForNavigation({ timeout: 40000 })
    ]);
  }
};
