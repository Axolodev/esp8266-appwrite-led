import type { NextApiRequest, NextApiResponse } from "next";
import sdk from "node-appwrite";
import { client, cors, environment, runMiddleware } from "../../apiHelpers";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Run the middleware
  await runMiddleware(req, res, cors);

  const { red, green, blue } = JSON.parse(req.body);

  const databases = new sdk.Databases(client);
  const result = await databases.listDocuments(
    environment.databaseId,
    environment.collectionId
  );

  const colorDocument = result.documents[0];

  try {
    await databases.updateDocument(
      environment.databaseId,
      environment.collectionId,
      colorDocument.$id,
      {
        red,
        green,
        blue,
      }
    );
    res.send(200);
    return;
  } catch (exception) {
    console.log(exception);
    res.status(500).send(exception);
    return;
  }
}
