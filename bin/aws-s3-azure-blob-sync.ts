#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsS3AzureBlobSyncStack } from '../lib/aws-s3-azure-blob-sync-stack';
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({path: path.resolve(__dirname, "../.env")});

export type ConfigProps = {
  bucket: string,
  azureContainerName: string;
  azureStorageAccountKey: string;
  azureStorageAccountName: string;
}

// 3. Define a function to retrieve our env variables
export const getConfig = (): ConfigProps => ({
  bucket: process.env.AWS_SOURCE_BUCKET || "",
  azureContainerName: process.env.AZURE_CONTAINER_NAME || "",
  azureStorageAccountKey: process.env.AZURE_STORAGE_ACCOUNT_KEY || "",
  azureStorageAccountName: process.env.AZURE_STORAGE_ACCOUNT_NAME || ""
});

const app = new cdk.App();
const region = app.node.tryGetContext("region") || "ap-south-1";

new AwsS3AzureBlobSyncStack(app, 'AwsS3AzureBlobSyncStack', {
  ...getConfig(),
  env: {region},
  stackName: `${getConfig().bucket}-AwsS3AzureBlobSyncStack`
});
