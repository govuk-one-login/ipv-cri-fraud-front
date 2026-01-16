require("express");
require("express-async-errors");
const {
  PORT,
  LOG_LEVEL,
  API: { PACKAGE_NAME }
} = require("./lib/config");

// do this before anything else to avoid late initialization warnings
const hmpoLogger = require("hmpo-logger");
hmpoLogger.config({
  console: true,
  consoleJSON: true,
  consoleLevel: LOG_LEVEL,
  app: false
});

const logger = hmpoLogger.get(PACKAGE_NAME);

const { setup } =
  require("@govuk-one-login/di-ipv-cri-common-express").bootstrap;
const addLanguageParam = require("@govuk-one-login/frontend-language-toggle/build/cjs/language-param-setter.cjs");

const RoutingService = require("./router");
const AppSetup = require("./app-setup");

const { app, router } = AppSetup.create(setup);

app.get("nunjucks").addGlobal("getContext", function () {
  return {
    keys: Object.keys(this.ctx),
    ctx: this.ctx.ctx
  };
});
app.get("nunjucks").addGlobal("addLanguageParam", addLanguageParam);

AppSetup.init(app, router);
RoutingService.init(router);

const server = app.listen(PORT);

// AWS recommends the keep-alive duration of the target is longer than the idle timeout value of the load balancer (default 60s)
// to prevent possible 502 errors where the target connection has already been closed
// https://docs.aws.amazon.com/elast
server.keepAliveTimeout = 65000;

let serverAlreadyExiting = false;
let exitCode = 0;
const MAX_EXIT_WAIT = 30000;

process.on("SIGTERM", () => {
  if (serverAlreadyExiting) {
    logger.request("SIGTERM signal received: Server close already called");
    return;
  }
  serverAlreadyExiting = true;

  logger.request("SIGTERM signal received: closing HTTP server");

  server.close((err) => {
    if (err) {
      logger.error(
        `Error while calling server.close() occurred: ${err.message}`
      );

      exitCode = 1;
    } else {
      logger.request("HTTP server closed");
    }
  });

  setTimeout(() => {
    logger.request(`Waiting ${MAX_EXIT_WAIT}ms for before exiting fully`);
    server.closeAllConnections();
    logger.request(`Calling process exit ${exitCode}`);
    process.exit(exitCode);
  }, MAX_EXIT_WAIT);
});
