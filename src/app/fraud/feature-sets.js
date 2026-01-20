const {
  API: { PACKAGE_NAME }
} = require("../../lib/config");
const logger = require("hmpo-logger").get(PACKAGE_NAME);

module.exports = function (req, res, next) {
  try {
    const featureSet = req.query.featureSet;
    const isValidFeatureSet = /^\w{1,32}(,\w{1,32})*$/.test(featureSet);
    if (!isValidFeatureSet) {
      return next(new Error("Invalid feature set ID"));
    }

    if (featureSet !== undefined) {
      logger.request("feature set is " + featureSet);
      req.session.featureSet = featureSet;
    }
    next();
  } catch (error) {
    return next(error);
  }
};
