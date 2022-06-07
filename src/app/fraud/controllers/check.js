const BaseController = require("hmpo-form-wizard").Controller;

const {
  API: {
    PATHS: { CHECK },
  },
} = require("../../../lib/config");

class FraudCheckController extends BaseController {
  async saveValues(req, res, callback) {
    await req.axios.post(`${CHECK}`, {}, {
      headers: {
        'Content-Type': 'application/application-json',
        'session_id': req.session.tokenId
      }
    });


    return super.saveValues(req, res, callback);
  }
}

module.exports = FraudCheckController;
