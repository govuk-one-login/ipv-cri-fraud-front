const AppSetup = require("./app-setup");

describe("app-setup", () => {
  beforeEach(() => {
    setGTM = sinon.stub();
    setAPIConfig = sinon.stub();
    setOAuthPaths = sinon.stub();
    app = {
      set: sinon.stub()
    };
    setup = sinon.stub();
  });

  describe("setup app", () => {
    it("should set GTM variables", () => {
      AppSetup.init(app);

      sinon.assert.calledWith(
        app.set,
        "APP.GTM.GA4_CONTAINER_ID",
        "GTM-XXXXXXX"
      );
      sinon.assert.calledWith(
        app.set,
        "APP.GTM.ANALYTICS_COOKIE_DOMAIN",
        "localhost"
      );
      sinon.assert.calledWith(app.set, "APP.GTM.UA_CONTAINER_ID", "UA-XXXXXXX");
      sinon.assert.calledWith(app.set, "APP.GTM.UA_DISABLED", true);
      sinon.assert.calledWith(app.set, "APP.GTM.GA4_DISABLED", false);
    });

    it("should set API config variables", () => {
      AppSetup.init(app);

      sinon.assert.calledWith(
        app.set,
        "API.BASE_URL",
        "http://localhost:5007/"
      );
      sinon.assert.calledWith(app.set, "API.PATHS.SESSION", "session");
      sinon.assert.calledWith(
        app.set,
        "API.PATHS.AUTHORIZATION",
        "authorization"
      );
    });

    it("should set Oauth paths", () => {
      AppSetup.init(app);

      sinon.assert.calledWith(app.set, "APP.PATHS.ENTRYPOINT", "/");
    });

    // it("should set session config", () => {
    //   const { app, router } = AppSetup.create();

    // sinon.assert.calledWith(setup);
    //
    //       sinon.assert.calledWith(
    //         app.set,
    //         "APP.GTM.GA4_CONTAINER_ID",
    //         "GTM-XXXXXXX"
    //       );
    //       sinon.assert.calledWith(
    //         app.set,
    //         "APP.GTM.ANALYTICS_COOKIE_DOMAIN",
    //         "localhost"
    //       );
    //       sinon.assert.calledWith(app.set, "APP.GTM.UA_CONTAINER_ID", "UA-XXXXXXX");
    //       sinon.assert.calledWith(app.set, "APP.GTM.UA_DISABLED", true);
    //       sinon.assert.calledWith(app.set, "APP.GTM.GA4_DISABLED", false);
    //     });
  });
});
