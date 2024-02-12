const BaseController = require("hmpo-form-wizard").Controller;

const {
  API: {
    PATHS: { CHECK }
  }
} = require("../../../lib/config");

class FraudCheckController extends BaseController {
  async saveValues(req, res, callback) {
    const headers = {
      "Content-Type": "application/application-json",
      session_id: req.session.tokenId
    };

    if (req.session.featureSet === "crosscoreV2") {
      headers["crosscore-version"] = "2";
    }

    await req.axios.post(`${CHECK}`, {}, { headers: headers });

    return super.saveValues(req, res, callback);
  }
}

module.exports = FraudCheckController;
