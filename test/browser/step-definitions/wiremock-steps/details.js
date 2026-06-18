const { Given } = require("@cucumber/cucumber");
const { RelyingPartyPage } = require("../../pages/wiremock-pages");

Given(/^.* has started the Fraud Journey$/, async function () {
  const rpPage = new RelyingPartyPage(this.page);
  await rpPage.goto();
});
