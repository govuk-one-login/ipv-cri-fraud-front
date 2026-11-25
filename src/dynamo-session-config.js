import { config } from "./lib/config.js";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import session from "express-session";
import DynamoDBStoreFactory from "connect-dynamodb";
const DynamoDBStore = DynamoDBStoreFactory(session);

const createSessionStore = () => {
  const dynamodbClient = new DynamoDBClient({
    region: "eu-west-2"
  });

  return new DynamoDBStore({
    client: dynamodbClient,
    table: config.SESSION_TABLE_NAME
  });
};

export { createSessionStore };
