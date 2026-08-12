const BaseController = require("hmpo-form-wizard").Controller;
const FraudCheckController = require("./check");

const sessionId = "some-session-id";

describe("check controller", () => {
  const check = new FraudCheckController({ route: "/test" });

  let req;
  let res;
  let next;
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    const setup = setupDefaultMocks();
    req = setup.req;
    res = setup.res;
    next = setup.next;

    req.session.tokenId = sessionId;
  });

  afterEach(() => sandbox.restore());

  it("should be an instance of BaseController", () => {
    expect(check).to.be.an.instanceof(BaseController);
  });

  it("should call the identity-check lambda and continue the journey", async () => {
    req.customFetch = sandbox.stub().resolves(new Response());

    await check.saveValues(req, res, next);

    sandbox.assert.calledWith(req.customFetch, "/identity-check", {
      method: "POST",
      headers: { session_id: sessionId },
      timeoutMs: 30_000
    });
    expect(next).to.have.been.calledOnceWithExactly();
  });

  it("should forward errors to the callback", async () => {
    const error = new Error("identity-check unavailable");
    req.customFetch = sandbox.stub().rejects(error);

    await check.saveValues(req, res, next);

    expect(next).to.have.been.calledOnceWithExactly(error);
  });
});
