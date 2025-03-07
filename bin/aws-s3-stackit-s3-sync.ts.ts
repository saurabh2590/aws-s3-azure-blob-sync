#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {AwsS3ToStackitSyncStack, SyncStackProps} from '../lib/aws-s3-to-stackit-sync-stack';
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({path: path.resolve(__dirname, "../.env")});

// 3. Define a function to retrieve our env variables
export const getConfig = (): SyncStackProps => ({
  bucket: process.env.AWS_SOURCE_BUCKET || "",
  targetBucket: process.env.STACKIT_TARGET_BUCKET || "",
  targeBucketAccessKeyId: process.env.STACKIT_TARGET_BUCKET_ACCESS_KEY_ID || "",
  targetBucketSecretAccessKey: process.env.STACKIT_TARGET_BUCKET_SECRET_ACCESS_KEY || ""
});

const app = new cdk.App();
const region = app.node.tryGetContext("region") || "eu-central-1";

const config = getConfig();
new AwsS3ToStackitSyncStack(app, 'AwsS3ToStackitS3Sync', {
  ...config,
  env: {region},
  stackName: `${config.bucket}-to-${config.targetBucket}`
});
