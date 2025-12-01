const BaseController = require("hmpo-form-wizard").Controller;
const FraudCheckController = require("./check");

const sessionId = "some-session-id";

describe("check controller", () => {
  const check = new FraudCheckController({ route: "/test" });

  let req;
  let res;
  let next;
  let sandbox;

  afterEach(() => sandbox.restore());

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    const setup = setupDefaultMocks();
    req = setup.req;
    res = setup.res;
    next = setup.next;

    req.session.JWTData = { authParams: {}, user_id: "a-users-id" };
    req.session.tokenId = sessionId;

    req.session.authParams = {
      redirect_uri: "https://client.example.com",
      state: "A VALUE"
    };
  });

  it("should be an instance of BaseController", () => {
    expect(check).to.be.an.instanceof(BaseController);
  });

  it("should retrieve auth code from cri-fraud-api and store in session", async () => {
    const data = {};

    const resolvedPromise = new Promise((resolve) => resolve({ data }));
    let stub = sandbox.stub(req.axios, "post").returns(resolvedPromise);

    await check.saveValues(req, res, next);

    sandbox.assert.calledWith(
      stub,
      "identity-check",
      {},
      {
        headers: {
          session_id: sessionId,
          "Content-Type": "application/application-json"
        }
      }
    );
    stub.restore();

    expect(req.sessionModel.get("redirect_url")).to.eq(data.redirectUrl);
  });

  describe("when featureSet includes 'crosscoreV2'", () => {
    it("should set the 'crosscore-version' header to '2'", async () => {
      req.session.featureSet = "crosscoreV2";
      const data = {};

      const resolvedPromise = new Promise((resolve) => resolve({ data }));
      let stub = sandbox.stub(req.axios, "post").returns(resolvedPromise);

      await check.saveValues(req, res, next);

      sandbox.assert.calledWith(
        stub,
        "identity-check",
        {},
        {
          headers: {
            session_id: sessionId,
            "Content-Type": "application/application-json",
            "crosscore-version": "2"
          }
        }
      );
    });
  });

  describe("when featureSet includes 'watchlist'", () => {
    it("should set the additional 'score-two-route' header to 'watchlist'", async () => {
      req.session.featureSet = "watchlist,crosscoreV2";
      const data = {};

      const resolvedPromise = new Promise((resolve) => resolve({ data }));
      let stub = sandbox.stub(req.axios, "post").returns(resolvedPromise);

      await check.saveValues(req, res, next);

      sandbox.assert.calledWith(
        stub,
        "identity-check",
        {},
        {
          headers: {
            session_id: sessionId,
            "Content-Type": "application/application-json",
            "score-two-route": "watchlist",
            "crosscore-version": "2"
          }
        }
      );
    });
  });

  describe("when featureSet includes something other than 'crosscoreV2'", () => {
    it("should not set the additional 'crosscore-version' header", async () => {
      req.session.featureSet = "not_crosscoreV2,watchlist";
      const data = {};

      const resolvedPromise = new Promise((resolve) => resolve({ data }));
      let stub = sandbox.stub(req.axios, "post").returns(resolvedPromise);

      await check.saveValues(req, res, next);

      sandbox.assert.calledWith(
        stub,
        "identity-check",
        {},
        {
          headers: {
            session_id: sessionId,
            "Content-Type": "application/application-json",
            "score-two-route": "watchlist"
          }
        }
      );
    });
  });

  describe("when featureSet includes something other than 'watchlist'", () => {
    it("should not set the additional 'score-two-route' header", async () => {
      req.session.featureSet = "crosscoreV2,not_watchlist";
      const data = {};

      const resolvedPromise = new Promise((resolve) => resolve({ data }));
      let stub = sandbox.stub(req.axios, "post").returns(resolvedPromise);

      await check.saveValues(req, res, next);

      sandbox.assert.calledWith(
        stub,
        "identity-check",
        {},
        {
          headers: {
            session_id: sessionId,
            "Content-Type": "application/application-json",
            "crosscore-version": "2"
          }
        }
      );
    });
  });
});
