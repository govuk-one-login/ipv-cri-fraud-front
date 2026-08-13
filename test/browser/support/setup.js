const {
  Before,
  BeforeAll,
  AfterAll,
  After,
  setDefaultTimeout
} = require("@cucumber/cucumber");
const { chromium } = require("@playwright/test");
const ConfigurationReader = require("./configuration-reader");

setDefaultTimeout(60 * 1000);

BeforeAll(async function () {
  // Log environment at start of test execution (only for stub tests)
  if (
    process.env.TEST_TYPE === "stub" ||
    process.argv.some((arg) => arg.includes("stub"))
  ) {
    try {
      const testEnvironment = ConfigurationReader.get("ENVIRONMENT");
      console.log(`Running tests for environment: ${testEnvironment}`);
    } catch {
      console.log("ENVIRONMENT not configured");
    }
  }

  // Browsers are expensive in Playwright so only create 1

  if (process.env.BROWSER === "chrome-headless") {
    global.browser = await chromium.launch({
      headless: true
    });
  } else {
    global.browser = await chromium.launch({
      headless: true,
      slowMo: 0 // ms
    });
  }
});

AfterAll(async function () {
  await globalThis.browser.close();
});

// Add scenario header
Before(async function ({ pickle } = {}) {
  const tags = pickle.tags || [];

  // Determine if this is a stub test based on the tag @stub-test
  this.isStubTest = tags.find((tag) => tag.name === "@stub-test");

  console.log(`\nRunning: ${pickle.name}`);

  // Existing logic for WireMock scenario header and reset
  const mockApiTag = tags.find((tag) => tag.name.startsWith("@mock-api:"));
  if (mockApiTag) {
    this.SCENARIO_ID_HEADER = mockApiTag.name.substring(10);
    if (this.SCENARIO_ID_HEADER && ConfigurationReader.get("API_BASE_URL")) {
      const url = new URL(
        `/__reset/${this.SCENARIO_ID_HEADER}`,
        ConfigurationReader.get("API_BASE_URL")
      );
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Fetch failed with status ${response.status}`);
        }
      } catch (error) {
        console.log(`Warning: Failed to reset mock API: ${error.message}`);
      }
    }
  }
});

// Create a new test context and page per scenario
Before(async function () {
  const contextOptions = {};

  // If it's a stub test, set the baseURL from CORE_STUB_URL
  if (this.isStubTest && ConfigurationReader.get("CORE_STUB_URL")) {
    contextOptions.baseURL = ConfigurationReader.get("CORE_STUB_URL");
  } else if (ConfigurationReader.get("API_BASE_URL")) {
    contextOptions.baseURL = ConfigurationReader.get("API_BASE_URL");
  }

  if (this.SCENARIO_ID_HEADER) {
    this.testTxmaAuditEncoded = "test-txma-audit-encoded-value";
    contextOptions.extraHTTPHeaders = {
      "x-scenario-id": this.SCENARIO_ID_HEADER,
      "txma-audit-encoded": this.testTxmaAuditEncoded
    };
  }

  this.context = await globalThis.browser.newContext(contextOptions);
  this.page = await this.context.newPage();
});

// Cleanup after each scenario
After(async function () {
  await this.page.close();
  await this.context.close();
});
