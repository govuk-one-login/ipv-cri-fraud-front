const { When, Then } = require("@cucumber/cucumber");
const { expect } = require("chai");
const {
  findWiremockRequest,
  getHeaderCaseInsensitive
} = require("../../support/wiremock-assertions");

When("they reload the check page", async function () {
  await this.page.reload({ waitUntil: "domcontentloaded" });
});

Then(
  "the backend received the identity-check request with the session_id header",
  async function () {
    const entry = await findWiremockRequest({
      method: "POST",
      url: "/identity-check"
    });

    expect(entry, "expected wiremock to have captured a POST /identity-check")
      .to.exist;

    const sessionId = getHeaderCaseInsensitive(
      entry.request.headers,
      "session_id"
    );
    expect(
      sessionId,
      "expected session_id header on /identity-check to equal ABADCAFE"
    ).to.equal("ABADCAFE");
  }
);

Then(
  "the backend received the identity-check request with the txma-audit-encoded header",
  async function () {
    const entry = await findWiremockRequest({
      method: "POST",
      url: "/identity-check"
    });

    expect(entry, "expected wiremock to have captured a POST /identity-check")
      .to.exist;

    const txma = getHeaderCaseInsensitive(
      entry.request.headers,
      "txma-audit-encoded"
    );
    expect(
      txma,
      `expected txma-audit-encoded header on /identity-check to equal ${this.testTxmaAuditEncoded}`
    ).to.equal(this.testTxmaAuditEncoded);
  }
);
