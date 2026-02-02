const { expect } = require("@playwright/test");

module.exports = class IpvCoreStubVerfiyVcPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    // Selectors for elements on the IPV Core Stub page
    this.JsonResponseFromFraudCri = page.locator(
      'xpath=//*[@id="main-content"]/div/details/summary'
    );
    this.jsonDataElement = page.locator('xpath=//*[@id="data"]');
  }

  async ensureJsonDataElementAvailable() {
    try {
      if (await this.JsonResponseFromFraudCri.isVisible()) {
        await this.JsonResponseFromFraudCri.click();
      } else {
        await this.page.evaluate(() => {
          const summary = document.querySelector(
            "#main-content div details summary"
          );
          if (summary && typeof summary.click === "function") {
            summary.click();
          }
        });
      }
    } catch (err) {
      throw new Error(
        `Failed to reveal JSON data element before reading it: ${err.message}`,
        { cause: err }
      );
    }
  }

  async readVcPayload() {
    await this.ensureJsonDataElementAvailable();

    const jsonString = (await this.jsonDataElement.textContent())?.trim();
    if (!jsonString) {
      const currentUrl = this.page.url();
      const elementExists = (await this.jsonDataElement.count()) > 0;
      throw new Error(
        `No JSON content found in the data element ("#data"). ` +
          `Element exists: ${elementExists}, Current URL: ${currentUrl}`
      );
    }
    try {
      const parsed = JSON.parse(jsonString);
      return parsed;
    } catch (err) {
      throw new Error(
        `Failed to parse JSON from VC payload: ${err.message}\nContent: ${jsonString}`
      );
    }
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

  /**
   * Extracts name parts from the VC credential subject
   * @param {Object} parsedJson - The parsed VC JSON
   * @returns {Object} Object containing actualGivenName and actualFamilyName
   */
  extractNameParts(parsedJson) {
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

    return { actualGivenName, actualFamilyName };
  }

  /**
   * Extracts evidence data from the VC
   * @param {Object} parsedJson - The parsed VC JSON
   * @returns {Object} The evidence object
   */
  extractEvidence(parsedJson) {
    const evidence = parsedJson?.vc?.evidence?.[0];
    if (!evidence) {
      throw new Error(
        "Could not find vc.evidence[0] in the JSON response. Check JSON structure."
      );
    }
    return evidence;
  }

  /**
   * Validates name fields against expected values
   * @param {string} actualGivenName - Actual given name from VC
   * @param {string} actualFamilyName - Actual family name from VC
   * @param {string} expectedGivenName - Expected given name
   * @param {string} expectedFamilyName - Expected family name
   */
  validateNames(
    actualGivenName,
    actualFamilyName,
    expectedGivenName,
    expectedFamilyName
  ) {
    expect(
      actualGivenName,
      `GivenName mismatch. Expected "${expectedGivenName}", but found "${actualGivenName}"`
    ).toEqual(expectedGivenName);
    expect(
      actualFamilyName,
      `FamilyName mismatch. Expected "${expectedFamilyName}", but found "${actualFamilyName}"`
    ).toEqual(expectedFamilyName);
  }

  /**
   * Validates identity fraud score against expected value
   * @param {number} actualScore - Actual score from VC
   * @param {number|string} expectedScore - Expected score
   * @param {Object} evidence - Evidence object for error context
   */
  validateIdentityFraudScore(actualScore, expectedScore, evidence) {
    const isMasked = (v) => !v || String(v).toUpperCase() === "MASKED";

    if (isMasked(expectedScore)) {
      if (actualScore === undefined || actualScore === null) {
        throw new Error(
          "identityFraudScore is missing from the VC payload while examples expect it to be present (MASKED). JSON keys: " +
            JSON.stringify(Object.keys(evidence || {}))
        );
      }
      expect(String(actualScore)).toMatch(/^\d+$/, "score should be numeric");
    } else {
      expect(
        actualScore,
        `identityFraudScore mismatch. Expected "${expectedScore}", but found "${actualScore}"`
      ).toEqual(Number(expectedScore));
    }
  }

  /**
   * Validates CI field against expected value
   * @param {string|string[]} actualCi - Actual CI from VC
   * @param {string|string[]} expectedCi - Expected CI value(s)
   */
  validateCi(actualCi, expectedCi) {
    const isMasked = (v) => !v || String(v).toUpperCase() === "MASKED";

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

  /**
   * Validates specific fields within the JSON response (VC) from Fraud CRI using Playwright expect assertions.
   * @param {string} expectedGivenName - The expected GivenName
   * @param {string} expectedFamilyName - The expected FamilyName
   * @param {number} expectedIdentityFraudScore - The expected identityFraudScore
   * @param {string|string[]} expectedCi - The expected 'ci' value(s)
   */
  async validateJsonResponseFromFraudCri(
    expectedGivenName,
    expectedFamilyName,
    expectedIdentityFraudScore,
    expectedCi
  ) {
    const parsedJson = await this.readVcPayload();

    const { actualGivenName, actualFamilyName } =
      this.extractNameParts(parsedJson);

    const evidence = this.extractEvidence(parsedJson);
    const actualIdentityFraudScore = evidence.identityFraudScore;
    const actualCi = evidence.ci;

    this.validateNames(
      actualGivenName,
      actualFamilyName,
      expectedGivenName,
      expectedFamilyName
    );
    this.validateIdentityFraudScore(
      actualIdentityFraudScore,
      expectedIdentityFraudScore,
      evidence
    );
    this.validateCi(actualCi, expectedCi);
  }

  /**
   * Validates names using Chai assertions
   * @param {string} actualGivenName - Actual given name from VC
   * @param {string} actualFamilyName - Actual family name from VC
   * @param {string} expectedGivenName - Expected given name
   * @param {string} expectedFamilyName - Expected family name
   * @param {Object} assert - Chai assert object
   */
  validateNamesWithChai(
    actualGivenName,
    actualFamilyName,
    expectedGivenName,
    expectedFamilyName,
    assert
  ) {
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
  }

  /**
   * Validates identity fraud score using Chai assertions
   * @param {number} actualScore - Actual score from VC
   * @param {string} expectedScore - Expected score
   * @param {Function} isMasked - Helper function to check if value is masked
   * @param {Object} assert - Chai assert object
   */
  validateScoreWithChai(actualScore, expectedScore, isMasked, assert) {
    if (isMasked(expectedScore)) {
      assert.isOk(
        actualScore !== undefined && actualScore !== null,
        "identityFraudScore should exist in the VC payload"
      );
      assert.match(String(actualScore), /^\d+$/, "score should be numeric");
    } else {
      assert.strictEqual(String(actualScore), String(expectedScore));
    }
  }

  /**
   * Validates CI field using Chai assertions
   * @param {string|string[]} actualCi - Actual CI from VC
   * @param {string} expectedCi - Expected CI value
   * @param {Function} isMasked - Helper function to check if value is masked
   * @param {Object} assert - Chai assert object
   */
  validateCiWithChai(actualCi, expectedCi, isMasked, assert) {
    if (isMasked(expectedCi)) {
      assert.isOk(actualCi !== undefined, "CI should exist");
    } else if (expectedCi === "") {
      assert.deepEqual(actualCi, [], "CI should be empty array");
    } else {
      assert.strictEqual(String(actualCi), String(expectedCi));
    }
  }

  /**
   * Extracts and validates VC payload against expected values using Chai assertions.
   * @param {string} expectedGivenName - Expected given name
   * @param {string} expectedFamilyName - Expected family name
   * @param {string} expectedScore - Expected score
   * @param {string} expectedCi - Expected CI value
   * @param {Function} isMasked - Helper function to check if value is masked
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
      const parsedJson = await this.readVcPayload();
      const { actualGivenName, actualFamilyName } =
        this.extractNameParts(parsedJson);
      const evidence = this.extractEvidence(parsedJson);
      const actualScore = evidence.identityFraudScore;
      const actualCi = evidence.ci;

      this.validateNamesWithChai(
        actualGivenName,
        actualFamilyName,
        expectedGivenName,
        expectedFamilyName,
        assert
      );
      this.validateScoreWithChai(actualScore, expectedScore, isMasked, assert);
      this.validateCiWithChai(actualCi, expectedCi, isMasked, assert);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(
        "VC validation failed. Full parsed JSON payload:",
        JSON.stringify(await this.readVcPayload(), null, 2)
      );
      throw error;
    }
  }
};
