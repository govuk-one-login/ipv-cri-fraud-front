const BaseController = require("hmpo-form-wizard").Controller;
const {
  createPersonalDataHeaders
} = require("@govuk-one-login/frontend-passthrough-headers");

const {
  API: {
    BASE_URL,
    PATHS: { CHECK }
  }
} = require("../../../lib/config");

class FraudCheckController extends BaseController {
  async saveValues(req, res, callback) {
    const headers = {
      "Content-Type": "application/application-json",
      session_id: req.session.tokenId,
      ...createPersonalDataHeaders(`${BASE_URL}${CHECK}`, req)
    };

    await req.axios.post(`${CHECK}`, {}, { headers: headers });

    return super.saveValues(req, res, callback);
  }
}

module.exports = FraudCheckController;
