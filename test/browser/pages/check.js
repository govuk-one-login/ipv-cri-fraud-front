module.exports = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.url = "http://localhost:5040/check";
  }

  isCurrentPage() {
    return this.page.url() === this.url;
  }

  async continue() {
    await this.page.click("button");
  }
};
