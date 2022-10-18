import type { NextApiRequest, NextApiResponse } from "next";
import sdk from "node-appwrite";
import type { LedColor } from "../../types";
import { client, cors, environment, runMiddleware } from "../../apiHelpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ color: LedColor }>
) {
  // Run the middleware
  await runMiddleware(req, res, cors);

  const database = new sdk.Databases(client);

  const databaseId = environment.databaseId;
  const collectionId = environment.collectionId;

  try {
    const documentList = await database.listDocuments(databaseId, collectionId);
    const document = documentList.documents[0];
    // @ts-ignore
    const { red, green, blue } = document;
    const color = { red, green, blue };
    res.send({ color });
    return;
  } catch (exception) {
    console.log(exception);
    res.status(500).send(exception);
    return;
  }
}
