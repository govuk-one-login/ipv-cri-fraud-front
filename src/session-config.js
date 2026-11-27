import { config } from "./lib/config.js";
import { createSessionStore } from "./dynamo-session-config.js";
const { SESSION_TABLE_NAME, SESSION_SECRET, SESSION_TTL } = config;

const init = () => {
  const sessionConfig = {
    cookieName: "service_session",
    secret: SESSION_SECRET,
    cookieOptions: { maxAge: SESSION_TTL },
    ...(SESSION_TABLE_NAME && {
      //sessionStore: dynamoSessionConfig.createSessionStore()
      sessionStore: createSessionStore()
    })
  };

  return sessionConfig;
};

const isDynamo = () => {
  return SESSION_TABLE_NAME ? true : false; // NOSONAR
};

export { init, isDynamo };
