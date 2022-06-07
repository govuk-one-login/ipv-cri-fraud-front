const { Given, When, Then } = require("@cucumber/cucumber");

const { expect } = require("chai");

const { CheckPage } = require("../pages");

When(/^they (?:have )?start(?:ed)? the Fraud journey$/, async function () {});

Given(/they (?:can )?see? the check page$/, async function () {
  const checkPage = new CheckPage(this.page);

  expect(checkPage.isCurrentPage()).to.be.true;
});

Given(/^they (?:have )?continue(?:d)? to fraud check$/, async function () {
  const checkPage = new CheckPage(this.page);

  expect(checkPage.isCurrentPage()).to.be.true;

  await checkPage.continue();
});
