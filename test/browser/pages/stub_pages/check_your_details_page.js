module.exports = class CheckYourDetailsPage {
  constructor(page) {
    this.page = page;
    // Selectors for elements on the Fraud Check Page
    this.checkYourDetailsContinueButton = page.locator(
      'xpath=//*[@id="continue"]'
    );
  }

  async clickContinue() {
    await Promise.all([
      this.checkYourDetailsContinueButton.click(),
      this.page.waitForNavigation({ timeout: 40000 })
    ]);
  }
};
