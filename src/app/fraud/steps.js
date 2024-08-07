const check = require("./controllers/check");

module.exports = {
  "/": {
    resetJourney: true,
    entryPoint: true,
    skip: true,
    next: "check"
  },
  "/check": {
    prereqs: ["/"],
    controller: check,
    next: "/oauth2/callback"
  }
};
