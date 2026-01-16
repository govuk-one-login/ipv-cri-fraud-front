const {
  Before,
  BeforeAll,
  AfterAll,
  After,
  setDefaultTimeout
} = require("@cucumber/cucumber");
const { chromium } = require("@playwright/test");
const axios = require("axios");
const { GenericContainer, Wait } = require("testcontainers");
const waitOn = require("wait-on");
const util = require("util");

const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

setDefaultTimeout(120000);

const APP_LOGS_ENABLED = false;
const PROJECT_ROOT = process.cwd();
let dynamoContainer;
let wireMockContainer;
let appProcess;

BeforeAll(async function () {
  if (!process.env.DOCKER_HOST) {
    const dockerSockets = [
      "/var/run/docker.sock",
      `${process.env.HOME}/.orbstack/run/docker.sock`,
      `${process.env.HOME}/.docker/run/docker.sock`
    ];

    for (const socket of dockerSockets) {
      if (fs.existsSync(socket)) {
        process.env.DOCKER_HOST = `unix://${socket}`;
        console.log(`[SYSTEM] using Docker socket: ${socket}`);
        break;
      }
    }
  }

  console.log("[SYSTEM] starting DynamoDB container...");
  dynamoContainer = await new GenericContainer("amazon/dynamodb-local:latest")
    .withExposedPorts(8000)
    .withCommand(["-jar", "DynamoDBLocal.jar", "-sharedDb", "-inMemory"])
    .start();

  const dynamoPort = dynamoContainer.getMappedPort(8000);
  console.log(`[SYSTEM] DynamoDB container started on port ${dynamoPort}`);

  console.log("[SYSTEM] starting WireMock container...");
  wireMockContainer = await new GenericContainer("wiremock/wiremock:3.13.1")
    .withExposedPorts(8080)
    .withCommand(["--local-response-templating"])
    .withWaitStrategy(Wait.forHttp("/__admin/mappings", 8080))
    .withCopyDirectoriesToContainer([
      {
        source: path.resolve(PROJECT_ROOT, "test/mocks/mappings"),
        target: "/home/wiremock/mappings"
      }
    ])
    .start();

  const wireMockPort = wireMockContainer.getMappedPort(8080);
  console.log(`[SYSTEM] WireMock container started on port ${wireMockPort}`);

  // store wiremock url globally so it can be read in cucumber steps
  global.wireMockBaseUrl = `http://localhost:${wireMockPort}`;

  process.env.API_BASE_URL = `${global.wireMockBaseUrl}/`;
  process.env.LOCAL_DYNAMO_ENDPOINT_OVERRIDE = `http://localhost:${dynamoPort}`;

  console.log("[SYSTEM] starting app");
  appProcess = spawn("node", ["src/app.js"], {
    cwd: PROJECT_ROOT,
    env: {
      ...process.env,
      MAY_2025_REBRAND_ENABLED: "true",
      DEVICE_INTELLIGENCE_ENABLED: "true",
      SESSION_TABLE_NAME: "cri-fraud-front-sessions-test",
      SESSION_SECRET: "test-secret", // pragma: allowlist secret
      NODE_ENV: "development"
    }
  });

  if (APP_LOGS_ENABLED) {
    appProcess.stdout.on("data", logsPrettifier);
    appProcess.stderr.on("data", logsPrettifier);
  }

  console.log("[SYSTEM] waiting for app to be ready...");
  await util.promisify(waitOn)({
    resources: ["tcp:localhost:5030"],
    timeout: 30000,
    delay: 2000
  });

  console.log("[SYSTEM] ready");

  console.log("[SYSTEM] starting browser...");
  if (process.env.BROWSER === "chrome-headless") {
    global.browser = await chromium.launch({
      headless: true
    });
  } else {
    global.browser = await chromium.launch({
      headless: false,
      slowMo: 500
    });
  }
});

AfterAll(async function () {
  console.log("\n[SYSTEM] closing browser...");
  await global.browser.close();

  if (appProcess) {
    console.log("[SYSTEM] stopping app...");
    appProcess.kill("SIGINT"); // interrupt not terminate (prevents graceful shutdown)
  }

  if (wireMockContainer) {
    console.log("[SYSTEM] stopping WireMock container...");
    await wireMockContainer.stop();
  }

  if (dynamoContainer) {
    console.log("[SYSTEM] stopping DynamoDB container...");
    await dynamoContainer.stop();
  }
});

// Add scenario header
Before(async function ({ pickle } = {}) {
  console.log(`\nSCENARIO: ${pickle.name}`);
  const tags = pickle.tags || [];
  const tag = tags.find((tag) => tag.name.startsWith("@mock-api:"));

  if (!tag) {
    return;
  }

  const header = tag?.name.substring(10);
  if (!header) {
    return;
  }

  this.SCENARIO_ID_HEADER = header;

  const url = process.env.API_BASE_URL + `__reset/${header}`;

  try {
    await axios.get(url);
  } catch (e) {
    console.log(`Error fetching ${url}`);
    console.log(`${e.message}`);
  }
});

// Create a new test context and page per scenario
Before(async function () {
  this.context = await global.browser.newContext({});

  if (this.SCENARIO_ID_HEADER) {
    await this.context.setExtraHTTPHeaders({
      "x-scenario-id": this.SCENARIO_ID_HEADER
    });
  }

  this.page = await this.context.newPage();
  this.wireMockBaseUrl = global.wireMockBaseUrl;
});

After(async function () {
  await this.page.close();
  await this.context.close();
});

const logsPrettifier = (data) => {
  const rawString = data.toString().trim();
  if (!rawString) return;

  try {
    const jsonObject = JSON.parse(rawString);

    const isError = jsonObject.level === "ERROR";

    const header = isError
      ? "[App \x1b[31mERROR\x1b[0m]"
      : "[App \x1b[36mREQUEST\x1b[0m]";

    console.log(header);
    console.log(
      util.inspect(jsonObject, { colors: true, depth: null, compact: false })
    );
  } catch {
    console.log(`[App]: ${rawString}`);
  }
};
