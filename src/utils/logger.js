import pkg from "../../package.json" with { type: "json" };
const { name } = pkg;
import commonExpress from "@govuk-one-login/di-ipv-cri-common-express";
const wrapper = commonExpress.bootstrap.logger;

/** @type {import("pino").Logger} */
const LOGGER = wrapper.get(name);

/**
 * @param {import("express").Request} req
 * @param {Error} err
 * @param {{ messagePrefix?: string }} [options]
 */
LOGGER.logError = (req, err, options) =>
  wrapper.logError(req, err, { logger: LOGGER, ...options });

export { LOGGER };
