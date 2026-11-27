import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import {
  findWiremockRequest,
  getHeaderCaseInsensitive
} from "../../support/wiremock-assertions.js";

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

    expect(
      entry,
      "expected wiremock to have captured a POST /identity-check"
    ).toBeTruthy();

    const sessionId = getHeaderCaseInsensitive(
      entry.request.headers,
      "session_id"
    );
    expect(
      sessionId,
      "expected session_id header on /identity-check to equal ABADCAFE"
    ).toBe("ABADCAFE");
  }
);

Then(
  "the backend received the identity-check request with the txma-audit-encoded header",
  async function () {
    const entry = await findWiremockRequest({
      method: "POST",
      url: "/identity-check"
    });

    expect(
      entry,
      "expected wiremock to have captured a POST /identity-check"
    ).toBeTruthy();

    const txma = getHeaderCaseInsensitive(
      entry.request.headers,
      "txma-audit-encoded"
    );
    expect(
      txma,
      `expected txma-audit-encoded header on /identity-check to equal ${this.testTxmaAuditEncoded}`
    ).toBe(this.testTxmaAuditEncoded);
  }
);
