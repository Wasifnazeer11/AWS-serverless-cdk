import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as awsApiGateway from 'aws-cdk-lib/aws-apigateway';
import * as Ses from 'aws-cdk-lib/aws-ses';
import * as Iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class SesservicesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

// Create the Lambda function
const SESLAMBDA = new lambda.Function(this, "SESHANDLER", {
  runtime: lambda.Runtime.NODEJS_16_X,
  code: lambda.Code.fromAsset("lambda"),
  handler: "index.handler",
});

// Grant SES permissions to the Lambda function
const sesPolicyStatement = new Iam.PolicyStatement({
  actions: ['ses:SendEmail', 'ses:SendRawEmail'],
  resources: ['*'], // Be cautious about using '*' in production
});
SESLAMBDA.addToRolePolicy(sesPolicyStatement);

// Create the API Gateway
const api = new awsApiGateway.RestApi(this, 'EmailApi');

// Create the Lambda integration
const integration = new awsApiGateway.LambdaIntegration(SESLAMBDA);

// Create a POST method to invoke the Lambda function
const sendEmailsResource = api.root.addResource('send-emails');
sendEmailsResource.addMethod('POST', integration);
}
}


