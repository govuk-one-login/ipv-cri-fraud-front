import { describe, expect, it, vi, afterEach } from "vitest";
import { init, isDynamo } from "./session-config.js";
import * as sessionDbConfig from "./dynamo-session-config.js";

describe("app", () => {
  afterEach(() => {
    vi.resetAllMocks()
  });

  describe("setup session", () => {
    it("should initialise session config", async () => {
      vi.spyOn(sessionDbConfig, "createSessionStore").mockReturnValue(
        "sessionStoreMock"
      );
      const initialisedSessionConfig = await init();
      expect(initialisedSessionConfig).to.deep.equal({
        cookieName: "service_session",
        secret: "1234",
        cookieOptions: { maxAge: 7200000 },
        ...{ sessionStore: "sessionStoreMock" }
      });
    });

    it("should return true if table name is set", () => {
      const isDynamoName = isDynamo();
      expect(isDynamoName).to.be.true;
    });
  });
});
