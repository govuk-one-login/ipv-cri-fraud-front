// const router = require("./router");
//
// const commonExpress = require("@govuk-one-login/di-ipv-cri-common-express");
//
// // const {
// //   API,
// //   APP
// // } = require("./lib/config");
//
// describe("app-setup", () => {
//   beforeEach(() => {
//     getGTM = sinon.stub();
//     setScenarioHeaders = sinon.stub();
//     setAxiosDefaults = sinon.stub();
//     app = {
//       set: sinon.stub()
//     };
//   });
//
//   describe("setup app", () => {
//     it("should get GTM", () => {
//       router.init(app);
//
//       expect(getGTM);
//
//       sinon.assert.calledWith(app.get, "GTM");
// sinon.assert.calledWith(app.set, "APP.GTM.ANALYTICS_COOKIE_DOMAIN", "localhost");
// sinon.assert.calledWith(app.set, "APP.GTM.UA_CONTAINER_ID", "UA-XXXXXXX");
// sinon.assert.calledWith(app.set, "APP.GTM.UA_DISABLED", true);
// sinon.assert.calledWith(app.set, "APP.GTM.GA4_DISABLED", false);
// });

// it("should set API config variables", () => {
//   AppSetup.init(app);
//
//   sinon.assert.calledWith(app.set, "API.BASE_URL", "http://localhost:5007/");
//   sinon.assert.calledWith(app.set, "API.PATHS.SESSION", "session");
//   sinon.assert.calledWith(app.set, "API.PATHS.AUTHORIZATION", "authorization");
// });
//
// it("should set Oauth paths", () => {
//   AppSetup.init(app);
//
//   sinon.assert.calledWith(app.set, "APP.PATHS.ENTRYPOINT", "/");
// });
//   });
// });
