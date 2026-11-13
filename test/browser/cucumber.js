const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");

try {
  process.loadEnvFile(path.join(repoRoot, ".env"));
  console.log(`🚨 local .env loaded: ${path.join(repoRoot, ".env")}`);
} catch {}

const PROGRESS = "progress";

const commonSupport = ["./test/browser/support/**/*.js"];
const commonWiremockSteps = [
  "./test/browser/step-definitions/wiremock-steps/**/*.js"
];
const commonStubSteps = ["./test/browser/step-definitions/stub-steps/**/*.js"];

const makeReportPath = (name) =>
  path.relative(process.cwd(), path.join(repoRoot, "reports", name));

module.exports = {
  default: {
    paths: [
      "./test/browser/features/wiremock-features/**/*.feature",
      "./test/browser/features/stub-features/**/*.feature"
    ],
    require: [...commonSupport, ...commonWiremockSteps, ...commonStubSteps],
    format: [
      PROGRESS,
      `json:${makeReportPath("cucumber-report.json")}`,
      `html:${makeReportPath("index.html")}`
    ]
  },

  core_stub: {
    paths: ["./test/browser/features/stub-features/**/*.feature"],
    require: [
      "./test/browser/support/setup.js",
      "./test/browser/step-definitions/stub-steps/**/*.js"
    ],
    format: [
      PROGRESS,
      `json:${makeReportPath("cucumber-stub-report.json")}`,
      `html:${makeReportPath("stub-index.html")}`
    ]
  },

  wiremock_tests: {
    paths: ["./test/browser/features/wiremock-features/**/*.feature"],
    require: [
      ...commonSupport,
      ...commonWiremockSteps,
      "./test/browser/local-app.js"
    ],
    format: [
      PROGRESS,
      `json:${makeReportPath("cucumber-wiremock-report.json")}`,
      `html:${makeReportPath("wiremock-index.html")}`
    ]
  }
};
