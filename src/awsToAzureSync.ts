import {S3Handler} from "aws-lambda";
import {GetObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {BlobServiceClient, BlockBlobClient, StorageSharedKeyCredential} from "@azure/storage-blob";
import {Readable, Stream} from "node:stream";

/** Create AWS Client **/
const s3Client = new S3Client();

/** Creating Azure Blob Client **/
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME as string;
if (!accountName) throw Error('Azure Storage accountName not found');

const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY as string;
if (!accountKey) throw Error('Azure Storage accountKey not found');

const sharedKeyCredential = new StorageSharedKeyCredential(
  accountName,
  accountKey
);
const baseUrl = `https://${accountName}.blob.core.windows.net`;
const containerName = process.env.AZURE_CONTAINER_NAME as string;
const blobServiceClient = new BlobServiceClient(
  `${baseUrl}`,
  sharedKeyCredential
);
/** End Creating Azure Blob Client **/

export const handler: S3Handler = async (event, _context, _callback) => {
  const {bucket: {name}, object: {key}} = event.Records[0].s3;
  const getObjectCommand = new GetObjectCommand({Bucket: name, Key: key});
  const { Body , ContentType} = await s3Client.send(getObjectCommand);

  /**
   * Uploading file to Azure
   */
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient: BlockBlobClient = containerClient.getBlockBlobClient(key);
  // Values used are default values
  await blockBlobClient.uploadStream(Body as Readable, 8 * 1024 * 1024, 5, {
    blobHTTPHeaders: {
      blobContentType: ContentType
    }
  });
}
