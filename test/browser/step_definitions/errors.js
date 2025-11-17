const { Given, When, Then } = require("@cucumber/cucumber");

const { expect } = require("chai");

const { ErrorPage } = require("../pages");

const { AxeBuilder } = require("@axe-core/playwright");

Then("they should see an error page", async function () {
  const errorPage = new ErrorPage(this.page);
  const errorTitle = await errorPage.getErrorTitle();
  expect(errorTitle).to.equal(errorPage.getSomethingWentWrongMessage());
});

Then(
  /^I run the Axe Accessibility check against the Fraud Error page$/,
  async function () {
    const results = await new AxeBuilder({ page: this.page })
      .withTags(["wcag22aa"])
      .analyze();

    expect(results.violations).to.be.empty;
  }
);
