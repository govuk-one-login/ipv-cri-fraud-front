import { Given } from "@cucumber/cucumber";
import { RelyingPartyPage } from "../../pages/wiremock-pages/index.js";

Given(/^.* has started the Fraud Journey$/, async function () {
  const rpPage = new RelyingPartyPage(this.page);
  await rpPage.goto();
});
