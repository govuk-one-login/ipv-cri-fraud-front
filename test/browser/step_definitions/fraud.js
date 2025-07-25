const { Given, When, Then } = require("@cucumber/cucumber");

const { expect } = require("chai");

const { CheckPage } = require("../pages");

const { injectAxe } = require("axe-playwright");

Given(/they (?:can )?see? the check page$/, async function () {
  const checkPage = new CheckPage(this.page);
  expect(checkPage.isCurrentPage()).to.be.true;
});

Given(
  /^I run the Axe Accessibility check against the Fraud Check entry page$/,
  async function () {
    await injectAxe(this.page);
    // Run Axe for WCAG 2.2 AA rules
    const wcagResults = await this.page.evaluate(() => {
      return axe.run({
        runOnly: ["wcag22aa"]
      });
    });
    expect(wcagResults.violations).to.be.empty;
  }
);

Given(/^they (?:have )?continue(?:d)? to fraud check$/, async function () {
  const checkPage = new CheckPage(this.page);
  expect(checkPage.isCurrentPage()).to.be.true;
  await Promise.all([checkPage.continue(), checkPage.waitForSpinner()]);
  expect(checkPage.isCurrentPage()).to.be.false;
});

Given(/^they continue to fraud check page$/, async function () {
  const checkPage = new CheckPage(this.page);
  await Promise.all([checkPage.continue(), checkPage.waitForSpinner()]);
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
