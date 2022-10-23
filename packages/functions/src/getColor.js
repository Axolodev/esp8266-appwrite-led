require("dotenv").config();
const sdk = require("node-appwrite");

const client = new sdk.Client();

const requiredEnvVars = [
  "APPWRITE_HOSTNAME",
  "APPWRITE_FUNCTION_PROJECT_ID",
  "APPWRITE_APIKEY",
  "APPWRITE_DATABASE_ID",
  "APPWRITE_COLLECTION_ID",
];

module.exports = async (req, res) => {
  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !req.variables[envVar]
  );
  if (missingEnvVars.length > 0) {
    console.error(
      "Some environment variables were not set. Function cannot use Appwrite SDK."
    );
    console.error(
      `Please set the ${missingEnvVars.join(
        ", "
      )} environment variable(s) for this function.`
    );

    return res.send(`Missing env variables: ${missingEnvVars.join(", ")}`, 500);
  }

  client
    .setEndpoint(req.variables["APPWRITE_HOSTNAME"])
    .setProject(req.variables["APPWRITE_FUNCTION_PROJECT_ID"])
    .setKey(req.variables["APPWRITE_APIKEY"]);

  const database = new sdk.Databases(client);

  const databaseId = req.variables["APPWRITE_DATABASE_ID"];
  const collectionId = req.variables["APPWRITE_COLLECTION_ID"];

  database
    .listDocuments(databaseId, collectionId)
    .then((response) => {
      const document = response.documents[0];
      const { red, green, blue } = document;
      const color = { red, green, blue };
      res.send({ color });
      return;
    })
    .catch((error) => {
      console.error(error);
      res.send(error, 500);
    });
};
