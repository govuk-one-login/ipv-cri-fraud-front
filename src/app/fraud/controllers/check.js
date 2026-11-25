import Controller from "hmpo-form-wizard/lib/controller/index.js";
import { createPersonalDataHeaders } from "@govuk-one-login/frontend-passthrough-headers";
import { LOGGER } from "../../../utils/logger.js";
import { config } from "../../../lib/config.js";

const {
  API: {
    BASE_URL,
    PATHS: { CHECK }
  }
} = config;

export class FraudCheckController extends Controller {
  async saveValues(req, res, callback) {
    const headers = {
      session_id: req.session.tokenId,
      ...createPersonalDataHeaders(`${BASE_URL}${CHECK}`, req)
    };

    try {
      LOGGER.info("check: calling identity-check lambda");
      await req.customFetch(CHECK, {
        method: "POST",
        headers,
        timeoutMs: 30_000
      });
    } catch (error) {
      LOGGER.logError(req, error, { messagePrefix: "check" });
      return callback(error);
    }

    return super.saveValues(req, res, callback);
  }
}

