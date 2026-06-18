const { When, Then } = require("@cucumber/cucumber");
const { expect } = require("chai");
const axios = require("axios");
const ConfigurationReader = require("../../support/configuration-reader");

When("they reload the check page", async function () {
  await this.page.reload({ waitUntil: "domcontentloaded" });
});

Then(
  "the backend received the identity-check request with the session_id header",
  async function () {
    const baseUrl = ConfigurationReader.get("API_BASE_URL");
    const res = await axios.get(`${baseUrl}__admin/requests`);

    const identityCheckRequest = res.data.requests.find(
      (entry) =>
        entry.request.method === "POST" &&
        entry.request.url === "/identity-check"
    );

    expect(identityCheckRequest, "no POST /identity-check captured by wiremock")
      .to.exist;

    const headers = identityCheckRequest.request.headers || {};
    const sessionIdHeader = Object.keys(headers).find(
      (name) => name.toLowerCase() === "session_id"
    );

    expect(sessionIdHeader, "session_id header missing from /identity-check").to
      .exist;
    expect(headers[sessionIdHeader]).to.equal("ABADCAFE");
  }
);
