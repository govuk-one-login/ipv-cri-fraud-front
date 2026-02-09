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
    this.continueButton = this.page.locator('xpath=//*[@id="continue"]');
    this.skipToMainContent = this.page.locator("xpath=//html/body/a");
    this.cookieBanner = this.page.locator(
      'xpath=//*[@id="cookies-banner-main"]'
    );
    this.viewCookiesLink = this.page.locator(
      'xpath=//*[@id="cookies-banner-main"]/div[2]/a'
    );
    this.cookiesPageTitle = this.page.locator(
      'xpath=//*[@id="main-content"]/div/div/h1'
    );
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
    this.betaBannerLink = this.page.locator(
      "xpath=/html/body/div[2]/div/p/span/a"
    );
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
      'xpath=//*[@id="main-content"]/div/div/form/p[3]'
    );
  }

  isCurrentPage() {
    return this.page.url() === this.url;
  }

  async assertFraudLandingPageTitleSummary(fraudLandingPageTitleSummary) {
    await this.page.waitForLoadState("domcontentloaded");
    await this.fraudLandingPageTitleSummary.isVisible(
      fraudLandingPageTitleSummary
    );
    await expect(
      await this.fraudLandingPageTitleSummary.textContent()
    ).to.contains(fraudLandingPageTitleSummary);
  }

  async assertFraudLandingPageTitleSummaryTextOne(
    fraudLandingPageTitleSummaryTextOne
  ) {
    await this.page.waitForLoadState("domcontentloaded");
    await this.fraudLandingPageTitleSummaryTextOne.isVisible(
      fraudLandingPageTitleSummaryTextOne
    );
    await expect(
      await this.fraudLandingPageTitleSummaryTextOne.textContent()
    ).to.contains(fraudLandingPageTitleSummaryTextOne);
  }

  async assertFraudLandingPageTitleSummaryTextTwo(
    fraudLandingPageTitleSummaryTextTwo
  ) {
    await this.page.waitForLoadState("domcontentloaded");
    await this.fraudLandingPageTitleSummaryTextTwo.isVisible(
      fraudLandingPageTitleSummaryTextTwo
    );
    await expect(
      await this.fraudLandingPageTitleSummaryTextTwo.textContent()
    ).to.contains(fraudLandingPageTitleSummaryTextTwo);
  }

  async getDoNotRefreshPageMessage(fraudLandingPageWarningMessage) {
    await this.page.waitForLoadState("domcontentloaded");
    await this.fraudLandingPageWarningMessageText.isVisible(
      fraudLandingPageWarningMessage
    );
    await expect(
      await this.fraudLandingPageWarningMessageText.textContent()
    ).to.contains(fraudLandingPageWarningMessage);
  }

  async assertPrivacyTabs(linkName) {
    await this.page.waitForLoadState("domcontentloaded");
    await this.whoAreWeSummaryLink.click();

    let targetLink;

    if (linkName === "ThirdParty") {
      targetLink = this.experianLink;
    } else {
      targetLink = this.privacyPolicyLink;
    }

    const [newPage] = await Promise.all([
      this.page.waitForEvent("popup", { timeout: 60000 }),
      targetLink.click()
    ]);

    await newPage.waitForLoadState("domcontentloaded");
    await newPage.close();
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
      Privacy:
        "https://www.gov.uk/government/publications/govuk-one-login-privacy-notice",
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

  async betaBannerDisplayed() {
    await this.page.waitForLoadState("domcontentloaded");
    await this.betaBanner.isVisible();
  }

  async assertBetaBannerText(betaBannerText) {
    expect(await this.betaBanner.innerText()).to.equal(betaBannerText);
  }

  async assertBetaBannerWelshText(betaBannerWelshText) {
    expect(await this.betaBanner.innerText()).to.equal(betaBannerWelshText);
  }

  async assertFeedbackPageIsCorrectAndLive(expectedURL) {
    const newPagePromise = this.page.waitForEvent("popup");

    await this.betaBannerLink.click();

    const newPage = await newPagePromise;
    await newPage.waitForLoadState("domcontentloaded");

    const actualURL = await newPage.url();

    expect(actualURL).to.contain(expectedURL); // Use to.equal for exact URL match

    await newPage.close();
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

  async cookieBannerDisplayed() {
    await this.page.waitForLoadState("domcontentloaded");
    await this.cookieBanner.isVisible();
  }

  async clickViewCookiesLink() {
    await this.page.waitForLoadState("domcontentloaded");
    await this.viewCookiesLink.click();
  }

  async assertCookiesPolicyPageTitle(cookiesPageTitle) {
    await this.page.waitForLoadState("domcontentloaded");
    await this.cookiesPageTitle.isVisible(cookiesPageTitle);
    expect(await this.cookiesPageTitle.textContent()).to.contains(
      cookiesPageTitle
    );
  }

  async assertSkipToMainContent(skipToMainContent) {
    await this.page.waitForLoadState("domcontentloaded");
    await this.skipToMainContent.textContent(skipToMainContent);
    expect(await this.skipToMainContent.textContent()).to.contains(
      skipToMainContent
    );
  }

  async continue() {
    await this.continueButton.waitFor({ state: "visible" });

    const spinnerCheckPromise = this.page.evaluate(() => {
      return new Promise((resolve) => {
        const button = document.querySelector("#continue");

        const observer = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            if (
              mutation.type === "attributes" &&
              mutation.attributeName === "class" &&
              button.classList.contains("button--spinner")
            ) {
              observer.disconnect();
              resolve({ hasSpinner: true });
              return;
            }
          }
        });

        observer.observe(button, {
          attributes: true,
          attributeFilter: ["class"]
        });

        setTimeout(() => {
          observer.disconnect();
          resolve({ hasSpinner: false });
        }, 1000);
      });
    });

    await this.continueButton.click();
    const result = await spinnerCheckPromise;

    if (!result.hasSpinner) {
      throw new Error("Spinner not visible");
    }
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
