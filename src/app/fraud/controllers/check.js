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

    const featureSetList = req.session.featureSet?.split(",");

    if (featureSetList) {
      if (featureSetList.includes("crosscoreV2")) {
        headers["crosscore-version"] = "2";
      }

      if (featureSetList.includes("watchlist")) {
        headers["score-two-route"] = "watchlist";
      }
    }

    await req.axios.post(`${CHECK}`, {}, { headers: headers });

    return super.saveValues(req, res, callback);
  }
}

module.exports = FraudCheckController;
