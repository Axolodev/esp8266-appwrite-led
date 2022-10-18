import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import sdk from "node-appwrite";

export const environment = {
  hostname: process.env.APPWRITE_HOSTNAME,
  projectId: process.env.APPWRITE_PROJECTID,
  key: process.env.APPWRITE_APIKEY,
  databaseId: process.env.APPWRITE_DATABASE_ID,
  collectionId: process.env.APPWRITE_COLLECTION_ID,
};
// Client that gets the Users collection
const client = new sdk.Client();
client
  .setEndpoint(environment.hostname)
  .setProject(environment.projectId)
  .setKey(environment.key);

export { client };

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
export const cors = Cors({
  methods: ["POST", "GET", "HEAD"],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
export function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}
