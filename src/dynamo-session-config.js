const { SESSION_TABLE_NAME } = require("./lib/config");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const session = require("express-session");
const DynamoDBStore = require("connect-dynamodb")(session);

const localDynamoDB = require("./utils/dynamodb-local");

const getClientConfig = () => {
  if (localDynamoDB.isLocalDev()) {
    return localDynamoDB.getLocalClientConfig();
  }

  return {
    region: "eu-west-2"
  };
};

const createSessionStore = () => {
  const clientConfig = getClientConfig();
  const dynamodbClient = new DynamoDBClient(clientConfig);

  if (localDynamoDB.isLocalDev() && SESSION_TABLE_NAME) {
    localDynamoDB
      .checkTableExists(dynamodbClient, SESSION_TABLE_NAME)
      .catch((error) => {
        console.error("[local DynamoDB] problem creating table:", error);
      });
  }

  return new DynamoDBStore({
    client: dynamodbClient,
    table: SESSION_TABLE_NAME
  });
};

module.exports = { createSessionStore };
