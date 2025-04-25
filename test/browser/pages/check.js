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
    // this.continueButton = this.page.locator("button", {
    //   hasText: " Continue "
    // });
    this.continueButton = this.page.locator('xpath=//*[@id="continue"]');
    this.supportLink = this.page.locator(
      "xpath=/html/body/footer/div/div/div[1]/ul/li[5]/a"
    );
    this.footerLinks = {
      Accessibility: this.page.locator(
        "xpath=/html/body/footer/div/div/div[1]/ul/li[1]/a"
      ),
      Cookies: this.page.locator(
        "xpath=/html/body/footer/div/div/div[1]/ul/li[2]/a"
      ),
      TsAndCs: this.page.locator(
        "xpath=/html/body/footer/div/div/div[1]/ul/li[3]/a"
      ),
      Privacy: this.page.locator(
        "xpath=/html/body/footer/div/div/div[1]/ul/li[4]/a"
      ),
      Support: this.page.locator(
        "xpath=/html/body/footer/div/div/div[1]/ul/li[5]/a"
      ),
      OGL: this.page.locator("xpath=/html/body/footer/div/div/div[1]/span/a"),
      CrownCopyright: this.page.locator(
        "xpath=/html/body/footer/div/div/div[2]/a"
      )
    };
    this.cookiesAcceptedSettingLink = this.page.locator(
      "xpath=/html/body/div[1]/div[2]/div[1]/div/div/p/a"
    );
    this.cookiesRejectedSettingLink = this.page.locator(
      "xpath=/html/body/div[1]/div[3]/div[1]/div/div/p/a"
    );
    this.betaBanner = this.page.locator("xpath=/html/body/div[2]/div/p/span");
    this.acceptCookiesButton = this.page.locator(
      "xpath=/html/body/div[1]/div[1]/div[2]/button[1]"
    );
    this.rejectCookiesButton = this.page.locator(
      "xpath=/html/body/div[1]/div[1]/div[2]/button[2]"
    );
    this.acceptCookiesMessage = this.page.locator(
      "xpath=/html/body/div[1]/div[2]/div[1]/div/div/p"
    );
    this.rejectCookiesMessage = this.page.locator(
      "xpath=/html/body/div[1]/div[3]/div[1]/div/div/p"
    );
    this.fraudLandingPageTitleSummary = this.page.locator(
      'xpath=//*[@id="header"]'
    );
    this.fraudLandingPageTitleSummaryTextOne = this.page.locator(
      'xpath=//*[@id="main-content"]/div/div/form/p[1]'
    );
    this.fraudLandingPageTitleSummaryTextTwo = this.page.locator(
      'xpath=//*[@id="main-content"]/div/div/form/p[2]'
    );
    this.fraudLandingPageWarningMessageText = this.page.locator(
      'xpath=//*[@id="main-content"]/div/div/form/p[3]/text()'
    );
  }

  isCurrentPage() {
    return this.page.url() === this.url;
  }

  pageUrlIncludes(urlSegment) {
    console.log("URL " + this.page.url() + "       " + urlSegment); // eslint-disable-line no-console
    return this.page.url().includes(urlSegment);
  }

  async assertFraudLandingPageTitleSummary(fraudLandingPageTitleSummary) {
    await this.page.waitForLoadState("domcontentloaded");
    await this.fraudLandingPageTitleSummary.isVisible(
      fraudLandingPageTitleSummary
    );
  }

  async assertFraudLandingPageTitleSummaryTextOne(
    fraudLandingPageTitleSummaryTextOne
  ) {
    await this.page.waitForLoadState("domcontentloaded");
    await this.fraudLandingPageTitleSummaryTextOne.isVisible(
      fraudLandingPageTitleSummaryTextOne
    );
  }

  async assertFraudLandingPageTitleSummaryTextTwo(
    fraudLandingPageTitleSummaryTextTwo
  ) {
    await this.page.waitForLoadState("domcontentloaded");
    await this.fraudLandingPageTitleSummaryTextTwo.isVisible(
      fraudLandingPageTitleSummaryTextTwo
    );
  }

  async getDoNotRefreshPageMessage(fraudLandingPageWarningMessage) {
    await this.page.waitForLoadState("domcontentloaded");
    await this.fraudLandingPageWarningMessageText.isVisible(
      fraudLandingPageWarningMessage
    );
  }

  async assertPrivacyTabs(linkName) {
    await this.page.waitForLoadState("domcontentloaded");
    await this.whoAreWeSummaryLink.click();
    if (linkName === "ThirdParty") {
      await this.experianLink.click();
      await this.page.waitForTimeout(2000); //waitForNavigation and waitForLoadState do not work in this case
      let context = this.page.context();
      let pages = context.pages();
      console.log("TAB NAME =  " + (await pages[1].title())); // eslint-disable-line no-console
      expect(await pages[1].title()).to.equal(
        "Privacy and Your Data | Experian"
      );
    } else {
      await this.privacyPolicyLink.click();
      await this.page.waitForTimeout(2000); //waitForNavigation and waitForLoadState do not work in this case
      let context = this.page.context();
      let pages = context.pages();
      console.log("TAB NAME =  " + (await pages[1].title())); // eslint-disable-line no-console
      expect(await pages[1].title()).to.equal(
        "Privacy notice - GOV.UK One Login"
      );
    }
  }

  async assertFooterLink(linkName) {
    const timeout = 10000;
    const linkLocator = this.footerLinks[linkName];

    if (!linkLocator) {
      throw new Error(`No locator defined for footer link: ${linkName}`);
    }

    // Define urlAssertions only once
    const urlAssertions = {
      Accessibility: "https://signin.account.gov.uk/accessibility-statement",
      Cookies: "https://signin.account.gov.uk/cookies",
      TsAndCs: "https://signin.account.gov.uk/terms-and-conditions",
      Privacy: "https://signin.account.gov.uk/privacy-notice",
      Support: "https://home.account.gov.uk/contact-gov-uk-one-login",
      OGL: "https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/",
      CrownCopyright:
        "https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/"
    };

    // Determine if the link opens in a new tab or not
    const targetAttribute = await linkLocator.evaluate((el) =>
      el.getAttribute("target")
    );
    const newTabExpected = targetAttribute === "_blank";

    if (newTabExpected) {
      await Promise.all([
        this.page.waitForEvent("popup", { timeout }),
        linkLocator.click({ modifier: "Ctrl" })
      ]);

      const pages = this.page.context().pages();
      const newTab = pages[pages.length - 1];

      expect(await newTab.title()).to.not.equal(
        "Page not found - GOV.UK One Login"
      );

      if (urlAssertions[linkName]) {
        expect(newTab.url()).to.contain(urlAssertions[linkName]);
      } else {
        throw new Error(
          `No URL assertion defined for footer link: ${linkName}`
        );
      }
    } else {
      // Pass a URL pattern or '*' to waitForURL
      await Promise.all([
        this.page.waitForURL(/.*/, { timeout }), // Wait for any URL change
        linkLocator.click()
      ]);

      if (urlAssertions[linkName]) {
        expect(this.page.url()).to.contain(urlAssertions[linkName]);
      } else {
        throw new Error(
          `No URL assertion defined for footer link: ${linkName}`
        );
      }
    }
  }

  async assertBetaBannerText(betaBannerText) {
    expect(await this.isCurrentPage()).to.be.true;
    expect(await this.betaBanner.innerText()).to.equal(betaBannerText);
  }

  async assertBetaBannerWelshText(betaBannerWelshText) {
    expect(await this.betaBanner.innerText()).to.equal(betaBannerWelshText);
  }

  async assertRejectCookies(rejectCookiesText) {
    await this.rejectCookiesButton.click();
    expect(await this.rejectCookiesMessage.innerText()).to.equal(
      rejectCookiesText
    );
  }

  async assertAcceptCookies(acceptCookiesText) {
    await this.acceptCookiesButton.click();
    expect(await this.acceptCookiesMessage.innerText()).to.equal(
      acceptCookiesText
    );
  }

  async assertAcceptedCookiesSettingLink() {
    await this.cookiesAcceptedSettingLink.click();
    await this.page.waitForTimeout(3000); //waitForNavigation and waitForLoadState do not work in this case
    let context = this.page.context();
    let pages = context.pages();
    expect(pages[0].url()).to.equal("https://signin.account.gov.uk/cookies");
  }

  async assertRejectedCookiesSettingLink() {
    await this.cookiesRejectedSettingLink.click();
    await this.page.waitForTimeout(3000); //waitForNavigation and waitForLoadState do not work in this case
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

  async checkDeviceIntelligenceCookie(deviceIntelligenceCookieName) {
    // Wait for the page to fully load
    await this.page.waitForLoadState("networkidle", { timeout: 5000 });

    const cookies = await this.page.context().cookies();

    const cookie = cookies.find(
      (cookie) => cookie.name === deviceIntelligenceCookieName
    );

    if (!cookie) {
      throw new Error(
        `Cookie with name '${deviceIntelligenceCookieName}' not found.`
      );
    }

    if (
      cookie.value === undefined ||
      cookie.value === null ||
      cookie.value.trim() === ""
    ) {
      // Check for undefined, null, or empty string in value field of the cookie
      throw new Error(
        `Cookie with name '${deviceIntelligenceCookieName}' has no value.`
      );
    }

    return true;
  }
};
