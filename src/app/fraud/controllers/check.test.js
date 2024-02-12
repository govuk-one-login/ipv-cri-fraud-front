const BaseController = require("hmpo-form-wizard").Controller;
const FraudCheckController = require("./check");

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
    req.session.id = "some-session-id";
  });

  it("should be an instance of BaseController", () => {
    expect(check).to.be.an.instanceof(BaseController);
  });

  it("should retrieve auth code from cri-fraud-api and store in session", async () => {
    const sessionId = "fraud123";

    req.session.tokenId = sessionId;
    req.session.authParams = {
      redirect_uri: "https://client.example.com",
      state: "A VALUE"
    };

    const data = {
      authorization_code: "1234"
    };

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
});
