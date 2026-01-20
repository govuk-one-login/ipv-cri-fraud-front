const { Given } = require("@cucumber/cucumber");

const { RelyingPartyPage } = require("../pages");

Given(/^(.*) has started the Fraud Journey$/, async function (name) {
  this.user = this.allUsers[name];
  const rpPage = new RelyingPartyPage(this.page, this.wireMockBaseUrl);

  await rpPage.goto();
});

Given(
  "they have provided their details",
  { timeout: 10 * 1000 },
  async function () {}
);
