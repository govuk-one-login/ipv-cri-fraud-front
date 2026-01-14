const { expect } = require("@playwright/test");

module.exports = class IpvCoreStubPage {
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
    this.JsonResponseFromFraudCri = page.locator(
      'xpath=//*[@id="main-content"]/div/details/summary'
    );
    this.jsonDataElement = page.locator('xpath=//*[@id="data"]');
    this.userSearchGoToFraudCriButton = page
      .locator('xpath=//*[@id="main-content"]/table/tbody/tr/td[1]/p[1]/a')
      .or(page.locator('xpath=//*[@id="main-content"]/form/button'));
    this.userSearchEditUserButton = page.locator(
      'xpath=//*[@id="main-content"]/table/tbody/tr/td[1]/p[2]/a'
    );
  }

  async getVcPayload() {
    // Ensure the data element is present in the DOM first
    await this.jsonDataElement.waitFor({ state: "attached", timeout: 10000 });

    // If the data element is hidden (e.g. inside a collapsed <details>), open the summary
    if (!(await this.jsonDataElement.isVisible())) {
      try {
        // Try to click the visible summary element to expand the details
        if (await this.JsonResponseFromFraudCri.isVisible()) {
          await this.JsonResponseFromFraudCri.click();
        } else {
          // Fallback: attempt to click via DOM in case the summary locator is not visible
          await this.page.evaluate(() => {
            const summary = document.querySelector(
              "#main-content div details summary"
            );
            if (summary && typeof summary.click === "function") summary.click();
          });
        }
        // Wait until the json data becomes visible after expanding
        await this.jsonDataElement.waitFor({
          state: "visible",
          timeout: 10000
        });
      } catch (err) {
        // If we couldn't reveal the element, surface a helpful error
        throw new Error(
          `Failed to reveal JSON data element before reading it: ${err.message}`
        );
      }
    }

    const jsonString = (await this.jsonDataElement.textContent())?.trim();
    if (!jsonString) {
      throw new Error('No JSON content found in the data element ("#data").');
    }
    try {
      const parsed = JSON.parse(jsonString);
      return parsed; // callers can access parsed.vc, parsed.vc.evidence, etc.
    } catch (err) {
      throw new Error(
        `Failed to parse JSON from VC payload: ${err.message}\nContent: ${jsonString}`
      );
    }
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

  async assertUrlPathContains(path) {
    const escapeRegExp = (string) => {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    };
    const regex = new RegExp(escapeRegExp(path));
    await expect(this.page).toHaveURL(regex);
  }

  async verifyCurrentUrlContains(expectedSubstring, timeout = 40000) {
    await this.page.waitForURL(`**/*${expectedSubstring}*`, { timeout });

    const currentUrl = this.page.url();
    if (!currentUrl.includes(expectedSubstring)) {
      throw new Error(
        `Expected URL to contain "${expectedSubstring}", but found "${currentUrl}"`
      );
    }
  }

  async clickJsonResponseFromFraudCri() {
    const element = this.JsonResponseFromFraudCri;
    await element.waitFor({ state: "visible" });
    await element.click();
  }

  /**
   * Validates specific fields within the JSON response (VC) from Fraud CRI using Playwrights except asserstions.
   * This method assumes the JSON data is visible after clicking the summary element.
   *
   * @param {string} expectedGivenName - The expected GivenName.
   * @param {string} expectedFamilyName - The expected FamilyName.
   * @param {number} expectedIdentityFraudScore - The expected identityFraudScore (as a number).
   * @param {string|string[]} expectedCi - The expected 'ci' value(s). Can be an empty string (for empty array), a single string, or an array of strings.
   */
  async validateJsonResponseFromFraudCri(
    expectedGivenName,
    expectedFamilyName,
    expectedIdentityFraudScore,
    expectedCi
  ) {
    // Use the helper that ensures the element is attached and reveals it if hidden
    const parsedJson = await this.getVcPayload();

    // --- Extract values from the nested JSON structure ---
    const credentialSubjectName =
      parsedJson?.vc?.credentialSubject?.name?.[0]?.nameParts;
    if (!credentialSubjectName) {
      throw new Error(
        "Could not find vc.credentialSubject.name[0].nameParts in the JSON response. Check JSON structure."
      );
    }
    const actualGivenName = credentialSubjectName.find(
      (part) => part.type === "GivenName"
    )?.value;
    const actualFamilyName = credentialSubjectName.find(
      (part) => part.type === "FamilyName"
    )?.value;

    const evidence = parsedJson?.vc?.evidence?.[0];
    if (!evidence) {
      throw new Error(
        "Could not find vc.evidence[0] in the JSON response. Check JSON structure."
      );
    }
    const actualIdentityFraudScore = evidence.identityFraudScore;
    const actualCi = evidence.ci;

    expect(
      actualGivenName,
      `GivenName mismatch. Expected "${expectedGivenName}", but found "${actualGivenName}"`
    ).toEqual(expectedGivenName);

    expect(
      actualFamilyName,
      `FamilyName mismatch. Expected "${expectedFamilyName}", but found "${actualFamilyName}"`
    ).toEqual(expectedFamilyName);

    // allow MASKED to mean "existence/format check" instead of exact match
    const isMasked = (v) => !v || String(v).toUpperCase() === "MASKED";

    if (isMasked(expectedIdentityFraudScore)) {
      if (
        actualIdentityFraudScore === undefined ||
        actualIdentityFraudScore === null
      ) {
        throw new Error(
          "identityFraudScore is missing from the VC payload while examples expect it to be present (MASKED). JSON keys: " +
            JSON.stringify(Object.keys(evidence || {}))
        );
      }
      expect(String(actualIdentityFraudScore)).toMatch(
        /^\d+$/,
        "score should be numeric"
      );
    } else {
      expect(
        actualIdentityFraudScore,
        `identityFraudScore mismatch. Expected "${expectedIdentityFraudScore}", but found "${actualIdentityFraudScore}"`
      ).toEqual(expectedIdentityFraudScore);
    }

    if (isMasked(expectedCi)) {
      expect(actualCi).toBeDefined();
    } else if (expectedCi === "") {
      expect(actualCi).toEqual([]);
    } else if (Array.isArray(actualCi)) {
      if (typeof expectedCi === "string") {
        expect(actualCi).toContain(expectedCi);
      } else if (Array.isArray(expectedCi)) {
        expectedCi.forEach((val) => expect(actualCi).toContain(val));
      }
    } else if (typeof actualCi === "string") {
      expect(actualCi).toEqual(expectedCi);
    } else {
      throw new Error(
        `Unexpected type for 'ci' in JSON. Expected string or array, but found ${typeof actualCi} (${JSON.stringify(actualCi)}).`
      );
    }
  }

  async isCurrentPage() {
    return await this.page.locator('h1:has-text("IPV Core Stub")').isVisible();
  }

  async userSearchGoToFraudCri() {
    await this.userSearchGoToFraudCriButton.click();
  }

  async userSearchEditUser() {
    await this.userSearchEditUserButton.click();
  }

  /**
   * Extracts and validates VC payload against expected values using Chai assertions.
   * Logs the full JSON payload only on failure for debugging.
   *
   * @param {string} expectedGivenName - Expected given name
   * @param {string} expectedFamilyName - Expected family name
   * @param {string} expectedScore - Expected score (can be "MASKED" for existence check)
   * @param {string} expectedCi - Expected CI value (can be "MASKED", empty string, or specific value)
   * @param {Function} isMasked - Helper function to check if a value is masked
   * @param {Object} assert - Chai assert object
   */
  async validateVcCredentialSubject(
    expectedGivenName,
    expectedFamilyName,
    expectedScore,
    expectedCi,
    isMasked,
    assert
  ) {
    try {
      // Get the full parsed JSON payload
      const parsedJson = await this.getVcPayload();

      // Extract credential subject name parts (nested structure)
      const credentialSubjectName =
        parsedJson?.vc?.credentialSubject?.name?.[0]?.nameParts;
      if (!credentialSubjectName) {
        throw new Error(
          "Could not find vc.credentialSubject.name[0].nameParts in the JSON response."
        );
      }

      const actualGivenName = credentialSubjectName.find(
        (part) => part.type === "GivenName"
      )?.value;
      const actualFamilyName = credentialSubjectName.find(
        (part) => part.type === "FamilyName"
      )?.value;

      // Extract evidence (where identityFraudScore and ci are located)
      const evidence = parsedJson?.vc?.evidence?.[0];
      if (!evidence) {
        throw new Error("Could not find vc.evidence[0] in the JSON response.");
      }

      const actualScore = evidence.identityFraudScore;
      const actualCi = evidence.ci;

      // Validate names
      assert.strictEqual(
        actualGivenName,
        expectedGivenName,
        `GivenName mismatch`
      );
      assert.strictEqual(
        actualFamilyName,
        expectedFamilyName,
        `FamilyName mismatch`
      );

      // Validate score (with masked handling)
      if (isMasked(expectedScore)) {
        assert.isOk(
          actualScore !== undefined && actualScore !== null,
          "identityFraudScore should exist in the VC payload"
        );
        assert.match(String(actualScore), /^\d+$/, "score should be numeric");
      } else {
        assert.strictEqual(String(actualScore), String(expectedScore));
      }

      // Validate ci (with masked handling)
      if (isMasked(expectedCi)) {
        assert.isOk(actualCi !== undefined, "CI should exist");
      } else if (expectedCi === "") {
        assert.deepEqual(actualCi, [], "CI should be empty array");
      } else {
        assert.strictEqual(String(actualCi), String(expectedCi));
      }
    } catch (error) {
      // Log the full parsed JSON payload only when validation fails
      // eslint-disable-next-line no-console
      console.log(
        "VC validation failed. Full parsed JSON payload:",
        JSON.stringify(await this.getVcPayload(), null, 2)
      );
      throw error;
    }
  }
};
