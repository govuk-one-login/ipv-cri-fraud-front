const {
  CreateTableCommand,
  DescribeTableCommand,
  waitUntilTableExists
} = require("@aws-sdk/client-dynamodb");

const isLocalDev = () => {
  return !!process.env.LOCAL_DYNAMO_ENDPOINT_OVERRIDE;
};

const getLocalClientConfig = () => {
  return {
    region: "eu-west-2",
    endpoint: process.env.LOCAL_DYNAMO_ENDPOINT_OVERRIDE,
    credentials: {
      accessKeyId: "local",
      secretAccessKey: "local" // pragma: allowlist secret
    }
  };
};

const createTable = async (client, tableName) => {
  const createTableParams = {
    TableName: tableName,
    AttributeDefinitions: [
      {
        AttributeName: "id",
        AttributeType: "S"
      }
    ],
    KeySchema: [
      {
        AttributeName: "id",
        KeyType: "HASH"
      }
    ],
    BillingMode: "PAY_PER_REQUEST"
  };

  try {
    await client.send(new CreateTableCommand(createTableParams));
    console.log(`[local DynamoDB] table '${tableName}' created successfully`);

    await waitUntilTableExists(
      { client, maxWaitTime: 30 },
      { TableName: tableName }
    );
  } catch (error) {
    if (error.name === "ResourceInUseException") {
      console.log(`[local DynamoDB] table '${tableName}' already exists`);
    } else {
      console.error(
        `[local DynamoDB] problem creating table '${tableName}':`,
        error
      );
      throw error;
    }
  }
};

const checkTableExists = async (client, tableName) => {
  console.log(`[local DynamoDB] looking for existing table '${tableName}'`);
  try {
    await client.send(new DescribeTableCommand({ TableName: tableName }));
    console.log(`[local DynamoDB] table '${tableName}' exists`);
  } catch (error) {
    if (error.name === "ResourceNotFoundException") {
      console.log(
        `[local DynamoDB] table '${tableName}' not found, creating...`
      );
      await createTable(client, tableName);
    } else {
      throw error;
    }
  }
  console.log(`[local DynamoDB] table '${tableName}' ready`);
};

module.exports = {
  getLocalClientConfig,
  checkTableExists,
  isLocalDev
};
