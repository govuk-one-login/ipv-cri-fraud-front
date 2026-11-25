import { vi } from "vitest";
import JourneyModel from "hmpo-form-wizard/lib/journey-model.js";
import WizardModel from "hmpo-form-wizard/lib/wizard-model.js";


process.env.SESSION_SECRET = "1234";
process.env.SESSION_TABLE_NAME = "table-name";
process.env.USE_PINO_LOGGER = "true";

export const createDefaultReqResNext = () => {
  const req = {
    form: { values: {} },
    customFetch: vi.fn(),
    session: {
      "hmpo-wizard-previous": {}
    }
  };
  req.journeyModel = new JourneyModel(null, {
    req,
    key: "test",
  });

  req.sessionModel = new WizardModel(null, {
    req,
    key: "test",
    journeyModel: req.journeyModel,
    fields: {},
  });

  const res = {
    redirect: vi.fn()
  };
  res.redirect = vi.fn();
  const next = vi.fn();
  return {
    req,
    res,
    next,
  };
};
