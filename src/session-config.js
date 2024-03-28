const {
  SESSION_TABLE_NAME,
  SESSION_SECRET,
  SESSION_TTL
} = require("./lib/config");

const AWS = require("aws-sdk");
const session = require("express-session");
const DynamoDBStore = require("connect-dynamodb")(session);

const init = () => {
  AWS.config.update({
    region: "eu-west-2"
  });
  const dynamodb = new AWS.DynamoDB();

  const dynamoDBSessionStore = new DynamoDBStore({
    client: dynamodb,
    table: SESSION_TABLE_NAME
  });

  const sessionConfig = {
    cookieName: "service_session",
    secret: SESSION_SECRET,
    cookieOptions: { maxAge: SESSION_TTL },
    ...(SESSION_TABLE_NAME && { sessionStore: dynamoDBSessionStore })
  };

  return sessionConfig;
};

const isDynamo = () => {
  return SESSION_TABLE_NAME ? true : false;
};

module.exports = { init, isDynamo };
