import { describe, expect, it, beforeEach, vi, afterEach } from "vitest";
import { featureSets } from "./featureSets.js";
import { createDefaultReqResNext } from "../../../test/utils/vi-helpers.js";

describe("feature sets", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    const setup = createDefaultReqResNext();
    req = setup.req;
    res = setup.res;
    next = setup.next;
  });
  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("validateFeatureSet", () => {
    beforeEach(() => {
      req = {
        query: {},
        session: {}
      };
      res = {};
    });

    it("should call next if featureSet is valid", async () => {
      req.query.featureSet = "F01";
      await featureSets(req, res, next);
      expect(req.session.featureSet).to.equal("F01");
      expect(next).to.have.been.calledOnce;
    });

    it("should call next if comma delimited featureSet is valid", async () => {
      req.query.featureSet = "F01,F02";
      await featureSets(req, res, next);
      expect(req.session.featureSet).to.equal("F01,F02");
      expect(next).to.have.been.calledOnce;
    });

    it("should throw an error if featureSet is invalid", async () => {
      req.query.featureSet = "invalid-featureset";
      await featureSets(req, res, next);
      // expect(next).to.have.been.calledWith(
      //   sinon.match
      //     .instanceOf(Error)
      //     .and(sinon.match.has("message", "Invalid feature set ID"))
      // );

      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe("Invalid feature set ID");
      expect(req.session.featureSet).to.be.undefined;
    });

    it("should throw an error if comma delimited featureSet is invalid", async () => {
      req.query.featureSet = "FO1, F02";
      await featureSets(req, res, next);
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe("Invalid feature set ID");
      // expect(next).to.have.been.calledWith(
      //   sinon.match
      //     .instanceOf(Error)
      //     .and(sinon.match.has("message", "Invalid feature set ID"))
      // );
      expect(req.session.featureSet).to.be.undefined;
    });

    it("should throw an error if featureSet is empty", async () => {
      req.query.featureSet = "";
      await featureSets(req, res, next);
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe("Invalid feature set ID");
      // expect(next).to.have.been.calledWith(
      //   sinon.match
      //     .instanceOf(Error)
      //     .and(sinon.match.has("message", "Invalid feature set ID"))
      // );
      expect(req.session.featureSet).to.be.undefined;
    });

    it("should throw an error if featureSet is blank", async () => {
      req.query.featureSet = " ";
      await featureSets(req, res, next);

      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe("Invalid feature set ID");
      // expect(next).to.have.been.calledWith(
      //   sinon.match
      //     .instanceOf(Error)
      //     .and(sinon.match.has("message", "Invalid feature set ID"))
      // );
      expect(req.session.featureSet).to.be.undefined;
    });

    it("should call next if featureSet is undefined", async () => {
      req.query.featureSet = undefined;
      await featureSets(req, res, next);
      expect(req.session.featureSet).to.be.undefined;
      expect(next).to.have.been.calledOnce;
    });
  });
});
