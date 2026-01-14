const { expect } = require("@playwright/test");

module.exports = class IpvCoreStubCredentialIssuerPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    // Selectors for elements on the IPV Core Stub page
    this.visitCredentialIssuersButton = page.locator(
      'button:has-text("Visit Credential Issuers")'
    );
    this.fraudCRIBuildButton = page.locator('xpath=//*[@id="fraud-cri-build"]');
    this.fraudCRIDevButton = page.locator('xpath=//*[@id="fraud-cri-dev"]');
    this.fraudCRIStagingButton = page.locator(
      'xpath=//*[@id="fraud-cri-staging"]'
    );
    this.rowNumberInput = page.locator("#rowNumber");
    this.userNameInput = page.locator('xpath=//*[@id="name"]');

    this.goToFraudCriSearchButton = page.locator(
      '//*[@id="main-content"]/form[2]/div/button'
    );
    this.searchForUatUserButton = page.locator(
      '//*[@id="main-content"]/form[1]/div/button'
    );
  }

  async assertOnIpvCoreStubPage() {
    await expect(this.page).toHaveTitle(/IPV Core Stub/);
  }

  async clickVisitCredentialIssuers() {
    await this.visitCredentialIssuersButton.click();
  }

  async clickFraudCRIForEnvironment(environment) {
    switch (environment.toLowerCase()) {
      case "dev":
        await this.fraudCRIDevButton.click();
        break;
      case "build":
        await this.fraudCRIBuildButton.click();
        break;
      case "staging":
        await this.fraudCRIStagingButton.click();
        break;
      default:
        throw new Error(`Unsupported Fraud CRI environment: ${environment}`);
    }
  }

  async searchForUATUser(userNumber) {
    await expect(this.page).toHaveURL(/credential-issuer\?cri=fraud-cri/);

    await this.rowNumberInput.fill(userNumber);
    await this.goToFraudCriSearchButton.click();
  }

  async searchForUATUserByUserName(userName) {
    await expect(this.page).toHaveURL(/credential-issuer\?cri=fraud-cri/);

    await this.userNameInput.fill(userName);
    await this.searchForUatUserButton.click();
  }
};
