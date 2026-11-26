import { Then } from "@cucumber/cucumber";
import { UniversalPage } from "../../pages/wiremock-pages/index.js";

Then(
  "I add a cookie to change the language to Welsh",
  { timeout: 2 * 5000 },
  async function () {
    const universalSteps = new UniversalPage(this.page, this.page.url());
    await universalSteps.changeLanguageTo("Welsh");
  }
);
