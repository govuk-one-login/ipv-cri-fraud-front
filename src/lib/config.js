require("dotenv").config();

module.exports = {
  API: {
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
    ANALYTICS: {
      COOKIE_DOMAIN: process.env.ANALYTICS_DOMAIN || "localhost",
      UA_CONTAINER_ID: process.env.UA_CONTAINER_ID,
      GA4_ENABLED: process.env.GA4_ENABLED || "false",
      GA4_CONTAINER_ID: process.env.GA4_CONTAINER_ID
    }
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
