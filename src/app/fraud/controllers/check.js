const BaseController = require("hmpo-form-wizard").Controller;

const {
  API: {
    PATHS: { CHECK },
  },
} = require("../../../lib/config");

var submitted = false

class FraudCheckController extends BaseController {
  async saveValues(req, res, callback) {
    if (submitted == false) {
      submitted = true;
      const fraudCheck = await req.axios
        .post(
          `${CHECK}`,
          {},
          {
            headers: {
              "Content-Type": "application/application-json",
              session_id: req.session.tokenId,
            },
          }
        )
        .then(function () {
          submitted = false;
        })
        .catch(function (error) {
          submitted = false;
          throw error;
        });

    req.session.authParams.authorization_code =
      fraudCheck.data?.authorization_code;

    return super.saveValues(req, res, callback);
    }
  }
}

module.exports = FraudCheckController;
