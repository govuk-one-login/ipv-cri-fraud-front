const express = require("express");

const router = express.Router();

const {
  addAuthParamsToSession,
  redirectToCallback,
  retrieveAuthorizationCode,
  initSessionWithJWT,
  redirectToFraud,
  addJWTToRequest,
} = require("./middleware");

router.get(
  "/authorize",
  addAuthParamsToSession,
  addJWTToRequest,
  initSessionWithJWT,
  redirectToFraud
);
router.post("/authorize", retrieveAuthorizationCode, redirectToCallback);

module.exports = router;
