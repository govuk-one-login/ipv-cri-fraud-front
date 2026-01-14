const { Given, When, Then, And } = require("@cucumber/cucumber");
const { assert } = require("chai");
const { expect } = require("@playwright/test");
const IpvCoreStubPage = require("../../pages/stub_pages/ipv_core_stub_page.js");
const CheckYourDetailsPage = require("../../pages/stub_pages/check_your_details_page.js");
const UserDetailsPage = require("../../pages/stub_pages/user_details_edit_page.js");
const ConfigurationReader = require("../../support/ConfigurationReader");

function isMasked(val) {
  return !val || val === "MASKED" || val === "***";
}

require("dotenv").config();

Given("I navigate to the IPV Core Stub", async function () {
  await this.context.clearCookies();

  let coreStubUrl = ConfigurationReader.get("CORE_STUB_URL");
  const coreStubUsername = ConfigurationReader.get("CORE_STUB_USERNAME");
  const coreStubPassword = ConfigurationReader.get("CORE_STUB_PASSWORD");

  if (coreStubUsername && coreStubPassword) {
    const urlParts = coreStubUrl.match(/^(https?:\/\/)?(.*)$/);
    const protocol = urlParts[1] || "https://";
    const domain = urlParts[2];
    coreStubUrl = `${protocol}${coreStubUsername}:${coreStubPassword}@${domain}`;
  }

  await this.page.goto(coreStubUrl);
  /** @type {IpvCoreStubPage} */
  this.ipvCoreStubPage = new IpvCoreStubPage(this.page);
  await this.ipvCoreStubPage.assertOnIpvCoreStubPage();
});

Given("I click the Fraud CRI for the testEnvironment", async function () {
  if (!this.ipvCoreStubPage) {
    this.ipvCoreStubPage = new IpvCoreStubPage(this.page);
  }
  const testEnvironment = ConfigurationReader.get("ENVIRONMENT");
  await this.ipvCoreStubPage.clickVisitCredentialIssuers();
  await this.ipvCoreStubPage.clickFraudCRIForEnvironment(testEnvironment);
  await expect(this.page).toHaveURL(/credential-issuer\?cri=fraud-cri/);
});

Given(
  "I search for user number {int} in the ThirdParty table",
  async function (userNumber) {
    if (!this.ipvCoreStubPage) {
      this.ipvCoreStubPage = new IpvCoreStubPage(this.page);
    }
    await this.ipvCoreStubPage.searchForUATUser(String(userNumber));
  }
);

Given(
  /^I search for user name (.*) in the ThirdParty table$/,
  async function (userName) {
    if (!this.ipvCoreStubPage) {
      this.ipvCoreStubPage = new IpvCoreStubPage(this.page);
    }
    await this.ipvCoreStubPage.searchForUATUserByUserName(String(userName));
  }
);

When(/^User clicks the Go to Fraud CRI button$/, async function () {
  if (!this.ipvCoreStubPage) {
    this.ipvCoreStubPage = new IpvCoreStubPage(this.page);
  }
  await this.ipvCoreStubPage.userSearchGoToFraudCri();
});

When(/^User clicks Edit User button$/, async function () {
  if (!this.ipvCoreStubPage) {
    this.ipvCoreStubPage = new IpvCoreStubPage(this.page);
  }
  await this.ipvCoreStubPage.userSearchEditUser();
});

When(
  /^I update the user details with given name (.*), family name (.*)$/,
  async function (givenName, familyName) {
    this.userDetailsPage = new UserDetailsPage(this.page);

    const detailsToUpdate = {
      givenName: givenName,
      familyName: familyName
    };
    await this.userDetailsPage.updateUserDetails(detailsToUpdate);
  }
);

Then(/^User is navigated to the Fraud (.*) Page$/, async function (path) {
  if (!this.ipvCoreStubPage) {
    this.ipvCoreStubPage = new IpvCoreStubPage(this.page);
  }
  await this.ipvCoreStubPage.assertUrlPathContains(path);
});

Then(/^User clicks the fraud continue button$/, async function () {
  this.checkYourDetailsPage = new CheckYourDetailsPage(this.page);

  await this.checkYourDetailsPage.clickContinue();
  await expect(this.page).toHaveURL(/callback\?client_id=/);
});

Then(
  /^User is navigated to the Verifiable Credential Issuers Page$/,
  async function () {
    this.ipvCoreStubPage = new IpvCoreStubPage(this.page);
    const expectedSubstring = "callback";

    await this.ipvCoreStubPage.verifyCurrentUrlContains(expectedSubstring);
  }
);

Then(
  /^The VC contains the expected response for (.+) (.+) with (.*) and (.*)$/,
  async function (givenName, familyName, expectedScore, expectedCi) {
    await this.ipvCoreStubPage.validateVcCredentialSubject(
      givenName,
      familyName,
      expectedScore,
      expectedCi,
      isMasked,
      assert
    );
  }
);
