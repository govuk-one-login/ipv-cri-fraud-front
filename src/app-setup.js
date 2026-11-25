import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { config } from "./lib/config.js";
import commonExpress from "@govuk-one-login/di-ipv-cri-common-express";
const { API, APP, LOG_LEVEL } = config;
import { setAPIConfig, setOAuthPaths } from "./lib/settings.js";
import * as sessionConfigService from "./session-config.js";
import { overloadProtectionConfigService } from "./overload-protection-config.js";

const setHeaders = commonExpress.lib.headers;
import { frontendVitalSignsInitFromApp } from "@govuk-one-login/frontend-vital-signs";


const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // g

const init = (app) => {
  setAPIConfig({
    app,
    baseUrl: API.BASE_URL,
    sessionPath: API.PATHS.SESSION,
    authorizationPath: API.PATHS.AUTHORIZATION
  });

  setOAuthPaths({ app, entryPointPath: APP.PATHS.FRAUD });

  commonExpress.lib.settings.setGTM({
    app,
    ga4ContainerId: APP.GTM.GA4_ID,
    uaContainerId: APP.GTM.UA_ID,
    analyticsCookieDomain: APP.GTM.ANALYTICS_COOKIE_DOMAIN,
    ga4Enabled: APP.GTM.GA4_ENABLED,
    uaEnabled: APP.GTM.UA_ENABLED,
    ga4PageViewEnabled: APP.GTM.GA4_PAGE_VIEW_ENABLED,
    ga4FormResponseEnabled: APP.GTM.GA4_FORM_RESPONSE_ENABLED,
    ga4FormErrorEnabled: APP.GTM.GA4_FORM_ERROR_ENABLED,
    ga4FormChangeEnabled: APP.GTM.GA4_FORM_CHANGE_ENABLED,
    ga4NavigationEnabled: APP.GTM.GA4_NAVIGATION_ENABLED,
    ga4SelectContentEnabled: APP.GTM.GA4_SELECT_CONTENT_ENABLED,
    analyticsDataSensitive: APP.GTM.ANALYTICS_DATA_SENSITIVE
  });

  commonExpress.lib.settings.setDeviceIntelligence({
    app,
    deviceIntelligenceEnabled: APP.DEVICE_INTELLIGENCE_ENABLED,
    deviceIntelligenceDomain: APP.DEVICE_INTELLIGENCE_DOMAIN
  });

  commonExpress.lib.settings.setLanguageToggle({
    app,
    showLanguageToggle: APP.LANGUAGE_TOGGLE_DISABLED === "true" ? "0" : "1"
  });
};

const create = (setup) => {
  const loggerConfig = {
    consoleLevel: LOG_LEVEL,
    console: true,
    consoleJSON: true,
    app: false
  };

  const sessionConfig = sessionConfigService.init();
  const overloadProtectionConfig = overloadProtectionConfigService();

  const { app, router } = setup({
    config: { APP_ROOT: __dirname },
    port: false,
    logs: loggerConfig,
    session: sessionConfig,
    helmet: commonExpress.lib.helmet,
    redis: sessionConfigService.isDynamo() ? false : commonExpress.lib.redis(),
    urls: {
      public: "/public",
      publicImages: "/public/images"
    },
    publicDirs: ["../dist/public"],
    publicImagesDirs: ["../dist/public/images"],
    views: [
      path.resolve(
        path.dirname(require.resolve("@govuk-one-login/di-ipv-cri-common-express")),
        "components"
      ),
      path.resolve("node_modules/@govuk-one-login/"),
      "views"
    ],
    middlewareSetupFn: (app) => {
      frontendVitalSignsInitFromApp(app, {
        interval: 60000,
        logLevel: "info",
        metrics: [
          "requestsPerSecond",
          "avgResponseTime",
          "maxConcurrentConnections",
          "eventLoopDelay",
          "eventLoopUtilization"
        ],
        staticPaths: [
          /^\/assets\/.*/,
          "/ga4-assets",
          "/javascript",
          "/javascripts",
          "/images",
          "/stylesheets"
        ]
      });
      app.use(setHeaders);
      commonExpress.lib.i18n.setI18n({
        router: app,
        config: {
          secure: true,
          cookieDomain: APP.GTM.ANALYTICS_COOKIE_DOMAIN
        }
      });
      app.use(commonExpress.lib.locals.getLanguageToggle);
    },
    overloadProtection: overloadProtectionConfig
  });

  return { app, router };
};

export { init, create };
