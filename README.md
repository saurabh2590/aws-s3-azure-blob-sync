# A simple CDK project to keep AWS S3 and Azure in Sync

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template

# Deploying the stack
* Start with
  * `nvm use` (https://github.com/nvm-sh/nvm) -> Node Verision manager
  * `nvm install` (Install required Node Version)
  * `npm install` (Install modules)
* Create `.env` file with the correct values as in `.env.example` file 
* BootStrap the CDK in target region if doing it first time.
  * `npm run cdk -- --profile ${AWS_PROFILE} bootstrap aws://${AWS_ACCOUNT_ID}/${AWS_REGION}` 
* Run build layers script to generate NodeJS layers
  * `./build_layers.sh`
* Run build to generate compiled lambda code
  * `npm run build-lambda` 
* Deploy Lambda
  * `npm run cdk -- --profile ${AWS_PROFILE} deploy AwsS3AzureBlobSyncStack`
