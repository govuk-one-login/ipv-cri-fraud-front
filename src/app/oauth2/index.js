const express = require("express");

const router = express.Router();

const {
  addAuthParamsToSession,
  redirectToCallback,
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
router.get("/callback", redirectToCallback);

module.exports = router;
