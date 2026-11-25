import { FraudCheckController as check } from './controllers/check.js'

export const steps= {
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
