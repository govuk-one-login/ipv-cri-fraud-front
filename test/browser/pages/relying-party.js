module.exports = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   * @param {string} wireMockBaseUrl - Dynamic WireMock base URL (e.g., http://localhost:32963)
   */
  constructor(page, wireMockBaseUrl) {
    this.page = page;
    this.wireMockBaseUrl = wireMockBaseUrl;
  }

  async goto() {
    const params = new URLSearchParams({
      request: "lorem",
      client_id: "standalone"
    });

    this.startingUrl = `http://localhost:5030/oauth2/authorize?${params}`;

    await this.page.goto(this.startingUrl, {
      waitUntil: "networkidle"
    });
  }

  async gotoWithFeatureSet(featureSet) {
    const params = new URLSearchParams({
      request: "lorem",
      client_id: "standalone",
      featureSet: featureSet
    });

    this.startingUrl = `http://localhost:5030/oauth2/authorize?${params}`;

    await this.page.goto(this.startingUrl, {
      waitUntil: "networkidle"
    });
  }

  isRelyingPartyServer() {
    const expectedOrigin = new URL(this.wireMockBaseUrl).origin;
    return new URL(this.page.url()).origin === expectedOrigin;
  }

  hasSuccessQueryParams() {
    const { searchParams } = new URL(this.page.url());

    return (
      searchParams.get("client_id") === "standalone" &&
      searchParams.get("state") === "sT@t3" &&
      searchParams.get("code") === "FACEFEED"
    );
  }

  hasErrorQueryParams() {
    const { searchParams } = new URL(this.page.url());

    return (
      searchParams.get("error") === "server_error" &&
      searchParams.get("error_description") === "general error"
    );
  }
};
