exports.UniversalSteps = class PlaywrightDevPage {
  constructor(page, url) {
    this.page = page;
    this.url = url;
  }

  async changeLanguageTo(language) {
    var languageIsoCode = "eng";
    if (language === "Welsh") {
      languageIsoCode = "cy";
    }
    await this.page.goto(this.page.url() + "?lang=" + languageIsoCode);
  }
};
