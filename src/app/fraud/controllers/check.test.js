import { describe, expect, it, beforeEach, vi, afterEach } from "vitest";
import Controller from "hmpo-form-wizard/lib/controller/index.js";
import { FraudCheckController } from "./check.js" ;
import { createDefaultReqResNext } from "../../../../test/utils/vi-helpers.js";

const sessionId = "some-session-id";

describe("check controller", () => {
  const check = new FraudCheckController({ route: "/test" });

  let req;
  let res;
  let next;

  beforeEach(() => {
    const setup = createDefaultReqResNext();
    req = setup.req;
    res = setup.res;
    next = setup.next;

    req.session.tokenId = sessionId;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should be an instance of BaseController", () => {
    expect(check).to.be.an.instanceof(Controller);
  });

  it("should call the identity-check lambda and continue the journey", async () => {
    req.customFetch = vi.fn().mockResolvedValue(new Response());

    await check.saveValues(req, res, next);

    expect(req.customFetch).toHaveBeenCalledWith("/identity-check", {
      method: "POST",
      headers: { session_id: sessionId },
      timeoutMs: 30_000
    });
  });

  it("should forward errors to the callback", async () => {
    const error = new Error("identity-check unavailable");
    req.customFetch = vi.fn().mockRejectedValue(error);

    await check.saveValues(req, res, next);

    expect(next).calledWith(error);
  });
});
