import {GetObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {EventBridgeHandler} from "aws-lambda/trigger/eventbridge";

/** Create AWS Client **/
const s3Client = new S3Client();

/** Creating STACKIT S3 Blob Client **/
const stackiS3Client = new S3Client({
  region: "eu01",
  endpoint: "https://object.storage.eu01.onstackit.cloud",
  credentials: {
    accessKeyId: process.env.TARGET_BUCKET_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.TARGET_BUCKET_SECRET_ACCESS_KEY || "",
  },
  forcePathStyle: true,
  customUserAgent: "AWS-SDK-S3/SkipMetadataCheck",
});

/**
 * skipRegionValidation: true,
 *       s3UsePathStyle: true,
 *       skipCredentialsValidation: true,
 *       skipMetadataApiCheck: Token.asString(true),
 *       skipRequestingAccountId: true,
 *       accessKey,
 *       secretKey,
 *       endpoints: [
 *         {
 *           s3: STACKIT_ENDPOINT_URL_S3,
 *         },
 *       ],
 */
const targetBucket = process.env.TARGET_BUCKET || "content-db-cop00";
/** End Creating Azure Blob Client **/

const getNewKey = (oldKey: string) => {
  // some logic based on path mapping
  return oldKey;
}

export const handler: EventBridgeHandler<any, any, any> = async (event, _context, _callback) => {
  const {detail: {bucket: {name}, object: {key}}} = event;
  const getObjectCommand = new GetObjectCommand({Bucket: name, Key: key});
  const { Body , ContentType, ContentLength} = await s3Client.send(getObjectCommand);

  /**
   * Uploading file to Azure
   */
  const putObjectCommand = new PutObjectCommand({Bucket: targetBucket, Key: getNewKey(key), Body, ContentLength, ContentType})
  await stackiS3Client.send(putObjectCommand);
}
