import { Handler } from "aws-lambda";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";


const ddbDocClient = createDDbDocClient();
export const handler: Handler= async(event , context) =>{
    try{
        console.log(event)
        const commandOutput = await ddbDocClient.send(
            new ScanCommand({
              TableName: process.env.TABLE_NAME,
            })
          );
   const body = {
    data: commandOutput
   }
   // Return Response
   return {
    statusCode: 200,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  };
    }catch (error: any) {
        console.log(JSON.stringify(error));
        return {
          statusCode: 500,
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ error }),
        };
      }

}
function createDDbDocClient() {
  const ddbClient = new DynamoDBClient({ region: process.env.REGION });
  const marshallOptions = {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  };
  const unmarshallOptions = {
    wrapNumbers: false,
  };
  const translateConfig = { marshallOptions, unmarshallOptions };
  return DynamoDBDocumentClient.from(ddbClient, translateConfig);
}