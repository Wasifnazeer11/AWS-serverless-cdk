import * as cdk from 'aws-cdk-lib/core';
import * as pinpoint from 'aws-cdk-lib/aws-pinpoint';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Duration } from 'aws-cdk-lib/core';
import * as iam from 'aws-cdk-lib/aws-iam';

import { Construct } from 'constructs';

export class EmailSystemPinpoint extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a Pinpoint Application
    const pinpointApp = new pinpoint.CfnApp(this, 'MyPinpointApp', {
      name: 'MyPinpointApp', // Replace with your desired application name
    });

    // Define the Lambda function
    const emailLambda = new lambda.Function(this, 'PinpointEmailLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        PINPOINT_APPLICATION_ID: pinpointApp.ref,
        EMAIL_IDENTITY: 'wasifnazeer11@gmail.com', // Replace with your verified email address
      },
      timeout: Duration.seconds(10),
    });

    // Create a new IAM policy statement
    const pinpointPolicy = new iam.PolicyStatement({
      actions: ['mobiletargeting:SendMessages'],
      resources: ['*'], // You might want to limit this to specific resources
    });

    // Grant permissions to the Lambda function to send emails via Pinpoint
    emailLambda.addToRolePolicy(pinpointPolicy);
  }
}

