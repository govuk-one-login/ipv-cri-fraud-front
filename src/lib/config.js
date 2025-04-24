require("dotenv").config();

module.exports = {
  API: {
    PACKAGE_NAME: "di-ipv-cri-fraud-front",
    BASE_URL: process.env.API_BASE_URL || "http://localhost:5007/",
    PATHS: {
      SESSION: "session",
      CHECK: "identity-check",
      AUTHORIZATION: "authorization"
    }
  },
  APP: {
    BASE_URL: process.env.EXTERNAL_WEBSITE_HOST || "http://localhost:5030",
    PATHS: {
      FRAUD: "/"
    },
    GTM: {
      GA4_ID: process.env.GOOGLE_ANALYTICS_4_GTM_CONTAINER_ID || "GTM-XXXXXXX",
      UA_ID: process.env.UNIVERSAL_ANALYTICS_GTM_CONTAINER_ID || "UA-XXXXXXX",
      ANALYTICS_COOKIE_DOMAIN: process.env.FRONTEND_DOMAIN || "localhost",
      GA4_ENABLED: process.env.GA4_ENABLED || true,
      UA_ENABLED: process.env.UA_ENABLED || false,
      ANALYTICS_DATA_SENSITIVE: process.env.ANALYTICS_DATA_SENSITIVE || false, // Redacts all form response data, defaulted to `true`. Only to be set to `false` if a journey section contains no PII in none text based form controls
      GA4_PAGE_VIEW_ENABLED: process.env.GA4_PAGE_VIEW_ENABLED || true,
      GA4_FORM_RESPONSE_ENABLED: process.env.GA4_FORM_RESPONSE_ENABLED || true,
      GA4_FORM_ERROR_ENABLED: process.env.GA4_FORM_ERROR_ENABLED || true,
      GA4_FORM_CHANGE_ENABLED: process.env.GA4_FORM_CHANGE_ENABLED || true,
      GA4_NAVIGATION_ENABLED: process.env.GA4_NAVIGATION_ENABLED || true,
      GA4_SELECT_CONTENT_ENABLED: process.env.GA4_SELECT_CONTENT_ENABLED || true
    },
    LANGUAGE_TOGGLE_DISABLED: process.env.LANGUAGE_TOGGLE_DISABLED || true,
    DEVICE_INTELLIGENCE_ENABLED:
      process.env.DEVICE_INTELLIGENCE_ENABLED || false,
    DEVICE_INTELLIGENCE_DOMAIN: process.env.FRONTEND_DOMAIN || "localhost"
  },
  PORT: process.env.PORT || 5030,
  LOG_LEVEL: process.env.LOG_LEVEL || "request",
  SESSION_SECRET: process.env.SESSION_SECRET,
  SESSION_TABLE_NAME: process.env.SESSION_TABLE_NAME,
  SESSION_TTL: process.env.SESSION_TTL || 7200000, // two hours in ms
  REDIS: {
    SESSION_URL: process.env.REDIS_SESSION_URL,
    PORT: process.env.REDIS_PORT || 6379
  }
};
