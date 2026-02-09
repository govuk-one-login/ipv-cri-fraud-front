const { Given, When, Then, And } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const {
  IpvCoreStubCredentialIssuerPage,
  IpvCoreStubUserSearchPage,
  IpvCoreStubUserEditPage,
  FraudCheckPage,
  IpvCoreStubVerfiyVcPage
} = require("../../pages/stub_pages");
const ConfigurationReader = require("../../support/configuration-reader");

require("dotenv").config();

Given("I navigate to the IPV Core Stub", async function () {
  await this.context.clearCookies();

  let coreStubUrl = ConfigurationReader.get("CORE_STUB_URL");
  const coreStubUsername = ConfigurationReader.get("CORE_STUB_USERNAME");
  const coreStubPassword = ConfigurationReader.get("CORE_STUB_PASSWORD");

  if (coreStubUsername && coreStubPassword) {
    const urlRegex = /^(https?:\/\/)?(.*)$/;
    const urlParts = urlRegex.exec(coreStubUrl);
    const protocol = urlParts[1] || "https://";
    const domain = urlParts[2];
    coreStubUrl = `${protocol}${coreStubUsername}:${coreStubPassword}@${domain}`;
  }

  await this.page.goto(coreStubUrl);
  /** @type {IpvCoreStubPage} */
  this.ipvCoreStubCredentialIssuerPage = new IpvCoreStubCredentialIssuerPage(
    this.page
  );
  await this.ipvCoreStubCredentialIssuerPage.assertOnIpvCoreStubPage();
});

Given("I click the Fraud CRI for the testEnvironment", async function () {
  if (!this.ipvCoreStubCredentialIssuerPage) {
    this.ipvCoreStubCredentialIssuerPage = new IpvCoreStubCredentialIssuerPage(
      this.page
    );
  }
  const testEnvironment = ConfigurationReader.get("ENVIRONMENT");
  await this.ipvCoreStubCredentialIssuerPage.clickVisitCredentialIssuers();
  await this.ipvCoreStubCredentialIssuerPage.clickFraudCRIForEnvironment(
    testEnvironment
  );
  await expect(this.page).toHaveURL(/credential-issuer\?cri=fraud-cri/);
});

Given(
  "I search for user number {int} in the ThirdParty table",
  async function (userNumber) {
    if (!this.ipvCoreStubCredentialIssuerPage) {
      this.ipvCoreStubCredentialIssuerPage =
        new IpvCoreStubCredentialIssuerPage(this.page);
    }
    await this.ipvCoreStubCredentialIssuerPage.searchForUATUser(
      String(userNumber)
    );
  }
);

Given(
  /^I search for user name (.*) in the ThirdParty table$/,
  async function (userName) {
    if (!this.ipvCoreStubCredentialIssuerPage) {
      this.ipvCoreStubCredentialIssuerPage =
        new IpvCoreStubCredentialIssuerPage(this.page);
    }
    await this.ipvCoreStubCredentialIssuerPage.searchForUATUserByUserName(
      String(userName)
    );
  }
);

When(/^User clicks the Go to Fraud CRI button$/, async function () {
  if (!this.ipvCoreStubUserSearchPage) {
    this.ipvCoreStubUserSearchPage = new IpvCoreStubUserSearchPage(this.page);
  }
  await this.ipvCoreStubUserSearchPage.userSearchGoToFraudCri();
});

When(/^User clicks Edit User button$/, async function () {
  if (!this.ipvCoreStubUserSearchPage) {
    this.ipvCoreStubUserSearchPage = new IpvCoreStubUserSearchPage(this.page);
  }
  await this.ipvCoreStubUserSearchPage.userSearchEditUser();
});

When(
  /^I update the user details with given name (.*), family name (.*)$/,
  async function (givenName, familyName) {
    this.ipvCoreStubUserEditPage = new IpvCoreStubUserEditPage(this.page);

    const detailsToUpdate = {
      givenName: givenName,
      familyName: familyName
    };
    await this.ipvCoreStubUserEditPage.updateUserDetails(detailsToUpdate);
  }
);

Then(/^User is navigated to the Fraud (.*) Page$/, async function (path) {
  if (!this.fraudCheckPage) {
    this.fraudCheckPage = new FraudCheckPage(this.page);
  }
  await this.fraudCheckPage.assertUrlPathContains(path);
});

Then(/^User clicks the fraud continue button$/, async function () {
  this.fraudCheckPage = new FraudCheckPage(this.page);

  await this.fraudCheckPage.clickContinue();
});

Then(
  /^User is navigated to the Verifiable Credential Issuers Page$/,
  async function () {
    this.ipvCoreStubVerifyVcPage = new IpvCoreStubVerfiyVcPage(this.page);
    const expectedSubstring = "callback";

    await this.ipvCoreStubVerifyVcPage.verifyCurrentUrlContains(
      expectedSubstring
    );
  }
);

Then(
  /^The VC contains the expected response for (.+) (.+) with (.*) and (.*)$/,
  async function (
    expectedGivenName,
    expectedFamilyName,
    expectedScore,
    expectedCi
  ) {
    this.ipvCoreStubVerifyVcPage = new IpvCoreStubVerfiyVcPage(this.page);
    await this.ipvCoreStubVerifyVcPage.validateJsonResponseFromFraudCri(
      expectedGivenName,
      expectedFamilyName,
      expectedScore,
      expectedCi
    );
    await expect(this.page).toHaveURL(/callback\?client_id=/);
  }
);
