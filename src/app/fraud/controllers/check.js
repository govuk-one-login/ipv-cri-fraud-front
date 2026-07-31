const BaseController = require("hmpo-form-wizard").Controller;
const {
  createPersonalDataHeaders
} = require("@govuk-one-login/frontend-passthrough-headers");
const LOGGER = require("../../../utils/logger");

const {
  API: {
    BASE_URL,
    PATHS: { CHECK }
  }
} = require("../../../lib/config");

class FraudCheckController extends BaseController {
  async saveValues(req, res, callback) {
    const headers = {
      session_id: req.session.tokenId,
      ...createPersonalDataHeaders(`${BASE_URL}${CHECK}`, req)
    };

    try {
      LOGGER.info("check: calling identity-check lambda");
      await req.axios.post(`${CHECK}`, {}, { headers });
    } catch (error) {
      LOGGER.logError(req, error, { messagePrefix: "check" });
      return callback(error);
    }

    return super.saveValues(req, res, callback);
  }
}

module.exports = FraudCheckController;
