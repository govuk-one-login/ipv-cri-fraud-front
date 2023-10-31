require("dotenv").config();

module.exports = {
  API: {
    BASE_URL: process.env.API_BASE_URL || "http://localhost:5007/",
    PATHS: {
      SESSION: "session",
      CHECK: "identity-check",
      AUTHORIZATION: "authorization",
    },
  },
  APP: {
    BASE_URL: process.env.EXTERNAL_WEBSITE_HOST || "http://localhost:5030",
    PATHS: {
      FRAUD: "/",
    },
    ANALYTICS: {
      ID: process.env.GTM_ID,
      COOKIE_DOMAIN: process.env.ANALYTICS_DOMAIN || "localhost",
    },
  },
  PORT: process.env.PORT || 5030,
  LOG_LEVEL: process.env.LOG_LEVEL || "request",
  SESSION_SECRET: process.env.SESSION_SECRET,
  SESSION_TABLE_NAME: process.env.SESSION_TABLE_NAME,
  SESSION_TTL: process.env.SESSION_TTL || 7200000, // two hours in ms
  REDIS: {
    SESSION_URL: process.env.REDIS_SESSION_URL,
    PORT: process.env.REDIS_PORT || 6379,
  },
};
