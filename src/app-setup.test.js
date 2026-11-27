import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import * as appSetup from "./app-setup.js";
import path from "node:path";
import * as sessionConfigService from "./session-config.js";
import commonExpress from "@govuk-one-login/di-ipv-cri-common-express";
import { overloadProtectionConfigService } from "./overload-protection-config.js";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // g

describe("app-setup", () => {
  let app;
  let router;
  let setup;
  let isDynamoBool;
  let sessionConfigMap;

  beforeEach(() => {
    app = {
      set: vi.fn(),
      use: vi.fn()
    };
    router = {
      use: vi.fn()
    };
    setup = vi.fn();
    setup.mockReturnValue({ app, router });

    isDynamoBool = Boolean(true);
    sessionConfigMap = vi.fn();

    vi.spyOn(sessionConfigService, "init").mockReturnValue({
      cookieName: "service_session",
      secret: 1234,
      cookieOptions: { maxAge: 7200000 },
      ...("table-name" && { sessionStore: {} })
    });
    vi.spyOn(sessionConfigService, "isDynamo").mockReturnValue(isDynamoBool);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("setup app", () => {
    it("should set GTM variables", () => {
      appSetup.init(app);

      expect(app.set).toHaveBeenCalledWith(
        "APP.GTM.GA4_CONTAINER_ID",
        "GTM-XXXXXXX"
      );
      expect(app.set).toHaveBeenCalledWith(
        "APP.GTM.ANALYTICS_COOKIE_DOMAIN",
        "localhost"
      );
      expect(app.set).toHaveBeenCalledWith(
        "APP.GTM.UA_CONTAINER_ID",
        "UA-XXXXXXX"
      );
      expect(app.set).toHaveBeenCalledWith("APP.GTM.UA_ENABLED", false);
      expect(app.set).toHaveBeenCalledWith("APP.GTM.GA4_ENABLED", true);
    });

    it("should set Device Intelligence  variables", () => {
      appSetup.init(app);

      expect(app.set).calledWith("APP.DEVICE_INTELLIGENCE_ENABLED", false);
      expect(app.set).calledWith("APP.DEVICE_INTELLIGENCE_DOMAIN", "localhost");
    });

    it("should set API config variables", () => {
      appSetup.init(app);

      expect(app.set).calledWith("API.BASE_URL", "http://localhost:5007");
      expect(app.set).calledWith("API.PATHS.SESSION", "/session");
      expect(app.set).calledWith("API.PATHS.AUTHORIZATION", "/authorization");
    });

    it("should set Oauth paths", () => {
      appSetup.init(app);

      expect(app.set).calledWith("APP.PATHS.ENTRYPOINT", "/");
    });

    it("should set application config", () => {
      appSetup.create(setup);

      const loggerConfig = {
        consoleLevel: "request",
        console: true,
        consoleJSON: true,
        app: false
      };

      const options = {
        config: { APP_ROOT: __dirname },
        port: false,
        logs: loggerConfig,
        session: {
          cookieName: "service_session",
          secret: 1234,
          cookieOptions: { maxAge: 7200000 },
          ...("table-name" && { sessionStore: {} })
        },
        helmet: commonExpress.lib.helmet,
        redis: isDynamoBool ? false : commonExpress.lib.redis(),
        urls: {
          public: "/public",
          publicImages: "/public/images"
        },
        publicDirs: ["../dist/public"],
        publicImagesDirs: ["../dist/public/images"],
        views: [
          path.resolve(
            path.dirname(
              require.resolve("@govuk-one-login/di-ipv-cri-common-express")
            ),
            "components"
          ),
          path.resolve("node_modules/@govuk-one-login/"),
          "views"
        ],
        middlewareSetupFn: expect.any(Function),
        overloadProtection: overloadProtectionConfigService()
      };

      expect(setup).toHaveBeenCalledOnce();
      expect(setup).toHaveBeenCalledWith(options);
    });

    it("should set up i18next at app level in middlewareSetupFn", () => {
      const setI18n = vi.spyOn(commonExpress.lib.i18n, "setI18n");

      appSetup.create(setup);

      const [{ middlewareSetupFn }] = setup.mock.calls[0];
      middlewareSetupFn(app);

      expect(setI18n).toHaveBeenCalledWith(
        expect.objectContaining({
          router: app,
          config: { secure: true, cookieDomain: "localhost" }
        })
      );
    });

    it("should set language toggle locals after i18next in middlewareSetupFn", () => {
      const setI18n = vi.spyOn(commonExpress.lib.i18n, "setI18n");

      appSetup.create(setup);
      const [{ middlewareSetupFn }] = setup.mock.calls[0];
      middlewareSetupFn(app);

      expect(app.use).toHaveBeenCalledWith(
        commonExpress.lib.locals.getLanguageToggle
      );

      const toggleCall = app.use.mock.calls.findIndex(
        ([arg]) => arg === commonExpress.lib.locals.getLanguageToggle
      );

      expect(app.use).toHaveBeenCalledWith(
        commonExpress.lib.locals.getLanguageToggle
      );
      expect(setI18n.mock.invocationCallOrder[0]).toBeLessThan(
        app.use.mock.invocationCallOrder[toggleCall]
      );
    });
  });
});
