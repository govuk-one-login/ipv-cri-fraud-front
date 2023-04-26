const { expect: expect_play } = require("@playwright/test");
const { expect: expect } = require("chai");

module.exports = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.url = "http://localhost:5030/check";
    this.whoAreWeSummaryLink = this.page.locator("span", {
      hasText: "Who we check your details with",
    });
    this.experianLink = this.page.locator("a", {
      hasText: "Experian (opens in new tab)",
    });
    this.privacyPolicyLink = this.page.locator("a", {
      hasText: "Read our privacy notice (opens in new tab)",
    });
    this.continueButton = this.page.locator("button", {
      hasText: " Continue ",
    });
  }

  isCurrentPage() {
    return this.page.url() === this.url;
  }

  pageUrlIncludes(urlSegment) {
    console.log("URL " + this.page.url() + "       " + urlSegment);
    return this.page.url().includes(urlSegment);
  }

  async assertPrivacyTabs(linkName) {
    await this.whoAreWeSummaryLink.click();
    if (linkName === "ThirdParty") {
      await this.experianLink.click();
      await this.page.waitForTimeout(2000); //waitForNavigation and waitForLoadState do not work in this case
      let context = await this.page.context();
      let pages = await context.pages();
      console.log("TAB NAME =  " + (await pages[1].title()));
      expect(await pages[1].title()).to.equal(
        "Privacy and Your Data | Experian"
      );
    } else {
      await this.privacyPolicyLink.click();
      await this.page.waitForTimeout(2000); //waitForNavigation and waitForLoadState do not work in this case
      let context = await this.page.context();
      let pages = await context.pages();
      console.log("TAB NAME =  " + (await pages[1].title()));
      expect(await pages[1].title()).to.equal(
        "Privacy notice - GOV.UK One Login"
      );
    }
  }

  async waitForSpinner() {
    let spinnerVisible = await this.continueButton.isVisible();
    expect_play(spinnerVisible).toBeTruthy();
    return this.page.locator(".button--spinner").waitFor();
  }

  async continue() {
    this.continueButton.isVisible();
    return this.continueButton.click();
  }
};
