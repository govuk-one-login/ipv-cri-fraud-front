module.exports = {
  default: {
    publishQuiet: true,
    paths: ["./test/browser/features/**/**.feature"],
    require: [
      "./test/browser/support/**/*.js",
      "./test/browser/step_definitions/**/*.js"
    ],
    format: [
      "progress",
      "json:reports/cucumber-report.json",
      "html:reports/index.html"
    ]
  }
};
