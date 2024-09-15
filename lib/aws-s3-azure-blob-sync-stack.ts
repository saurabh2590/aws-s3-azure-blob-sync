import * as cdk from 'aws-cdk-lib';
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as logs from "aws-cdk-lib/aws-logs";
import {Construct} from 'constructs';
import * as path from "path";
import {LogGroupClass, RetentionDays} from "aws-cdk-lib/aws-logs";
import {S3EventSourceV2} from "aws-cdk-lib/aws-lambda-event-sources";
import {RemovalPolicy} from "aws-cdk-lib";

interface AwsS3AzureBlobSyncStackProps extends cdk.StackProps {
  bucket: string;
  azureStorageAccountName: string;
  azureStorageAccountKey: string;
  azureContainerName: string;
}

export class AwsS3AzureBlobSyncStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AwsS3AzureBlobSyncStackProps) {
    super(scope, id, props);
    const {bucket, azureContainerName, azureStorageAccountName, azureStorageAccountKey} = props
    /**
     * Layers to publish Node Modules functions
     */
    const nodeModulesLayer = new lambda.LayerVersion(
      this,
      "node-modules-layer",
      {
        code: lambda.Code.fromAsset(
          path.join(__dirname, "../layers/node")
        ),
        compatibleRuntimes: [lambda.Runtime.NODEJS_20_X],
        license: "Apache-2.0",
        description: "Node Modules layer for the Lambda",
      }
    );

    const awsAzureSyncLambdaLogGroup = new logs.LogGroup(
      this,
      "awsAzureSyncLambdaLogGroup",
      {
        logGroupName: `${bucket}-awsAzureSyncLambda`,
        retention: RetentionDays.ONE_WEEK,
        logGroupClass: LogGroupClass.INFREQUENT_ACCESS,
        removalPolicy: RemovalPolicy.DESTROY,
      },
    );

    const awsAzureSyncLambda = new lambda.Function(this, "aws-azure-sync-lambda", {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset("build"),
      timeout: cdk.Duration.seconds(60),
      logGroup: awsAzureSyncLambdaLogGroup,
      layers: [nodeModulesLayer],
      memorySize: 128,
      environment: {
        AZURE_STORAGE_ACCOUNT_NAME: azureStorageAccountName,
        AZURE_STORAGE_ACCOUNT_KEY: azureStorageAccountKey,
        AZURE_CONTAINER_NAME: azureContainerName
      },
      handler: "awsToAzureSync.handler",
      functionName: `s3-${bucket}-azure-${azureContainerName}-sync`
    });

    const s3Bucket = s3.Bucket.fromBucketName(this, `${bucket}-source`, bucket);
    s3Bucket.grantRead(awsAzureSyncLambda);

    awsAzureSyncLambda.addEventSource(
      new S3EventSourceV2(s3Bucket, {
        events: [s3.EventType.OBJECT_CREATED]
      })
    )
  }
}
