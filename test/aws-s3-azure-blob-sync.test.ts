import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import {AwsS3ToStackitSyncStack} from "../lib/aws-s3-to-stackit-sync-stack";
import "jest-cdk-snapshot";
// example test. To run these tests, uncomment this file along with the
// example resource in lib/aws-s3-azure-blob-sync-stack.ts
test('SQS Queue Created', () => {
  const app = new cdk.App();
    // WHEN
  const stack = new AwsS3ToStackitSyncStack(app, 'MyTestStack', {
    bucket: "some-bucket",
    targetBucket: "targetBucket",
    targeBucketAccessKeyId: "targeBucketAccessKeyId",
    targetBucketSecretAccessKey: "targetBucketSecretAccessKey"
  });
    // THEN
  const template = Template.fromStack(stack);

  expect(stack).toMatchCdkSnapshot({
    ignoreAssets: true,
  });
});
