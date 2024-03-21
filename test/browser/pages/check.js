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
      hasText: "Who we check your details with"
    });
    this.experianLink = this.page.locator("a", {
      hasText: "Experian (opens in new tab)"
    });
    this.privacyPolicyLink = this.page.locator("a", {
      hasText: "Read our privacy notice (opens in new tab)"
    });
    this.continueButton = this.page.locator("button", {
      hasText: " Continue "
    });
    this.supportLink = this.page.locator(
      "xpath=/html/body/footer/div/div/div[1]/ul/li[5]/a"
    );
    this.cookiesSettingLink = this.page.locator(
      "xpath=/html/body/div[1]/div[3]/div[1]/div/div/p/a"
    );
    this.betaBanner = this.page.locator("xpath=/html/body/div[2]/div/p/span");
    this.rejectCookiesButton = this.page.locator(
      "xpath=/html/body/div[1]/div[1]/div[2]/button[2]"
    );

    this.rejectCookiesMessage = this.page.locator(
      "xpath=/html/body/div[1]/div[3]/div[1]/div/div/p"
    );
  }

  isCurrentPage() {
    return this.page.url() === this.url;
  }

  pageUrlIncludes(urlSegment) {
    console.log("URL " + this.page.url() + "       " + urlSegment);
    return this.page.url().includes(urlSegment);
  }

  getDoNotRefreshPageMessage() {
    return "It can take up to 30 seconds to check your details. After you continue, do not reload or close this page.";
  }

  getDoNotRefreshPageText() {
    return this.page
      .locator("xpath=/html/body/div[2]/main/div/div/form/p[3]")
      .innerHTML();
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
  async assertFooterLink() {
    await this.supportLink.click();
    await this.page.waitForTimeout(2000); //waitForNavigation and waitForLoadState do not work in this case
    expect(await this.page.title()).to.not.equal(
      "Page not found - GOV.UK One Login"
    );
  }

  async assertBetaBannerText(betaBannerText) {
    betaBannerText =
      "This is a new service – your feedback (opens in new tab) will help us to improve it.";
    expect(await this.isCurrentPage()).to.be.true;
    expect(await this.betaBanner.innerText()).to.equal(betaBannerText);
  }

  async assertBetaBannerWelshText(betaBannerWelshText) {
    betaBannerWelshText =
      "Mae hwn yn wasanaeth newydd – bydd eich adborth (agor mewn tab newydd) yn ein helpu i'w wella.";
    expect(await this.betaBanner.innerText()).to.equal(betaBannerWelshText);
  }

  async assertRejectCookies() {
    await this.rejectCookiesButton.click();
    expect(await this.rejectCookiesMessage.innerText()).to.equal(
      "You've rejected additional cookies. You can change your cookie settings at any time."
    );
  }

  async assertRejectCookiesInWelsh() {
    await this.rejectCookiesButton.click();
    expect(await this.rejectCookiesMessage.innerText()).to.equal(
      "Rydych wedi gwrthod cwcis ychwanegol. Gallwch newid eich gosodiadau cwcis unrhyw bryd."
    );
  }

  async assertCookiesSettingLink() {
    await this.cookiesSettingLink.click();
    await this.page.waitForTimeout(2000); //waitForNavigation and waitForLoadState do not work in this case
    let context = await this.page.context();
    let pages = context.pages();
    expect(pages[0].url()).to.equal("https://signin.account.gov.uk/cookies");
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
