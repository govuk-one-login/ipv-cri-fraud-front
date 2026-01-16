const {
  API: { PACKAGE_NAME }
} = require("./config");
const logger = require("hmpo-logger").get(PACKAGE_NAME);

/**
 * patches a race condition in di-ipv-cri-common-express where express-session with DynamoDB store
 * doesn't guarantee session persistence before redirect
 */
module.exports = function ensureSessionSavedBeforeRedirect(req, res, next) {
  const originalRedirect = res.redirect.bind(res);

  res.redirect = function (statusOrUrl, url) {
    const actualUrl = typeof statusOrUrl === "string" ? statusOrUrl : url;
    const status = typeof statusOrUrl === "number" ? statusOrUrl : 302;

    if (req.session && req.session.save) {
      req.session.save((err) => {
        if (err) {
          logger.request("Error saving session before redirect", {
            url: actualUrl,
            error: err.message
          });
          return originalRedirect.call(res, status, actualUrl);
        }
        originalRedirect.call(res, status, actualUrl);
      });
    } else {
      originalRedirect.call(res, status, actualUrl);
    }
  };

  next();
};
