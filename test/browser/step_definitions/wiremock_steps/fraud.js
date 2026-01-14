const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("chai");
const { CheckPage } = require("../../pages/wiremock_pages");
const { AxeBuilder } = require("@axe-core/playwright");

Given(/they (?:can )?see? the check page$/, async function () {
  const checkPage = new CheckPage(this.page);
  expect(checkPage.isCurrentPage()).to.be.true;
});

Given(
  /^I run the Axe Accessibility check against the Fraud Check entry page$/,
  async function () {
    const results = await new AxeBuilder({ page: this.page })
      .withTags(["wcag22aa"])
      .analyze();

    expect(results.violations).to.be.empty;
  }
);

When(/^they (?:have )?continue(?:d)? to fraud check$/, async function () {
  const checkPage = new CheckPage(this.page);
  expect(checkPage.isCurrentPage()).to.be.true;
  await checkPage.continue();
  expect(checkPage.isCurrentPage()).to.be.false;
});

Given(/^they continue to fraud check page$/, async function () {
  const checkPage = new CheckPage(this.page);
  await checkPage.continue();
  expect(checkPage.isCurrentPage()).to.be.false;
});

Then(
  /^I see the Device Intelligence Cookie (.*)$/,
  async function (deviceIntelligenceCookieName) {
    const checkPage = new CheckPage(this.page);
    await checkPage.checkDeviceIntelligenceCookie(deviceIntelligenceCookieName);
  }
);

Given(
  /^they click (.*) and assert I have been directed correctly$/,
  async function (linkName) {
    const checkPage = new CheckPage(this.page);
    expect(checkPage.isCurrentPage()).to.be.true;
    await checkPage.assertPrivacyTabs(linkName);
  }
);

Given(
  /^they click Footer (.*) and assert I have been redirected correctly$/,
  async function (linkName) {
    const checkPage = new CheckPage(this.page);
    expect(checkPage.isCurrentPage()).to.be.true;
    await checkPage.assertFooterLink(linkName);
  }
);

Given(/^The Beta banner is displayed$/, async function () {
  const checkPage = new CheckPage(this.page);
  await checkPage.betaBannerDisplayed();
});

When(
  /^they view the Beta banner with the text as (.*)$/,
  async function (betaBannerText) {
    const checkPage = new CheckPage(this.page);
    expect(checkPage.isCurrentPage()).to.be.true;
    await checkPage.assertBetaBannerText(betaBannerText);
  }
);

Then(
  /^I assert the feedback URL (.*) is correct and live$/,
  async function (expectedURL) {
    const checkPage = new CheckPage(this.page);
    await checkPage.assertFeedbackPageIsCorrectAndLive(expectedURL);
  }
);

Then(
  /^I select Reject analytics cookies button and see the text (.*)$/,
  async function (rejectCookiesText) {
    const checkPage = new CheckPage(this.page);
    await checkPage.assertRejectCookies(rejectCookiesText);
  }
);

Then(
  /^I select Accept analytics cookies button and see the text (.*)$/,
  async function (acceptCookiesText) {
    const checkPage = new CheckPage(this.page);
    await checkPage.assertAcceptCookies(acceptCookiesText);
  }
);

Then(
  "I select the accepted link change your cookie settings and assert I have been redirected correctly",
  async function () {
    const checkPage = new CheckPage(this.page);
    await checkPage.assertAcceptedCookiesSettingLink();
  }
);

Then(
  "I select the rejected link change your cookie settings and assert I have been redirected correctly",
  async function () {
    const checkPage = new CheckPage(this.page);
    await checkPage.assertRejectedCookiesSettingLink();
  }
);

Given(/^The cookie banner is displayed$/, async function () {
  const checkPage = new CheckPage(this.page);
  await checkPage.cookieBannerDisplayed();
});

When(/^User clicks on the View Cookies Link$/, async function () {
  const checkPage = new CheckPage(this.page);
  await checkPage.clickViewCookiesLink();
});

Then(
  /^I check the Cookies page Title (.*)$/,
  async function (cookiesPageTitle) {
    const checkPage = new CheckPage(this.page);
    await checkPage.assertCookiesPolicyPageTitle(cookiesPageTitle);
  }
);

Then(/^I see the (.*) Link Text$/, async function (skipToMainContent) {
  const checkPage = new CheckPage(this.page);
  await checkPage.assertSkipToMainContent(skipToMainContent);
});

Then(
  /^they can see the check page title text as (.*)$/,
  async function (fraudLandingPageTitleSummary) {
    const checkPage = new CheckPage(this.page);
    await checkPage.assertFraudLandingPageTitleSummary(
      fraudLandingPageTitleSummary
    );
  }
);

Then(
  /^they can see the check page title summary text first part as (.*)$/,
  async function (fraudLandingPageTitleSummaryTextOne) {
    const checkPage = new CheckPage(this.page);
    await checkPage.assertFraudLandingPageTitleSummaryTextOne(
      fraudLandingPageTitleSummaryTextOne
    );
  }
);

Then(
  /^they can see the check page title summary text second part as (.*)$/,
  async function (fraudLandingPageTitleSummaryTextTwo) {
    const checkPage = new CheckPage(this.page);
    await checkPage.assertFraudLandingPageTitleSummaryTextTwo(
      fraudLandingPageTitleSummaryTextTwo
    );
  }
);

Then(
  /^they can see the check page warning text (.*)$/,
  async function (fraudLandingPageWarningMessage) {
    const checkPage = new CheckPage(this.page);
    await checkPage.getDoNotRefreshPageMessage(fraudLandingPageWarningMessage);
  }
);

When(
  /^they view the Beta banner with the Welsh text as (.*)$/,
  async function (betaBannerWelshText) {
    const checkPage = new CheckPage(this.page);
    await checkPage.assertBetaBannerWelshText(betaBannerWelshText);
  }
);
