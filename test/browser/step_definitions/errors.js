const { Given, When, Then } = require("@cucumber/cucumber");

const { expect } = require("chai");

const { ErrorPage } = require("../pages");

const { injectAxe } = require("axe-playwright");

Then("they should see an error page", async function () {
  const errorPage = new ErrorPage(this.page);
  const errorTitle = await errorPage.getErrorTitle();
  expect(errorTitle).to.equal(errorPage.getSomethingWentWrongMessage());
});

Then(
  /^I run the Axe Accessibility check against the Fraud Error page$/,
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
