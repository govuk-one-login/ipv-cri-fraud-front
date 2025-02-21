module.exports = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  getSomethingWentWrongMessage() {
    return "Sorry, there is a problem – GOV.UK One Login";
  }

  getErrorTitle() {
    return this.page.title();
  }

  isCurrentPage() {
    return this.page.url() === this.url;
  }
};
