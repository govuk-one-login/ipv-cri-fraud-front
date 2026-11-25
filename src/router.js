import { featureSets } from "./app/fraud/featureSets.js";
import { frontendUiMiddlewareIdentityBypass } from "@govuk-one-login/frontend-ui";
import commonExpress from "@govuk-one-login/di-ipv-cri-common-express";
import wizard from "hmpo-form-wizard";
const { getGTM, getDeviceIntelligence } = commonExpress.lib.locals;
const setScenarioHeaders = commonExpress.lib.scenarioHeaders;
const { customFetchMiddleware } = commonExpress.lib.customFetch;

import { steps } from './app/fraud/steps.js';
import { fields } from "./app/fraud/fields.js";

const routingService = (router) => {
  router.use(getGTM);
  router.use(getDeviceIntelligence);
  router.use(setScenarioHeaders);
  router.use(customFetchMiddleware);
  router.use(featureSets);
  router.use(frontendUiMiddlewareIdentityBypass);

  router.use("/oauth2", commonExpress.routes.oauth2);

  const wizardOptions = {
    name: "fraud-cri-front",
    journeyName: "fraud",
    templatePath: "fraud"
  };

  router.use(wizard(steps, fields, wizardOptions));

  router.use(commonExpress.lib.errorHandling.redirectAsErrorToCallback);
};

export { routingService };
