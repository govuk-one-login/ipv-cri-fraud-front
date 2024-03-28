// const sessionConfig = require("./session-config");
// const AWS = require("aws-sdk");
//
// describe("app", () => {
//   const sandbox = sinon.createSandbox();
//   beforeEach(() => {
//     update = sandbox.stub();
//     sandbox.stub(AWS, "config.update");
//     setup = sinon.stub();
//     setGTM = sinon.stub();
//     app = sinon.stub();
//     dynamoDb = sinon.stub();
//     dynamoDBSessionStore = sinon.stub();
// AWS = {
//   DynamoDB: sinon.stub().returns(dynamoDb),
//   config: {
//     update: sinon.stub()
//   }
// };
//     DynamoDBStore = sinon.stub().returns(dynamoDBSessionStore);
//   });
//
//   describe("setup session", () => {
//     it("should initialise session config", () => {
//       var initialisedSessionConfig = sessionConfig.init();
//       sinon.assert.calledOnce(update);
//       sinon.assert.calledWith(update, sinon.match.has("region", "eu-west-2"));
//       // sinon.assert.calledOnce(AWS.DynamoDB);
//       // sinon.assert.calledWith({client: dynamoDb, table: "table-name"})
//       expect(initialisedSessionConfig).to.equal({
//         cookieName: "service_session",
//         secret: "1234",
//         cookieOptions: { maxAge: 7200000 },
//         ...("table-name" && { sessionStore: dynamoDBSessionStore })})
//     })
//   })
// });
//   const loggerConfig = {
//     consoleLevel: LOG_LEVEL,
//     console: true,
//     consoleJSON: true,
//     app: false
//   };
//
//   AWS.config.update({
//     region: "eu-west-2"
//   });
//   const dynamodb = new AWS.DynamoDB();
//
//   const dynamoDBSessionStore = new DynamoDBStore({
//     client: dynamodb,
//     table: SESSION_TABLE_NAME
//   });
//
//   const helmetConfig = commonExpress.lib.helmet;
//
//   const sessionConfig = {
//     cookieName: "service_session",
//     secret: SESSION_SECRET,
//     cookieOptions: {maxAge: SESSION_TTL},
//     ...(SESSION_TABLE_NAME && {sessionStore: dynamoDBSessionStore})
//   };
//
//   let options = {
//     config: {APP_ROOT: __dirname},
//     port: PORT,
//     logs: loggerConfig,
//     session: sessionConfig,
//     helmet: helmetConfig,
//     redis: SESSION_TABLE_NAME ? false : commonExpress.lib.redis(),
//     urls: {
//       public: "/public",
//       publicImages: "/public/images"
//     },
//     publicDirs: ["../dist/public"],
//     publicImagesDirs: ["../dist/public/images"],
//     translation: {
//       allowedLangs: ["en", "cy"],
//       fallbackLang: ["en"],
//       cookie: {name: "lng"}
//     },
//     views: [
//       path.resolve(
//         path.dirname(
//           require.resolve("@govuk-one-login/di-ipv-cri-common-express")
//         ),
//         "components"
//       ),
//       "views"
//     ],
//     middlewareSetupFn: (app) => {
//       app.use(setHeaders);
//     },
//     dev: true
//   };
//
//   setup(options);
//
//   expect(setup).to.have.been.calledWithExactly(options);
//   sinon.assert.calledWith(setup, sinon.match.has("port", 5030));
// });
