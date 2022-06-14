const express = require("express");
const router = express.Router();

router.use("/ipv-success", (req, res) => {
  res.render("return-to-dbs/page-ipv-success");
});

router.use("/prove-identity-check", (req, res) => {
  res.render("return-to-dbs/prove-identity-check");
});

router.use("/dbs-service", (req, res) => {
  res.render("return-to-dbs/dbs-service");
});
module.exports = router;
