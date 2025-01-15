const { Given, When, Then } = require("@cucumber/cucumber");

const { expect } = require("chai");

const { CheckPage } = require("../pages");

const { injectAxe } = require("axe-playwright");

When(/^they (?:have )?start(?:ed)? the Fraud journey$/, async function () {});

Given(/they (?:can )?see? the check page$/, async function () {
  const checkPage = new CheckPage(this.page);
  await injectAxe(this.page);
  // Run Axe for WCAG 2.2 AA rules
  const wcagResults = await this.page.evaluate(() => {
    return axe.run({
      runOnly: ["wcag2aa"]
    });
  });
  expect(wcagResults.violations, "WCAG 2.2 AAA violations found").to.be.empty;
  expect(checkPage.isCurrentPage()).to.be.true;
});

Given(/^they (?:have )?continue(?:d)? to fraud check$/, async function () {
  const checkPage = new CheckPage(this.page);

  expect(checkPage.isCurrentPage()).to.be.true;

  await Promise.all([checkPage.continue(), checkPage.waitForSpinner()]);

  expect(checkPage.isCurrentPage()).to.be.false;
});

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

When(
  /^they view the Beta banner with the text as (.*)$/,
  async function (betaBannerText) {
    const checkPage = new CheckPage(this.page);

    expect(checkPage.isCurrentPage()).to.be.true;

    await checkPage.assertBetaBannerText(betaBannerText);
  }
);

Then(
  /^I select (.*) button and see the text (.*)$/,
  async function (rejectCookiesBtnText, rejectCookiesText) {
    const checkPage = new CheckPage(this.page);

    await checkPage.assertRejectCookies(
      rejectCookiesBtnText,
      rejectCookiesText
    );
  }
);

Then(
  "I select the link change your cookie settings and assert I have been redirected correctly",
  async function () {
    const checkPage = new CheckPage(this.page);

    await checkPage.assertCookiesSettingLink();
  }
);

Then(
  /^they see the reloading page warning text as (.*)$/,
  async function (warningMessage) {
    const checkPage = new CheckPage(this.page);

    const warningtext = await checkPage.getDoNotRefreshPageText();

    expect(warningtext).to.equal(
      checkPage.getDoNotRefreshPageMessage(warningMessage)
    );
  }
);

When(
  /^they view the Beta banner with the Welsh text as (.*)$/,
  async function (betaBannerWelshText) {
    const checkPage = new CheckPage(this.page);

    await checkPage.assertBetaBannerWelshText(betaBannerWelshText);
  }
);
