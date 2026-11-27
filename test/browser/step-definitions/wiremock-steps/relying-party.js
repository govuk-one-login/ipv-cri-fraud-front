import { Then } from "@cucumber/cucumber";
import { RelyingPartyPage } from "../../pages/wiremock-pages/index.js";
import { expect } from "@playwright/test";

Then("they should be redirected as a success", function () {
  const rpPage = new RelyingPartyPage(this.page);
  expect(rpPage.isRelyingPartyServer()).toBe(true);
  expect(rpPage.hasSuccessQueryParams()).toBe(true);
});

Then("they should be redirected as an error", function () {
  const rpPage = new RelyingPartyPage(this.page);
  expect(rpPage.isRelyingPartyServer()).toBe(true);
  expect(rpPage.hasErrorQueryParams()).toBe(true);
});
