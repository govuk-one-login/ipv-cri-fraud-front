const featureSets = require("./app/fraud/featureSets");

const commonExpress = require("@govuk-one-login/di-ipv-cri-common-express");
const { getGTM, getLanguageToggle } = commonExpress.lib.locals;
const setScenarioHeaders = commonExpress.lib.scenarioHeaders;
const setAxiosDefaults = commonExpress.lib.axios;

const steps = require("./app/fraud/steps");
const fields = require("./app/fraud/fields");
const wizard = require("hmpo-form-wizard");

const init = (router) => {
  router.use(getGTM);
  router.use(getLanguageToggle);
  router.use(setScenarioHeaders);
  router.use(setAxiosDefaults);
  router.use(featureSets);

  router.use("/oauth2", commonExpress.routes.oauth2);

  const wizardOptions = {
    name: "fraud-cri-front",
    journeyName: "fraud",
    templatePath: "fraud"
  };

  router.use(wizard(steps, fields, wizardOptions));

  router.use(commonExpress.lib.errorHandling.redirectAsErrorToCallback);
};

module.exports = { init };
